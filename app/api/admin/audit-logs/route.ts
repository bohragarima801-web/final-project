import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const adminUser = await getCurrentUser().catch(() => null)
    if (!adminUser || adminUser.role !== 'admin') {
      return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 })
    }

    let logs = await prisma.auditLog.findMany({
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 50
    })



    const rows = logs.map(l => ({
      id: l.id,
      user: l.user?.name || l.user?.email || 'System / Guest',
      action: l.action,
      ip: l.ipAddress || '127.0.0.1',
      ua: l.userAgent || 'Chrome / Windows',
      time: l.createdAt.toLocaleString('en-IN')
    }))

    return NextResponse.json({ ok: true, data: rows })
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message || 'Database error fetching logs' }, { status: 500 })
  }
}
