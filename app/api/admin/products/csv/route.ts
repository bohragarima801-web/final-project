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

    let createdCount = 0
    let updatedCount = 0

    for (const record of records) {
      const name = record.name || record.productname || record.title
      if (!name) continue

      const categoryName = record.category || 'General'
      const categorySlug = categoryName.toLowerCase().replace(/[^a-z0-9]+/g, '-')

      // 1. Find or create category
      let category = await prisma.productCategory.findUnique({
        where: { slug: categorySlug },
      })

      if (!category) {
        category = await prisma.productCategory.create({
          data: {
            name: categoryName,
            slug: categorySlug,
          },
        })
      }

      // 2. Prepare product fields
      const slug = (record.slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-')).trim()
      const sku = (record.sku || `PROD-${slug.slice(0, 8).toUpperCase()}`).trim()
      const price = Number(record.price || record.baseprice || 0)
      const salePrice = record.saleprice ? Number(record.saleprice) : null
      const shortDescription = record.shortdescription || record.summary || null
      const description = record.description || record.fulldescription || null
      const weight = record.weight ? parseFloat(record.weight) : null
      const stock = record.stock || record.quantity ? parseInt(record.stock || record.quantity) : 100

      // 3. Upsert product
      const product = await prisma.product.upsert({
        where: { slug },
        create: {
          categoryId: category.id,
          name,
          slug,
          sku,
          shortDescription,
          description,
          price,
          salePrice,
          weight,
          status: 'ACTIVE',
        },
        update: {
          categoryId: category.id,
          name,
          sku,
          shortDescription,
          description,
          price,
          salePrice,
          weight,
          status: 'ACTIVE',
        },
      })

      // 4. Upsert inventory
      await prisma.inventory.upsert({
        where: { productId: product.id },
        create: {
          productId: product.id,
          quantity: stock,
        },
        update: {
          quantity: stock,
        },
      })

      if (product.createdAt.getTime() === product.updatedAt.getTime()) {
        createdCount++
      } else {
        updatedCount++
      }
    }

    return NextResponse.json({
      ok: true,
      message: `Successfully processed CSV! Created ${createdCount} new products, updated ${updatedCount} existing products.`,
    })
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message || 'Failed to process CSV' }, { status: 500 })
  }
}
