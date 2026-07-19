import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const admins = await prisma.user.findMany({
      where: {
        role: {
          OR: [
            { isSystem: true },
            { slug: { in: ['admin', 'manager', 'editor', 'astrologer', 'support'] } }
          ]
        }
      },
      include: { role: true },
      orderBy: { createdAt: 'desc' }
    })
    
    // fetch roles for the creation dropdown
    const roles = await prisma.role.findMany({
      where: {
        OR: [
          { isSystem: true },
          { slug: { in: ['admin', 'manager', 'editor', 'astrologer', 'support'] } }
        ]
      }
    })

    return NextResponse.json({ ok: true, admins, roles })
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const { email, password, fullName, roleId } = await req.json()
    if (!email || !password || !roleId) {
      return NextResponse.json({ ok: false, error: 'Email, password, and role are required' }, { status: 400 })
    }

    const exists = await prisma.user.findUnique({ where: { email } })
    if (exists) {
      return NextResponse.json({ ok: false, error: 'Email already exists' }, { status: 400 })
    }

    const salt = await bcrypt.genSalt(10)
    const passwordHash = await bcrypt.hash(password, salt)

    const admin = await prisma.user.create({
      data: {
        email: email.trim().toLowerCase(),
        passwordHash,
        fullName,
        roleId,
        status: 'ACTIVE'
      }
    })

    return NextResponse.json({ ok: true, message: 'Sub-Admin created successfully', admin })
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { id, action } = await req.json()
    if (!id || !action) {
      return NextResponse.json({ ok: false, error: 'User ID and action required' }, { status: 400 })
    }

    const status = action === 'suspend' ? 'SUSPENDED' : 'ACTIVE'

    const updated = await prisma.user.update({
      where: { id },
      data: { status }
    })

    return NextResponse.json({ ok: true, message: `Admin ${status.toLowerCase()}`, user: updated })
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message }, { status: 500 })
  }
}
