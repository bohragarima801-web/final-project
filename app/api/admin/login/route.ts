import { NextRequest, NextResponse } from 'next/server'
import { createAdminToken, ADMIN_COOKIE_NAME, getAdminCookieOptions } from '@/lib/admin-session'
import { initSecrets } from '@/lib/secrets'

export async function POST(req: NextRequest) {
  try {
    // Ensure secrets from admin are loaded into process.env
    await initSecrets()

    const { email, password } = await req.json()

    // Default or configured admin credentials
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@devyajnam.com'
    const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@12345'

    if (email !== adminEmail || password !== adminPassword) {
      console.warn(`[DEBUG Admin Login API] Failed login attempt for email: ${email}`)
      return NextResponse.json({ ok: false, error: 'Invalid admin credentials' }, { status: 401 })
    }

    console.log(`[DEBUG Admin Login API] Successful credentials match for email: ${email}. Generating token...`)
    const token = await createAdminToken('admin-user-id')

    const res = NextResponse.json({ ok: true })
    
    // Retrieve logged cookie options
    const cookieOptions = getAdminCookieOptions()
    
    console.log(`[DEBUG Admin Login API] Setting cookie "${ADMIN_COOKIE_NAME}" on response. Cookie options:`, JSON.stringify(cookieOptions))
    res.cookies.set(ADMIN_COOKIE_NAME, token, cookieOptions)

    // Log response headers to verify what Next.js includes
    const setCookieHeaders = res.headers.getSetCookie()
    console.log(`[DEBUG Admin Login API] Response Set-Cookie headers:`, JSON.stringify(setCookieHeaders))

    return res
  } catch (err: any) {
    console.error('[DEBUG Admin Login API] Error occurred during admin login:', err?.message || err, err?.stack)
    return NextResponse.json({ ok: false, error: err?.message || 'Server error' }, { status: 500 })
  }
}
