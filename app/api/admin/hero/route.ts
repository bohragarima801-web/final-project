import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const slides = await prisma.heroSlider.findMany({
      orderBy: { order: 'asc' },
    })
    return NextResponse.json({ ok: true, data: slides })
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const { title, subtitle, image, ctaText, ctaUrl, order } = await req.json()

    if (!title || !image) {
      return NextResponse.json({ ok: false, error: 'Title and Image URL are required' }, { status: 400 })
    }

    const slide = await prisma.heroSlider.create({
      data: {
        title,
        subtitle,
        image,
        ctaText,
        ctaUrl,
        order: order ? Number(order) : 0,
      },
    })

    return NextResponse.json({ ok: true, data: slide })
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

    await prisma.heroSlider.delete({
      where: { id },
    })

    return NextResponse.json({ ok: true })
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message }, { status: 500 })
  }
}
