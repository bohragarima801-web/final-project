import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const offerings = await prisma.chadhawaOffering.findMany({
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json({ ok: true, data: offerings })
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const { name, description, price, image, videoUrl, isActive } = await req.json()

    if (!name || !price) {
      return NextResponse.json({ ok: false, error: 'Name and Price are required' }, { status: 400 })
    }

    const offering = await prisma.chadhawaOffering.create({
      data: {
        name,
        description,
        price: Number(price),
        image,
        videoUrl,
        isActive: isActive !== undefined ? !!isActive : true,
      },
    })

    return NextResponse.json({ ok: true, data: offering })
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

    await prisma.chadhawaOffering.delete({
      where: { id },
    })

    return NextResponse.json({ ok: true })
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message }, { status: 500 })
  }
}
