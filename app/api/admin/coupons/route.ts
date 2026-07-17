import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const coupons = await prisma.coupon.findMany({
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json({ ok: true, data: coupons })
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const { code, description, discountType, discountValue, minAmount, maxDiscount, maxUses, startsAt, expiresAt, isActive } = await req.json()

    if (!code || !discountValue) {
      return NextResponse.json({ ok: false, error: 'Code and Discount Value are required' }, { status: 400 })
    }

    const coupon = await prisma.coupon.create({
      data: {
        code: code.toUpperCase().trim(),
        description,
        discountType: discountType || 'PERCENTAGE',
        discountValue: Number(discountValue),
        minAmount: minAmount ? Number(minAmount) : null,
        maxDiscount: maxDiscount ? Number(maxDiscount) : null,
        maxUses: maxUses ? Number(maxUses) : null,
        startsAt: startsAt ? new Date(startsAt) : null,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
        isActive: isActive !== undefined ? !!isActive : true,
      },
    })

    return NextResponse.json({ ok: true, data: coupon })
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ ok: false, error: 'ID is required' }, { status: 400 })
    }

    await prisma.coupon.delete({
      where: { id },
    })

    return NextResponse.json({ ok: true })
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message }, { status: 500 })
  }
}
