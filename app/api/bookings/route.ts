import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ ok: false, error: 'Authentication required. Please login first.' }, { status: 401 })
    }

    const body = await req.json()
    const { pujaId, sankalpText, gotra, specialInstructions, familyMembers } = body

    if (!pujaId) {
      return NextResponse.json({ ok: false, error: 'Puja ID is required' }, { status: 400 })
    }

    const puja = await prisma.puja.findUnique({
      where: { id: pujaId }
    })

    if (!puja) {
      return NextResponse.json({ ok: false, error: 'Selected Puja not found' }, { status: 404 })
    }

    // Generate unique booking number
    const randomSuffix = Math.floor(100000 + Math.random() * 900000)
    const bookingNumber = `YJN-${Date.now().toString().slice(-4)}${randomSuffix}`

    const subtotal = puja.price
    const total = puja.price

    // Create booking and nested members in a transaction
    const booking = await prisma.$transaction(async (tx) => {
      const createdBooking = await tx.booking.create({
        data: {
          bookingNumber,
          userId: user.id,
          pujaId,
          subtotal,
          total,
          status: 'PENDING',
          paymentStatus: 'PENDING',
          sankalpText: sankalpText || user.fullName || 'Devotee',
          gotra: gotra || null,
          specialInstructions: specialInstructions || null,
        }
      })

      if (familyMembers && Array.isArray(familyMembers) && familyMembers.length > 0) {
        await tx.bookingMember.createMany({
          data: familyMembers.map(m => ({
            bookingId: createdBooking.id,
            fullName: m.fullName,
            gotra: m.gotra || gotra || null,
            relation: m.relation || null,
            age: m.age ? Number(m.age) : null
          }))
        })
      }

      return createdBooking
    })

    return NextResponse.json({
      ok: true,
      message: 'Booking initialized successfully!',
      booking: {
        id: booking.id,
        bookingNumber: booking.bookingNumber,
        total: booking.total,
        status: booking.status,
        sankalpText: booking.sankalpText,
        gotra: booking.gotra,
        pujaName: puja.name
      }
    })
  } catch (err: any) {
    console.error('Booking Creation Error:', err)
    return NextResponse.json({ ok: false, error: err?.message || 'Failed to create booking' }, { status: 500 })
  }
}
