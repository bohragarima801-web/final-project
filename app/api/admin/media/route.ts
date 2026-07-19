import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  try {
    const adminUser = await getCurrentUser().catch(() => null)
    if (!adminUser || adminUser.role !== 'admin') {
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



    return NextResponse.json({ ok: true, data: media })
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message || 'Database error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const adminUser = await getCurrentUser().catch(() => null)
    if (!adminUser || adminUser.role !== 'admin') {
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
    if (!adminUser || adminUser.role !== 'admin') {
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
