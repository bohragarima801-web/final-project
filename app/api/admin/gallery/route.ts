import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const items = await prisma.galleryItem.findMany({
      include: { gallery: true },
      orderBy: { order: 'asc' },
    })
    return NextResponse.json({ ok: true, data: items })
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const { url, caption, type, galleryTitle } = await req.json()

    if (!url) {
      return NextResponse.json({ ok: false, error: 'URL is required' }, { status: 400 })
    }

    // Find or create default gallery
    const title = galleryTitle || 'General'
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-')

    let gallery = await prisma.gallery.findUnique({
      where: { slug },
    })

    if (!gallery) {
      gallery = await prisma.gallery.create({
        data: {
          title,
          slug,
        },
      })
    }

    const item = await prisma.galleryItem.create({
      data: {
        galleryId: gallery.id,
        url,
        caption: caption || '',
        type: type || 'IMAGE',
      },
    })

    return NextResponse.json({ ok: true, data: item })
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

    await prisma.galleryItem.delete({
      where: { id },
    })

    return NextResponse.json({ ok: true })
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message }, { status: 500 })
  }
}
