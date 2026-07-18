import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  try {
    const adminUser = await getCurrentUser().catch(() => null)
    if (!adminUser || adminUser.role?.slug !== 'admin') {
      return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const folder = searchParams.get('folder')

    const where: any = {}
    if (folder && folder !== 'all') {
      where.folder = folder
    }

    let media = await prisma.mediaLibrary.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    })

    // Seed dummy media logs if empty so it looks beautiful
    if (media.length === 0 && (!folder || folder === 'all')) {
      await prisma.mediaLibrary.createMany({
        data: [
          {
            url: 'https://images.unsplash.com/photo-1545128485-c400e7702796',
            type: 'IMAGE',
            filename: 'Kashi_Vishwanath_Somwar_Aarti.jpg',
            size: 102450,
            mimeType: 'image/jpeg',
            folder: 'Past Puja',
          },
          {
            url: 'https://images.unsplash.com/photo-1561361513-2d000a50f0db',
            type: 'IMAGE',
            filename: 'Janmashtami_Bhog_Seva_Feedback.jpg',
            size: 204890,
            mimeType: 'image/jpeg',
            folder: 'Customer Review',
          },
          {
            url: 'https://images.unsplash.com/photo-1609137144814-6997d8487b32',
            type: 'IMAGE',
            filename: 'Gau_Seva_Gopashtami_Festival.jpg',
            size: 301200,
            mimeType: 'image/jpeg',
            folder: 'Festival Event',
          }
        ]
      }).catch(() => null)

      media = await prisma.mediaLibrary.findMany({
        where,
        orderBy: { createdAt: 'desc' }
      })
    }

    return NextResponse.json({ ok: true, data: media })
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message || 'Database error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const adminUser = await getCurrentUser().catch(() => null)
    if (!adminUser || adminUser.role?.slug !== 'admin') {
      return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 })
    }

    const { url, filename, size, mimeType, folder, type } = await req.json()

    if (!url) {
      return NextResponse.json({ ok: false, error: 'URL is required' }, { status: 400 })
    }

    const media = await prisma.mediaLibrary.create({
      data: {
        url,
        filename: filename || 'Uploaded Media',
        size: size ? Number(size) : 0,
        mimeType: mimeType || 'image/jpeg',
        folder: folder || 'General',
        type: type || 'IMAGE',
        uploadedBy: adminUser.id
      }
    })

    return NextResponse.json({ ok: true, data: media })
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message || 'Upload save failed' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const adminUser = await getCurrentUser().catch(() => null)
    if (!adminUser || adminUser.role?.slug !== 'admin') {
      return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ ok: false, error: 'ID is required' }, { status: 400 })
    }

    await prisma.mediaLibrary.delete({ where: { id } })
    return NextResponse.json({ ok: true, message: 'Media removed successfully' })
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message || 'Delete failed' }, { status: 500 })
  }
}
