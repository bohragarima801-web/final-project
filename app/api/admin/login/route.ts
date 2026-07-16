import { NextRequest, NextResponse } from 'next/server'
import { ADMIN_COOKIE_NAME, ADMIN_SESSION_TTL_MS, signAdminToken } from '@/lib/admin-session'

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()
    const adminEmail = process.env.ADMIN_EMAIL
    const adminPass = process.env.ADMIN_PASSWORD

    if (!adminEmail || !adminPass) {
      return NextResponse.json({ ok: false, error: 'Admin credentials not configured' }, { status: 500 })
    }

    if (!email || !password) {
      return NextResponse.json({ ok: false, error: 'Email and password required' }, { status: 400 })
    }

    if (email.trim().toLowerCase() !== adminEmail.toLowerCase() || password !== adminPass) {
      // Small delay to slow brute-force
      await new Promise((r) => setTimeout(r, 400))
      return NextResponse.json({ ok: false, error: 'Invalid email or password' }, { status: 401 })
    }

    const token = await signAdminToken(adminEmail)
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
