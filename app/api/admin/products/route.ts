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
