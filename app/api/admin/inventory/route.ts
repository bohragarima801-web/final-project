import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const inventory = await prisma.inventory.findMany({
      include: {
        product: true,
      },
      orderBy: { updatedAt: 'desc' },
    })

    const mapped = inventory.map((inv) => ({
      id: inv.id,
      sku: inv.product?.sku || 'N/A',
      product: inv.product?.name || 'Unknown Product',
      quantity: inv.quantity,
      reserved: inv.reserved,
      warehouse: inv.warehouse || 'Main Warehouse',
    }))

    return NextResponse.json({ ok: true, data: mapped })
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const { id, quantity, warehouse } = await req.json()

    if (!id) {
      return NextResponse.json({ ok: false, error: 'Inventory ID is required' }, { status: 400 })
    }

    const updated = await prisma.inventory.update({
      where: { id },
      data: {
        quantity: Number(quantity),
        warehouse: warehouse || null,
      },
    })

    return NextResponse.json({ ok: true, data: updated })
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message }, { status: 500 })
  }
}
