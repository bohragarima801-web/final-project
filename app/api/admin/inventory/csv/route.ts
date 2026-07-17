import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ ok: false, error: 'No CSV file uploaded' }, { status: 400 })
    }

    const csvContent = await file.text()
    const lines = csvContent.split(/\r?\n/)
    if (lines.length <= 1) {
      return NextResponse.json({ ok: false, error: 'CSV file is empty' }, { status: 400 })
    }

    // Extract headers
    const headers = lines[0].split(',').map((h) => h.trim().toLowerCase())
    const records = []

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim()
      if (!line) continue
      const values = line.split(',').map((v) => v.trim())
      const record: Record<string, string> = {}
      headers.forEach((header, index) => {
        record[header] = values[index] || ''
      })
      records.push(record)
    }

    let updatedCount = 0
    let skippedCount = 0

    for (const record of records) {
      const sku = (record.sku || '').trim()
      if (!sku) continue

      const quantity = parseInt(record.quantity || record.stock || record.qty || '0')
      const warehouse = record.warehouse || 'Main Warehouse'

      // Find product by SKU
      const product = await prisma.product.findFirst({
        where: { sku: { equals: sku, mode: 'insensitive' } },
      })

      if (!product) {
        skippedCount++
        continue
      }

      // Upsert inventory
      await prisma.inventory.upsert({
        where: { productId: product.id },
        create: {
          productId: product.id,
          quantity,
          warehouse,
        },
        update: {
          quantity,
          warehouse,
        },
      })
      updatedCount++
    }

    return NextResponse.json({
      ok: true,
      message: `Successfully processed CSV! Updated inventory for ${updatedCount} products. Skipped ${skippedCount} unknown SKUs.`,
    })
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message || 'Failed to process CSV' }, { status: 500 })
  }
}
