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

    let reports = await prisma.astroReport.findMany({
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
      }
    })

    // Seed some mock reports if database is empty
    if (reports.length === 0) {
      await prisma.astroReport.createMany({
        data: [
          {
            userId: adminUser.id,
            type: 'KUNDALI',
            inputData: { name: 'Mukesh Bohra', dob: '1987-10-07', tob: '10:30', pob: 'Jodhpur' },
            status: 'COMPLETED',
          },
          {
            userId: adminUser.id,
            type: 'MILAN',
            inputData: { groomName: 'Aarav', brideName: 'Ananya' },
            status: 'COMPLETED',
          },
          {
            userId: adminUser.id,
            type: 'NUMEROLOGY',
            inputData: { name: 'Divya Yagyam' },
            status: 'COMPLETED',
          },
          {
            userId: adminUser.id,
            type: 'RATNA',
            inputData: { rashi: 'Mesh' },
            status: 'PENDING',
          }
        ]
      }).catch(() => null)

      reports = await prisma.astroReport.findMany({
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
        }
      })
    }

    const rows = reports.map(r => ({
      id: r.id,
      user: r.user?.name || r.user?.email || 'Devotee',
      type: r.type,
      status: r.status,
      date: r.createdAt.toLocaleDateString('en-IN')
    }))

    return NextResponse.json({ ok: true, data: rows })
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message || 'Database error fetching astro reports' }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  try {
    const adminUser = await getCurrentUser().catch(() => null)
    if (!adminUser || adminUser.role?.slug !== 'admin') {
      return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 })
    }

    const url = new URL(req.url)
    const id = url.searchParams.get('id')
    if (!id) return NextResponse.json({ ok: false, error: 'Missing ID' }, { status: 400 })

    await prisma.astroReport.delete({ where: { id } })
    return NextResponse.json({ ok: true, message: 'Report deleted successfully' })
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message || 'Delete failed' }, { status: 500 })
  }
}
