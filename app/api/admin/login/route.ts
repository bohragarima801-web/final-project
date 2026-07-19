import { NextRequest, NextResponse } from 'next/server'
import { ADMIN_COOKIE_NAME, ADMIN_SESSION_TTL_MS, signAdminToken } from '@/lib/admin-session'

import { initSecrets } from '@/lib/secrets'

import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()
    await initSecrets()

    const adminEmail = process.env.ADMIN_EMAIL || 'admin@devyajnam.com'
    const adminPass = process.env.ADMIN_PASSWORD || 'Admin@12345'

    if (!email || !password) {
      return NextResponse.json({ ok: false, error: 'Email and password required' }, { status: 400 })
    }

    const inputEmail = email.trim().toLowerCase()
    let isValid = false
    let loginEmail = inputEmail

    // 1. Check Super Admin (Environment fallback)
    if (inputEmail === adminEmail.toLowerCase() && password === adminPass) {
      isValid = true
      loginEmail = adminEmail
    } else {
      // 2. Check Database Sub-Admins
      const dbUser = await prisma.user.findUnique({
        where: { email: inputEmail },
        include: { role: true }
      })

      if (dbUser && dbUser.passwordHash) {
        if (dbUser.status === 'SUSPENDED') {
          return NextResponse.json({ ok: false, error: 'Account Suspended. Contact Super Admin.' }, { status: 403 })
        }

        // Check if user has an admin-level role
        // For simplicity, any role other than 'devotee' can access admin, or specific roles.
        // Let's assume roles with isSystem=true or slug 'admin', 'manager', 'editor', 'astrologer', 'support'
        const hasAdminAccess = dbUser.role?.isSystem || ['admin', 'manager', 'editor', 'astrologer', 'support'].includes(dbUser.role?.slug || '')
        
        if (hasAdminAccess) {
          const passMatch = await bcrypt.compare(password, dbUser.passwordHash)
          if (passMatch) {
            isValid = true
            loginEmail = dbUser.email
          }
        }
      }
    }

    if (!isValid) {
      // Small delay to slow brute-force
      await new Promise((r) => setTimeout(r, 400))
      return NextResponse.json({ ok: false, error: 'Invalid email or password' }, { status: 401 })
    }

    const token = await signAdminToken(loginEmail)
    const res = NextResponse.json({ ok: true, redirect: '/admin' })
    res.cookies.set(ADMIN_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: Math.floor(ADMIN_SESSION_TTL_MS / 1000),
    })
    return res
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message || 'Login failed' }, { status: 500 })
  }
}
