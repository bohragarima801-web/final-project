import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { ensureDefaultCategoriesAndTemples } from '@/lib/data-defaults'
import { DEFAULT_PLACEHOLDER_IMAGE } from '@/lib/utils'

export async function GET(req: NextRequest) {
  try {
    await ensureDefaultCategoriesAndTemples()
    const pujas = await prisma.puja.findMany({
      include: {
        category: true,
        temple: true
      },
      orderBy: { createdAt: 'desc' }
    })
    return NextResponse.json({ ok: true, pujas })
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message || 'Failed to fetch pujas' }, { status: 500 })
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
      categoryId,
      templeId,
      shortDescription,
      description,
      benefits,
      price,
      vipPrice,
      duration,
      maxMembers,
      isVip,
      isOnline,
      isFeatured,
      status,
      coverImage
    } = data

    if (!name) {
      return NextResponse.json({ ok: false, error: 'Puja Name is required' }, { status: 400 })
    }
    if (!categoryId) {
      return NextResponse.json({ ok: false, error: 'Category is required' }, { status: 400 })
    }

    const calculatedSlug = slug || name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-')
    const finalPrice = Number(price) || 0
    const finalVipPrice = vipPrice ? Number(vipPrice) : null

    const payload: any = {
      name,
      slug: calculatedSlug,
      categoryId,
      templeId: templeId || null,
      shortDescription: shortDescription || '',
      description: description || '',
      benefits: benefits || '',
      price: finalPrice,
      vipPrice: finalVipPrice,
      duration: Number(duration) || 60,
      maxMembers: Number(maxMembers) || 1,
      isVip: !!isVip,
      isOnline: !!isOnline,
      isFeatured: !!isFeatured,
      status: status || 'DRAFT',
      coverImage: coverImage || DEFAULT_PLACEHOLDER_IMAGE
    }

    let puja
    if (id) {
      // Edit mode
      puja = await prisma.puja.update({
        where: { id },
        data: payload
      })
    } else {
      // Create mode
      puja = await prisma.puja.create({
        data: payload
      })
    }

    return NextResponse.json({ ok: true, puja })
  } catch (err: any) {
    console.error('[DEBUG Admin Pujas POST Error]', err)
    return NextResponse.json({ ok: false, error: err?.message || 'Failed to save puja' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ ok: false, error: 'Puja ID is required' }, { status: 400 })
    }

    await prisma.puja.delete({
      where: { id }
    })

    return NextResponse.json({ ok: true, message: 'Puja deleted successfully' })
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message || 'Failed to delete puja' }, { status: 500 })
  }
}
