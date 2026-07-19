import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAdminSession } from '@/lib/admin-session'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const session = await getAdminSession()
    if (!session) {
      return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 })
    }

    const subscribers = await prisma.newsletter.findMany({
      orderBy: { subscribedAt: 'desc' }
    })

    return NextResponse.json({ ok: true, data: subscribers })
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message || 'Database error fetching subscribers' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json()

    if (!email || !email.includes('@')) {
      return NextResponse.json({ ok: false, error: 'Invalid email address' }, { status: 400 })
    }

    const subscriber = await prisma.newsletter.upsert({
      where: { email },
      update: { isActive: true },
      create: { email, isActive: true }
    })

    return NextResponse.json({ ok: true, message: 'Successfully subscribed to the newsletter!', data: subscriber })
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: 'Error subscribing to newsletter' }, { status: 500 })
  }
}
