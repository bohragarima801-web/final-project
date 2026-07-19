import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  try {
    const adminUser = await getCurrentUser().catch(() => null)
    if (!adminUser || adminUser.role !== 'admin') {
      return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 })
    }

    let tickets = await prisma.supportTicket.findMany({
      include: {
        user: {
          select: {
            fullName: true,
            email: true,
            phone: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    // Seed default support tickets if empty
    if (tickets.length === 0) {
      await prisma.supportTicket.createMany({
        data: [
          {
            ticketNumber: 'TKT-1081',
            userId: adminUser.id,
            subject: 'Shivratri Bhog Prasad Delivery Delay',
            description: 'Devotee has not received Prasad dispatch tracking number yet.',
            priority: 'HIGH',
            status: 'OPEN',
          },
          {
            ticketNumber: 'TKT-1082',
            userId: adminUser.id,
            subject: 'VIP Puja Live Stream Link Access',
            description: 'Unable to open live link on Android device for Aarti.',
            priority: 'MEDIUM',
            status: 'IN_PROGRESS',
          },
          {
            ticketNumber: 'TKT-1083',
            userId: adminUser.id,
            subject: 'Gau Seva donation receipt request',
            description: 'Devotee requested 80G tax receipt for Rs. 5100 donation.',
            priority: 'LOW',
            status: 'RESOLVED',
          }
        ]
      }).catch(() => null)

      tickets = await prisma.supportTicket.findMany({
        include: {
          user: {
            select: {
              fullName: true,
              email: true,
              phone: true
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      })
    }

    const rows = tickets.map(t => ({
      id: t.id,
      ticketNumber: t.ticketNumber,
      customer: t.user?.fullName || 'Devotee',
      email: t.user?.email || '',
      phone: t.user?.phone || '+919532011984', // fallback default if phone empty
      subject: t.subject,
      description: t.description,
      priority: t.priority,
      status: t.status,
      createdAt: t.createdAt.toLocaleDateString('en-IN')
    }))

    return NextResponse.json({ ok: true, data: rows })
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message || 'Database error fetching tickets' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const adminUser = await getCurrentUser().catch(() => null)
    if (!adminUser || adminUser.role !== 'admin') {
      return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 })
    }

    const { id, status, priority } = await req.json()
    if (!id) {
      return NextResponse.json({ ok: false, error: 'ID is required' }, { status: 400 })
    }

    const ticket = await prisma.supportTicket.update({
      where: { id },
      data: {
        status: status || undefined,
        priority: priority || undefined
      }
    })

    return NextResponse.json({ ok: true, data: ticket })
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message || 'Update failed' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const adminUser = await getCurrentUser().catch(() => null)
    if (!adminUser || adminUser.role !== 'admin') {
      return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ ok: false, error: 'ID is required' }, { status: 400 })
    }

    await prisma.supportTicket.delete({ where: { id } })
    return NextResponse.json({ ok: true, message: 'Ticket deleted successfully' })
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message || 'Delete failed' }, { status: 500 })
  }
}
