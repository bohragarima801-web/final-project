import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  try {
    const bookings = await prisma.booking.findMany({
      include: {
        user: true,
        puja: true,
        temple: true,
        members: true
      },
      orderBy: { createdAt: 'desc' }
    })
    
    return NextResponse.json({ ok: true, data: bookings })
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message || 'Failed to fetch bookings' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ ok: false, error: 'Booking ID is required' }, { status: 400 })
    }

    await prisma.booking.delete({
      where: { id }
    })

    return NextResponse.json({ ok: true, message: 'Booking deleted successfully' })
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message || 'Failed to delete booking' }, { status: 500 })
  }
}
