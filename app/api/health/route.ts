import { NextRequest, NextResponse } from 'next/server'
import { checkDatabaseConnection } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const result = await checkDatabaseConnection()
  if (result.ok) {
    return NextResponse.json({
      status: 'healthy',
      database: 'connected',
      timestamp: new Date().toISOString()
    })
  } else {
    return NextResponse.json({
      status: 'unhealthy',
      database: 'disconnected',
      error: result.error,
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}
