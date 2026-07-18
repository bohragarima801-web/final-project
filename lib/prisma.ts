import { PrismaClient } from '@prisma/client'
import fs from 'fs'
import path from 'path'

// Robust manual .env loader checking multiple possible paths
try {
  const searchPaths = [
    path.join(process.cwd(), '.env'),
    path.join(__dirname, '.env'),
    path.join(__dirname, '..', '.env'),
    path.join(__dirname, '../..', '.env'),
    path.join(__dirname, '../../..', '.env'),
  ]
  let envPath = ''
  for (const p of searchPaths) {
    if (fs.existsSync(p)) {
      envPath = p
      break
    }
  }

  if (envPath) {
    const envContent = fs.readFileSync(envPath, 'utf-8')
    const lines = envContent.split(/\r?\n/)
    for (const line of lines) {
      const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/)
      if (match) {
        const key = match[1]
        let value = match[2] || ''
        if (value.startsWith('"') && value.endsWith('"')) {
          value = value.substring(1, value.length - 1)
        } else if (value.startsWith("'") && value.endsWith("'")) {
          value = value.substring(1, value.length - 1)
        }
        // Force set key and overwrite existing values to refresh dynamic configuration
        process.env[key] = value
      }
    }
  }
} catch (e) {
  console.error('Failed to load .env manually:', e)
}

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined; lastUsedUrl?: string }

// Explicitly pass the connection string URL to avoid Next.js bundling edge cases
const dbUrl = process.env.DATABASE_URL || 'postgresql://localhost:5432'

// If the database URL has changed since the last client initialization, clear the cached instance
if (globalForPrisma.prisma && globalForPrisma.lastUsedUrl !== dbUrl) {
  globalForPrisma.prisma = undefined
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
    datasources: {
      db: {
        url: dbUrl,
      },
    },
  })

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
  globalForPrisma.lastUsedUrl = dbUrl
}

export async function checkDatabaseConnection() {
  try {
    await prisma.$queryRaw`SELECT 1`
    return { ok: true }
  } catch (err: any) {
    return { ok: false, error: err?.message || 'Database connection error' }
  }
}
export async function executeWithRetry<T>(
  queryFn: () => Promise<T>,
  retries = 3,
  delayMs = 1000
): Promise<T> {
  let lastError: any
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      return await queryFn()
    } catch (err: any) {
      lastError = err
      console.warn(`[Prisma Database Retry] Attempt ${attempt} failed. Error: ${err.message || err}`)
      if (attempt < retries) {
        await new Promise((res) => setTimeout(res, delayMs * attempt))
      }
    }
  }
  throw new Error(`Database connection failed after ${retries} attempts. Original error: ${lastError?.message || lastError}`)
}

export default prisma
