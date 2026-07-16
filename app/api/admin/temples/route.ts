import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { ensureDefaultCategoriesAndTemples } from '@/lib/data-defaults'
import { DEFAULT_PLACEHOLDER_IMAGE } from '@/lib/utils'

export async function GET(req: NextRequest) {
  try {
    await ensureDefaultCategoriesAndTemples()
    const temples = await prisma.temple.findMany({
      orderBy: { createdAt: 'desc' }
    })
    return NextResponse.json({ ok: true, temples })
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message || 'Failed to fetch temples' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    await ensureDefaultCategoriesAndTemples()
    const data = await req.json()
    const {
      id,
      name,
      slug,
      description,
      deity,
      address,
      city,
      state,
      pincode,
      isFeatured,
      isActive,
      coverImage
    } = data

    if (!name) {
      return NextResponse.json({ ok: false, error: 'Temple Name is required' }, { status: 400 })
    }

    const calculatedSlug = slug || name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-')

    const payload: any = {
      name,
      slug: calculatedSlug,
      description: description || '',
      deity: deity || '',
      address: address || '',
      city: city || '',
      state: state || '',
      pincode: pincode || '',
      isFeatured: !!isFeatured,
      isActive: isActive !== false,
      coverImage: coverImage || DEFAULT_PLACEHOLDER_IMAGE
    }

    let temple
    if (id) {
      temple = await prisma.temple.update({
        where: { id },
        data: payload
      })
    } else {
      temple = await prisma.temple.create({
        data: payload
      })
    }

    return NextResponse.json({ ok: true, temple })
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message || 'Failed to save temple' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ ok: false, error: 'Temple ID is required' }, { status: 400 })
    }

    await prisma.temple.delete({
      where: { id }
    })

    return NextResponse.json({ ok: true, message: 'Temple deleted successfully' })
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message || 'Failed to delete temple' }, { status: 500 })
  }
}
