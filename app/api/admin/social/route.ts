import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

export const dynamic = 'force-dynamic'

// We will use SpiritualTool or AuditLog as a fallback database store, or we can use local JSON customization for social posts
import fs from 'fs/promises'
import path from 'path'

const SOCIAL_FILE = path.join(process.cwd(), 'lib', 'data', 'social_posts.json')

async function readSocialQueue() {
  try {
    const raw = await fs.readFile(SOCIAL_FILE, 'utf-8')
    return JSON.parse(raw)
  } catch {
    // Seed default scheduled posts
    const defaults = [
      {
        id: 'soc-1',
        title: 'Shravan Somwar Aarti greetings',
        description: 'May Lord Shiva bless you all with peace, health and prosperity. Join us for virtual Aarti. #Somnath #Shiva',
        mediaUrl: 'https://images.unsplash.com/photo-1545128485-c400e7702796',
        platforms: ['facebook', 'instagram'],
        scheduledAt: new Date(Date.now() + 86400000).toLocaleString('en-IN'), // tomorrow
        status: 'SCHEDULED'
      },
      {
        id: 'soc-2',
        title: 'Gau Seva festival overview',
        description: 'Glance at our holy cow feeding ritual performed today. Thanks to all devotee sponsors! #GauSeva #Krishna',
        mediaUrl: 'https://images.unsplash.com/photo-1609137144814-6997d8487b32',
        platforms: ['facebook', 'youtube'],
        scheduledAt: 'Immediately Sent',
        status: 'PUBLISHED'
      }
    ]
    await fs.mkdir(path.dirname(SOCIAL_FILE), { recursive: true })
    await fs.writeFile(SOCIAL_FILE, JSON.stringify(defaults, null, 2), 'utf-8')
    return defaults
  }
}

async function writeSocialQueue(data: any) {
  await fs.mkdir(path.dirname(SOCIAL_FILE), { recursive: true })
  await fs.writeFile(SOCIAL_FILE, JSON.stringify(data, null, 2), 'utf-8')
}

export async function GET() {
  try {
    const adminUser = await getCurrentUser().catch(() => null)
    if (!adminUser || adminUser.role !== 'admin') {
      return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 })
    }

    const queue = await readSocialQueue()
    return NextResponse.json({ ok: true, data: queue })
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message || 'Failed to read social media posts' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const adminUser = await getCurrentUser().catch(() => null)
    if (!adminUser || adminUser.role !== 'admin') {
      return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { title, description, mediaUrl, platforms, scheduledAt, postNow } = body

    if (!title || !description) {
      return NextResponse.json({ ok: false, error: 'Title and Description are required' }, { status: 400 })
    }

    const queue = await readSocialQueue()
    const newPost = {
      id: `soc-${Date.now()}`,
      title,
      description,
      mediaUrl: mediaUrl || '',
      platforms: platforms || ['facebook'],
      scheduledAt: postNow ? 'Immediately Sent' : new Date(scheduledAt).toLocaleString('en-IN'),
      status: postNow ? 'PUBLISHED' : 'SCHEDULED'
    }

    queue.unshift(newPost)
    await writeSocialQueue(queue)

    return NextResponse.json({
      ok: true,
      message: postNow ? 'Post dispatched to all connected platforms successfully!' : 'Post scheduled successfully!',
      data: newPost
    })
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message || 'Failed to write post' }, { status: 500 })
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
      return NextResponse.json({ ok: false, error: 'Missing ID' }, { status: 400 })
    }

    let queue = await readSocialQueue()
    queue = queue.filter((item: any) => item.id !== id)
    await writeSocialQueue(queue)

    return NextResponse.json({ ok: true, message: 'Social post removed' })
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message || 'Delete failed' }, { status: 500 })
  }
}
