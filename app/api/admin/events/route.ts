import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const events = await prisma.event.findMany({
      include: {
        temple: { select: { name: true } },
        _count: {
          select: { registrations: true },
        },
      },
      orderBy: { startsAt: 'asc' },
    })
    
    // Map _count to a flat registrations field for the UI
    const mapped = events.map(e => ({
      ...e,
      registrations: e._count?.registrations || 0,
    }))

    return NextResponse.json({ ok: true, data: mapped })
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const { title, description, coverImage, location, startsAt, endsAt, isLive, isFeatured, streamUrl, templeId } = await req.json()

    if (!title || !startsAt) {
      return NextResponse.json({ ok: false, error: 'Title and Starts At date are required' }, { status: 400 })
    }

    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now().toString().slice(-4)

    const event = await prisma.event.create({
      data: {
        title,
        slug,
        description,
        coverImage,
        location,
        startsAt: new Date(startsAt),
        endsAt: endsAt ? new Date(endsAt) : null,
        isLive: isLive !== undefined ? !!isLive : false,
        isFeatured: isFeatured !== undefined ? !!isFeatured : false,
        streamUrl,
        templeId: templeId || null,
      },
    })

    return NextResponse.json({ ok: true, data: event })
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { id, title, description, coverImage, location, startsAt, endsAt, isLive, isFeatured, streamUrl, templeId } = await req.json()

    if (!id) {
      return NextResponse.json({ ok: false, error: 'ID is required for editing' }, { status: 400 })
    }

    const event = await prisma.event.update({
      where: { id },
      data: {
        title,
        description,
        coverImage,
        location,
        startsAt: startsAt ? new Date(startsAt) : undefined,
        endsAt: endsAt ? new Date(endsAt) : null,
        isLive: isLive !== undefined ? !!isLive : undefined,
        isFeatured: isFeatured !== undefined ? !!isFeatured : undefined,
        streamUrl,
        templeId: templeId !== undefined ? (templeId || null) : undefined,
      },
    })

    return NextResponse.json({ ok: true, data: event })
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

    await prisma.event.delete({
      where: { id },
    })

    return NextResponse.json({ ok: true })
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message }, { status: 500 })
  }
}
