import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      include: {
        category: true,
        inventory: true,
      },
      orderBy: { createdAt: 'desc' },
    })

    const mapped = products.map((p) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      sku: p.sku || 'N/A',
      category: p.category?.name || 'Uncategorized',
      price: `₹${Number(p.price)}`,
      stock: p.inventory?.quantity ?? 0,
      status: p.status,
    }))

    return NextResponse.json({ ok: true, data: mapped })
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

    await prisma.product.delete({
      where: { id },
    })

    return NextResponse.json({ ok: true })
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json()
    const {
      id,
      name,
      slug,
      sku,
      categoryId,
      shortDescription,
      description,
      price,
      salePrice,
      isAbhimantrit,
      isFeatured,
      coverImage,
      weight,
      status,
      stock
    } = data

    if (!name || !price || !categoryId) {
      return NextResponse.json({ ok: false, error: 'Name, Price, and Category are required' }, { status: 400 })
    }

    const calculatedSlug = slug || name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-')

    const payload: any = {
      name,
      slug: calculatedSlug,
      sku: sku || null,
      categoryId,
      shortDescription: shortDescription || '',
      description: description || '',
      price: Number(price),
      salePrice: salePrice ? Number(salePrice) : null,
      isAbhimantrit: !!isAbhimantrit,
      isFeatured: !!isFeatured,
      coverImage: coverImage || null,
      weight: weight ? Number(weight) : null,
      status: status || 'DRAFT'
    }

    let product
    if (id) {
      product = await prisma.product.update({
        where: { id },
        data: payload
      })
      if (stock !== undefined) {
        await prisma.inventory.upsert({
          where: { productId: product.id },
          create: { productId: product.id, quantity: Number(stock) || 0, minThreshold: 5 },
          update: { quantity: Number(stock) || 0 }
        })
      }
    } else {
      product = await prisma.product.create({
        data: payload
      })
      await prisma.inventory.create({
        data: { productId: product.id, quantity: Number(stock) || 0, minThreshold: 5 }
      })
    }

    return NextResponse.json({ ok: true, data: product })
  } catch (err: any) {
    console.error('[API Products POST Error]', err)
    return NextResponse.json({ ok: false, error: err?.message || 'Failed to save product' }, { status: 500 })
  }
}
