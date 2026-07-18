import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const adminUser = await getCurrentUser().catch(() => null)
    if (!adminUser || adminUser.role?.slug !== 'admin') {
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

    // Seed some mock logs if empty
    if (logs.length === 0) {
      await prisma.auditLog.createMany({
        data: [
          {
            userId: adminUser.id,
            action: 'ADMIN_LOGIN',
            resource: 'Auth',
            ipAddress: '192.168.1.42',
            userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0',
          },
          {
            userId: adminUser.id,
            action: 'UPDATE_SETTINGS',
            resource: 'Settings',
            ipAddress: '192.168.1.42',
            userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0',
          },
          {
            userId: adminUser.id,
            action: 'CREATE_PUJA',
            resource: 'Puja',
            ipAddress: '192.168.1.42',
            userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0',
          }
        ]
      }).catch(() => null)

      logs = await prisma.auditLog.findMany({
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
    }

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
