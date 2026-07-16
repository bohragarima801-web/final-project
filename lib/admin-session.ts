// lib/admin-session.ts
import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'

export const ADMIN_COOKIE_NAME = 'admin_session'

function getSecret() {
  const secret = process.env.ADMIN_JWT_SECRET || 'fallback-dev-secret-dont-use-in-prod'
  return secret
}

export async function verifyAdminToken(token: string) {
  try {
    const currentSecret = getSecret()
    const secretSource = process.env.ADMIN_JWT_SECRET ? 'process.env.ADMIN_JWT_SECRET' : 'Fallback Secret'
    console.log(`[DEBUG verifyAdminToken] Initiating JWT verification. Token length: ${token ? token.length : 0} bytes.`)
    console.log(`[DEBUG verifyAdminToken] ADMIN_JWT_SECRET length: ${process.env.ADMIN_JWT_SECRET ? process.env.ADMIN_JWT_SECRET.length : 0} chars. Source: ${secretSource}`)
    
    const decoded = jwt.verify(token, currentSecret)
    
    const isValid = !!(decoded && typeof decoded === 'object' && decoded.role === 'admin')
    console.log(`[DEBUG verifyAdminToken] Decoded successfully. Is role admin? ${isValid}. Decoded payload:`, JSON.stringify(decoded))
    return isValid
  } catch (error: any) {
    console.error('[DEBUG verifyAdminToken] Error during JWT verification:', error?.message || error, error?.stack)
    return false
  }
}

export async function createAdminToken(userId: string) {
  console.log(`[DEBUG createAdminToken] Creating new admin token for userId: ${userId}`)
  const currentSecret = getSecret()
  return jwt.sign({ userId, role: 'admin' }, currentSecret, { expiresIn: '1h' })
}

export function getAdminCookieOptions() {
  const isProdOrVercel = process.env.NODE_ENV === 'production' || !!process.env.VERCEL || !!process.env.NEXT_PUBLIC_VERCEL_ENV
  
  // Under Vercel/Cloud Run production or preview URLs, we run over HTTPS.
  // We must set sameSite: 'none' and secure: true so that cookies are successfully persisted
  // inside the AI Studio iframe environment. Lax/Strict cookies are blocked by modern browsers in third-party iframe contexts.
  const secure = isProdOrVercel
  const sameSite = secure ? ('none' as const) : ('lax' as const)

  const options = {
    httpOnly: true,
    secure,
    sameSite,
    path: '/',
    maxAge: 60 * 60, // 1 hour
  }
  
  const simulatedHeader = `${ADMIN_COOKIE_NAME}=[JWT_TOKEN_CONTENT]; Path=${options.path}; Max-Age=${options.maxAge}; HttpOnly; ${options.secure ? 'Secure; ' : ''}SameSite=${options.sameSite}`
  console.log(`[DEBUG getAdminCookieOptions] Cookie configuration details:`, JSON.stringify(options))
  console.log(`[DEBUG getAdminCookieOptions] Expected Set-Cookie header output: "${simulatedHeader}"`)
  console.log(`[DEBUG getAdminCookieOptions] Current process.env.NODE_ENV: "${process.env.NODE_ENV}"`)
  
  return options
}

export async function getAdminSession() {
  console.log('[DEBUG getAdminSession] Called.')
  try {
    const cookieStore = await cookies()
    const allCookies = cookieStore.getAll()
    console.log('[DEBUG getAdminSession] Available cookie names:', allCookies.map(c => c.name).join(', ') || '(none)')
    
    allCookies.forEach((c, idx) => {
      console.log(`[DEBUG getAdminSession] Cookie [${idx}] details: name="${c.name}", valueLength=${c.value ? c.value.length : 0}, path=${(c as any).path || 'undefined'}, domain=${(c as any).domain || 'undefined'}`)
    })
    
    const cookieObj = cookieStore.get(ADMIN_COOKIE_NAME)
    const token = cookieObj?.value
    if (!token) {
      console.warn(`[DEBUG getAdminSession] Cookie "${ADMIN_COOKIE_NAME}" not found.`)
      return null
    }
    
    console.log(`[DEBUG getAdminSession] Token found in cookie "${ADMIN_COOKIE_NAME}". Length: ${token.length}. Properties:`, JSON.stringify({
      path: (cookieObj as any).path,
      domain: (cookieObj as any).domain,
      secure: (cookieObj as any).secure,
      httpOnly: (cookieObj as any).httpOnly,
    }))
    
    const isValid = await verifyAdminToken(token)
    if (!isValid) {
      console.warn('[DEBUG getAdminSession] Token is invalid.')
      return null
    }
    
    const currentSecret = getSecret()
    const decoded = jwt.verify(token, currentSecret) as any
    console.log('[DEBUG getAdminSession] Successfully authenticated admin session.')
    return {
      email: 'admin@devyajnam.com',
      ...decoded,
    }
  } catch (e: any) {
    console.error('[DEBUG getAdminSession] Exception in getAdminSession:', e?.message || e, e?.stack)
    return null
  }
}


