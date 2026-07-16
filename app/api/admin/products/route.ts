import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { ensureDefaultCategoriesAndTemples } from '@/lib/data-defaults'
import { DEFAULT_PLACEHOLDER_IMAGE } from '@/lib/utils'

export async function GET(req: NextRequest) {
  try {
    await ensureDefaultCategoriesAndTemples()
    const products = await prisma.product.findMany({
      include: {
        category: true
      },
      orderBy: { createdAt: 'desc' }
    })
    return NextResponse.json({ ok: true, products })
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message || 'Failed to fetch products' }, { status: 500 })
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
      sku,
      shortDescription,
      description,
      price,
      salePrice,
      isAbhimantrit,
      isFeatured,
      coverImage,
      weight,
      status
    } = data

    if (!name) {
      return NextResponse.json({ ok: false, error: 'Product Name is required' }, { status: 400 })
    }
    if (!categoryId) {
      return NextResponse.json({ ok: false, error: 'Category is required' }, { status: 400 })
    }

    const calculatedSlug = slug || name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-')
    const finalPrice = Number(price) || 0
    const finalSalePrice = salePrice ? Number(salePrice) : null

    const payload: any = {
      name,
      slug: calculatedSlug,
      categoryId,
      sku: sku || null,
      shortDescription: shortDescription || '',
      description: description || '',
      price: finalPrice,
      salePrice: finalSalePrice,
      isAbhimantrit: !!isAbhimantrit,
      isFeatured: !!isFeatured,
      coverImage: coverImage || DEFAULT_PLACEHOLDER_IMAGE,
      weight: weight ? Number(weight) : null,
      status: status || 'DRAFT'
    }

    let product
    if (id) {
      product = await prisma.product.update({
        where: { id },
        data: payload
      })
    } else {
      product = await prisma.product.create({
        data: payload
      })
    }

    return NextResponse.json({ ok: true, product })
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message || 'Failed to save product' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ ok: false, error: 'Product ID is required' }, { status: 400 })
    }

    await prisma.product.delete({
      where: { id }
    })

    return NextResponse.json({ ok: true, message: 'Product deleted successfully' })
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message || 'Failed to delete product' }, { status: 500 })
  }
}
