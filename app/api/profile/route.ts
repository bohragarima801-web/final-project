import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

export async function GET() {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.json({ ok: true, user })
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 })
    }

    const { fullName, phone } = await req.json()

    if (!fullName) {
      return NextResponse.json({ ok: false, error: 'Full name is required' }, { status: 400 })
    }

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        fullName,
        phone,
      },
    })

    return NextResponse.json({ ok: true, user: updatedUser })
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message || 'Failed to update profile' }, { status: 500 })
  }
}
