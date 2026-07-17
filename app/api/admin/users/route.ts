import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createAdminClient } from '@/lib/supabase/admin'

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      include: {
        role: true,
      },
      orderBy: { createdAt: 'desc' },
    })

    const mapped = users.map((u) => ({
      id: u.id,
      supabaseId: u.supabaseId,
      name: u.fullName || 'User',
      email: u.email,
      phone: u.phone || 'N/A',
      role: u.role?.name || 'Devotee',
      roleSlug: u.role?.slug || 'devotee',
      status: 'ACTIVE',
      createdAt: new Date(u.createdAt).toLocaleDateString('en-IN'),
    }))

    return NextResponse.json({ ok: true, data: mapped })
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const { action, userId, name, email, phone, roleSlug, newPassword } = await req.json()

    // 1. Create User
    if (action === 'create') {
      if (!name || !email || !roleSlug || !newPassword) {
        return NextResponse.json({ ok: false, error: 'Name, Email, Role and Password are required' }, { status: 400 })
      }

      const existing = await prisma.user.findUnique({ where: { email } })
      if (existing) {
        return NextResponse.json({ ok: false, error: 'Email already registered' }, { status: 400 })
      }

      // Create in Supabase Auth first
      const supabaseAdmin = await createAdminClient()
      const { data: supaUser, error: supaError } = await supabaseAdmin.auth.admin.createUser({
        email,
        password: newPassword,
        phone: phone || undefined,
        email_confirm: true,
        user_metadata: { fullName: name, phone },
      })

      if (supaError) {
        return NextResponse.json({ ok: false, error: supaError.message }, { status: 400 })
      }

      let role = await prisma.role.findUnique({ where: { slug: roleSlug } })
      if (!role) {
        role = await prisma.role.create({
          data: { name: roleSlug.charAt(0).toUpperCase() + roleSlug.slice(1), slug: roleSlug },
        })
      }

      const user = await prisma.user.create({
        data: {
          supabaseId: supaUser.user.id,
          email,
          fullName: name,
          phone,
          roleId: role.id,
        },
      })

      return NextResponse.json({ ok: true, message: 'User created successfully!', data: user })
    }

    // 2. Update User
    if (action === 'update') {
      if (!userId || !name || !email || !roleSlug) {
        return NextResponse.json({ ok: false, error: 'User ID, Name, Email and Role are required' }, { status: 400 })
      }

      let role = await prisma.role.findUnique({ where: { slug: roleSlug } })
      if (!role) {
        role = await prisma.role.create({
          data: { name: roleSlug.charAt(0).toUpperCase() + roleSlug.slice(1), slug: roleSlug },
        })
      }

      const updated = await prisma.user.update({
        where: { id: userId },
        data: {
          fullName: name,
          email,
          phone: phone || null,
          roleId: role.id,
        },
      })

      return NextResponse.json({ ok: true, message: 'User updated successfully!', data: updated })
    }

    return NextResponse.json({ ok: false, error: 'Invalid action' }, { status: 400 })
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message }, { status: 500 })
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
