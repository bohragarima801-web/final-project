import './clean-env'
import { PrismaClient } from '@prisma/client'

let prismaInstance: PrismaClient | null = null

function getPrisma(): PrismaClient {
  if (!prismaInstance) {
    const url = process.env.DATABASE_URL

    if (!url) {
      throw new Error(
        'DATABASE_URL environment variable is missing. Please add your PostgreSQL / Supabase connection string in the Settings menu of AI Studio.'
      )
    }

    prismaInstance = new PrismaClient({
      datasources: {
        db: {
          url: url,
        },
      },
      log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['error'],
    })
  }
  return prismaInstance
}

export const prisma = new Proxy({} as PrismaClient, {
  get(target, prop, receiver) {
    if (prop === 'then' || prop === 'toJSON') {
      return undefined
    }
    const client = getPrisma()
    const val = Reflect.get(client, prop, receiver)
    if (typeof val === 'function') {
      return val.bind(client)
    }
    return val
  }
})

export async function checkDatabaseConnection() {
  try {
    const client = getPrisma()
    await client.$queryRaw`SELECT 1`
    return { ok: true }
  } catch (err: any) {
    return { ok: false, error: err?.message || 'Database connection error' }
  }
}

export default prisma



