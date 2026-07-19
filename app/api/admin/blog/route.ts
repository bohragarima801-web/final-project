import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const adminUser = await getCurrentUser().catch(() => null)
    if (!adminUser) {
      return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 })
    }

    let posts = await prisma.blog.findMany({
      include: {
        category: { select: { name: true } },
        author: { select: { name: true, email: true } }
      },
      orderBy: { createdAt: 'desc' }
    })

    // Seed default categories and blog if empty
    if (posts.length === 0) {
      let defaultCat = await prisma.blogCategory.findFirst()
      if (!defaultCat) {
        defaultCat = await prisma.blogCategory.create({
          data: { name: 'Spirituality', slug: 'spirituality', description: 'Sacred knowledge & rituals' }
        })
      }

      await prisma.blog.create({
        data: {
          categoryId: defaultCat.id,
          authorId: adminUser.id,
          title: 'Welcome to Divya Yagyam',
          slug: 'welcome-to-divya-yagyam',
          excerpt: 'Embark on your spiritual journey with ancient Vedic rituals.',
          content: '<p>Welcome to Divya Yagyam! Explore sacred pujas, astrological forecasts, and divine blessings.</p>',
          status: 'PUBLISHED',
          views: 42,
          seoTitle: 'Divya Yagyam | Ancient Vedic Pujas & Blessings',
          seoDescription: 'Perform authentic Vedic pujas, online yagyas, and connect with holy temples of India.',
          publishedAt: new Date()
        }
      }).catch(() => null)

      posts = await prisma.blog.findMany({
        include: {
          category: { select: { name: true } },
          author: { select: { name: true, email: true } }
        },
        orderBy: { createdAt: 'desc' }
      })
    }

    const rows = posts.map(p => ({
      id: p.id,
      title: p.title,
      slug: p.slug,
      author: p.author?.name || p.author?.email || 'Admin',
      category: p.category?.name || 'Spirituality',
      status: p.status,
      views: p.views,
      seoTitle: p.seoTitle || '',
      seoDescription: p.seoDescription || '',
      publishedAt: p.publishedAt ? p.publishedAt.toLocaleDateString('en-IN') : 'DRAFT'
    }))

    return NextResponse.json({ ok: true, data: rows })
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message || 'Database error fetching posts' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const adminUser = await getCurrentUser().catch(() => null)
    if (!adminUser) {
      return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { id, title, slug, content, categoryId, excerpt, status, seoTitle, seoDescription, coverImage } = body

    if (!title || !slug || !content) {
      return NextResponse.json({ ok: false, error: 'Missing required fields' }, { status: 400 })
    }

    // Resolve or find a category
    let finalCategoryId = categoryId
    if (!finalCategoryId) {
      const cat = await prisma.blogCategory.findFirst()
      if (cat) {
        finalCategoryId = cat.id
      } else {
        const newCat = await prisma.blogCategory.create({
          data: { name: 'Spirituality', slug: 'spirituality' }
        })
        finalCategoryId = newCat.id
      }
    }

    if (id) {
      // Edit post
      await prisma.blog.update({
        where: { id },
        data: {
          title,
          slug,
          content,
          categoryId: finalCategoryId,
          excerpt,
          coverImage,
          status: status || 'DRAFT',
          seoTitle,
          seoDescription,
          publishedAt: status === 'PUBLISHED' ? new Date() : null
        }
      })
      return NextResponse.json({ ok: true, message: 'Article updated successfully!' })
    } else {
      // Create post
      await prisma.blog.create({
        data: {
          title,
          slug,
          content,
          categoryId: finalCategoryId,
          authorId: adminUser.id,
          excerpt,
          coverImage,
          status: status || 'DRAFT',
          seoTitle,
          seoDescription,
          publishedAt: status === 'PUBLISHED' ? new Date() : null
        }
      })
      return NextResponse.json({ ok: true, message: 'Article created successfully!' })
    }
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message || 'Save failed' }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  try {
    const adminUser = await getCurrentUser().catch(() => null)
    if (!adminUser) {
      return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 })
    }

    const url = new URL(req.url)
    const id = url.searchParams.get('id')
    if (!id) return NextResponse.json({ ok: false, error: 'Missing ID' }, { status: 400 })

    await prisma.blog.delete({ where: { id } })
    return NextResponse.json({ ok: true, message: 'Article removed successfully' })
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message || 'Delete failed' }, { status: 500 })
  }
}
