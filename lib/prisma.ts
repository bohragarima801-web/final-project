import { PrismaClient } from '@prisma/client'
import fs from 'fs'
import path from 'path'

// Fallback manual .env loader to prevent Prisma environment validation crashes
try {
  const envPath = path.join(process.cwd(), '.env')
  if (fs.existsSync(envPath)) {
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
        // Force set key if not already defined, or overwrite if it was empty
        if (!process.env[key] || process.env[key] === '') {
          process.env[key] = value
        }
      }
    }
  }
} catch (e) {
  console.error('Failed to load .env manually:', e)
}

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined }

// Explicitly pass the connection string URL to avoid Next.js bundling edge cases
const dbUrl = process.env.DATABASE_URL || 'postgresql://localhost:5432'

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

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export async function checkDatabaseConnection() {
  try {
    await prisma.$queryRaw`SELECT 1`
    return { ok: true }
  } catch (err: any) {
    return { ok: false, error: err?.message || 'Database connection error' }
  }
}

export default prisma
