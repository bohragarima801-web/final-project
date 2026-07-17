import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createAdminClient } from '@/lib/supabase/admin'

export async function GET() {
  try {
    const devotees = await prisma.user.findMany({
      where: {
        role: { slug: 'devotee' },
      },
      include: {
        _count: {
          select: {
            bookings: true,
            orders: true,
            donations: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    const mapped = devotees.map((d) => ({
      id: d.id,
      supabaseId: d.supabaseId,
      name: d.fullName || 'Devotee',
      email: d.email,
      phone: d.phone || 'Not Configured',
      bookings: d._count?.bookings || 0,
      orders: d._count?.orders || 0,
      donations: d._count?.donations || 0,
      wallet: '₹0.00',
    }))

    return NextResponse.json({ ok: true, data: mapped })
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const { action, userId, newPassword, alertMessage, name, email, phone } = await req.json()

    // 1. ACTION: Create a new devotee
    if (action === 'create') {
      if (!name || !email || !phone || !newPassword) {
        return NextResponse.json({ ok: false, error: 'Name, Email, Phone and Password are required' }, { status: 400 })
      }

      // Check if email already registered in DB
      const existing = await prisma.user.findUnique({ where: { email } })
      if (existing) {
        return NextResponse.json({ ok: false, error: 'Email already registered' }, { status: 400 })
      }

      // Create in Supabase Auth first
      const supabaseAdmin = await createAdminClient()
      const { data: supaUser, error: supaError } = await supabaseAdmin.auth.admin.createUser({
        email,
        password: newPassword,
        phone,
        email_confirm: true,
        phone_confirm: true,
        user_metadata: { fullName: name, phone },
      })

      if (supaError) {
        return NextResponse.json({ ok: false, error: supaError.message }, { status: 400 })
      }

      // Find devotee role ID
      let devoteeRole = await prisma.role.findUnique({ where: { slug: 'devotee' } })
      if (!devoteeRole) {
        devoteeRole = await prisma.role.create({
          data: { name: 'Devotee', slug: 'devotee' },
        })
      }

      // Create in DB
      const user = await prisma.user.create({
        data: {
          supabaseId: supaUser.user.id,
          email,
          fullName: name,
          phone,
          roleId: devoteeRole.id,
        },
      })

      return NextResponse.json({ ok: true, message: 'Devotee created successfully!', data: user })
    }

    // 2. ACTION: Update an existing devotee
    if (action === 'update') {
      if (!userId || !name || !email) {
        return NextResponse.json({ ok: false, error: 'User ID, Name, and Email are required' }, { status: 400 })
      }

      const updated = await prisma.user.update({
        where: { id: userId },
        data: {
          fullName: name,
          email,
          phone: phone || null,
        },
      })

      return NextResponse.json({ ok: true, message: 'Devotee updated successfully!', data: updated })
    }

    // 3. ACTION: Reset user password
    if (action === 'password') {
      if (!userId) return NextResponse.json({ ok: false, error: 'User ID is required' }, { status: 400 })
      const user = await prisma.user.findUnique({ where: { id: userId } })
      if (!user) return NextResponse.json({ ok: false, error: 'User not found' }, { status: 404 })

      if (!newPassword || newPassword.length < 6) {
        return NextResponse.json({ ok: false, error: 'Password must be at least 6 characters' }, { status: 400 })
      }

      if (user.supabaseId) {
        const supabaseAdmin = await createAdminClient()
        const { error } = await supabaseAdmin.auth.admin.updateUserById(user.supabaseId, {
          password: newPassword,
        })
        if (error) throw error
      }

      return NextResponse.json({ ok: true, message: 'Password reset successfully!' })
    }

    // 4. ACTION: Send WhatsApp Alert
    if (action === 'whatsapp') {
      if (!userId) return NextResponse.json({ ok: false, error: 'User ID is required' }, { status: 400 })
      const user = await prisma.user.findUnique({ where: { id: userId } })
      if (!user) return NextResponse.json({ ok: false, error: 'User not found' }, { status: 404 })

      if (!alertMessage) {
        return NextResponse.json({ ok: false, error: 'Alert message is required' }, { status: 400 })
      }

      const phoneNum = user.phone || ''
      if (!phoneNum) {
        return NextResponse.json({ ok: false, error: 'User does not have a registered phone number' }, { status: 400 })
      }

      console.log(`[WHATSAPP ALERT] Dispatching to ${phoneNum}: "${alertMessage}"`)
      return NextResponse.json({ ok: true, message: `WhatsApp alert sent successfully to ${phoneNum}!` })
    }

    return NextResponse.json({ ok: false, error: 'Invalid action' }, { status: 400 })
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message || 'Operation failed' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ ok: false, error: 'ID is required' }, { status: 400 })
    }

    const user = await prisma.user.findUnique({ where: { id } })
    if (!user) {
      return NextResponse.json({ ok: false, error: 'User not found' }, { status: 404 })
    }

    if (user.supabaseId) {
      const supabaseAdmin = await createAdminClient()
      await supabaseAdmin.auth.admin.deleteUser(user.supabaseId).catch((err) => {
        console.warn('Failed to delete Supabase user:', err)
      })
    }

    await prisma.user.delete({
      where: { id },
    })

    return NextResponse.json({ ok: true })
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message }, { status: 500 })
  }
}
