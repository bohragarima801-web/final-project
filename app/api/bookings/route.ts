import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const pujaId = searchParams.get('pujaId')

    if (!pujaId) {
      return NextResponse.json({ ok: false, error: 'Puja ID is required' }, { status: 400 })
    }

    const puja = await prisma.puja.findUnique({
      where: { id: pujaId },
      include: { temple: true },
    })

    if (!puja) {
      return NextResponse.json({ ok: false, error: 'Puja not found' }, { status: 404 })
    }

    return NextResponse.json({ ok: true, data: puja })
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser().catch(() => null)
    if (!user) {
      return NextResponse.json({ ok: false, error: 'You must be logged in to book a puja' }, { status: 401 })
    }

    const { pujaId, devoteeName, fatherHusbandName, gotra, description } = await req.json()

    if (!pujaId || !devoteeName || !fatherHusbandName || !description) {
      return NextResponse.json({ ok: false, error: 'All mandatory fields must be filled' }, { status: 400 })
    }

    const puja = await prisma.puja.findUnique({
      where: { id: pujaId },
    })

    if (!puja) {
      return NextResponse.json({ ok: false, error: 'Puja not found' }, { status: 404 })
    }

    // Create a random booking number
    const bookingNumber = 'DY-' + Math.floor(100000 + Math.random() * 900000)

    const booking = await prisma.booking.create({
      data: {
        userId: user.id,
        pujaId: puja.id,
        bookingNumber,
        subtotal: puja.price,
        total: puja.price,
        gotra: gotra || 'Kashyap',
        sankalpText: `Devotee: ${devoteeName}, Relation Name: ${fatherHusbandName}, Purpose: ${description}`,
        specialInstructions: `Father/Husband: ${fatherHusbandName}`,
        status: 'PENDING',
        paymentStatus: 'PENDING',
      },
    })

    return NextResponse.json({ ok: true, data: booking })
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message }, { status: 500 })
  }
}
