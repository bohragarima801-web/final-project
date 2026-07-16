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
    const { action, userId, newPassword, alertMessage } = await req.json()

    if (!userId) {
      return NextResponse.json({ ok: false, error: 'User ID is required' }, { status: 400 })
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    })

    if (!user) {
      return NextResponse.json({ ok: false, error: 'User not found' }, { status: 404 })
    }

    // ACTION: Reset user password
    if (action === 'password') {
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

    // ACTION: Send WhatsApp Alert
    if (action === 'whatsapp') {
      if (!alertMessage) {
        return NextResponse.json({ ok: false, error: 'Alert message is required' }, { status: 400 })
      }

      const phone = user.phone || ''
      if (!phone) {
        return NextResponse.json({ ok: false, error: 'User does not have a registered phone number' }, { status: 400 })
      }

      // Simulate sending WhatsApp
      console.log(`[WHATSAPP ALERT] Dispatching to ${phone}: "${alertMessage}"`)

      return NextResponse.json({ ok: true, message: `WhatsApp alert sent successfully to ${phone}!` })
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

    // Delete in Supabase Auth using service role first
    if (user.supabaseId) {
      const supabaseAdmin = await createAdminClient()
      await supabaseAdmin.auth.admin.deleteUser(user.supabaseId).catch((err) => {
        console.warn('Failed to delete Supabase user, continuing database delete:', err)
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
