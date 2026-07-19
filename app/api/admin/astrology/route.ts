import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAdminSession } from '@/lib/admin-session'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const session = await getAdminSession()
    if (!session) {
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
    const session = await getAdminSession()
    if (!session) {
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
