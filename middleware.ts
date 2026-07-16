// middleware.ts - COMPLETE REPLACEMENT
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname
  
  console.log(`[DEBUG Middleware] Processing request for path: ${path}`)
  
  // Set the x-pathname header so Server Components/Layouts can know the current path
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-pathname', path)

  // Public paths - allow all
  if (path.startsWith('/_next') || path.startsWith('/api/auth')) {
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      }
    })
  }

  // Log active cookies and environment variables availability
  const cookiesList = request.cookies.getAll()
  const cookieNames = cookiesList.map(c => c.name).join(', ') || '(none)'
  console.log(`[DEBUG Middleware] Available cookies: [${cookieNames}]`)
  console.log(`[DEBUG Middleware] ADMIN_JWT_SECRET present: ${!!process.env.ADMIN_JWT_SECRET}`)

  // For admin routes, check cookie directly
  if (path === '/admin' || path.startsWith('/admin/')) {
    if (path.startsWith('/admin/login')) {
      console.log(`[DEBUG Middleware] Accessing admin login path: ${path}. Skipping token verification.`)
      return NextResponse.next({
        request: {
          headers: requestHeaders,
        }
      })
    }
    
    const adminCookie = request.cookies.get('admin_session')
    if (!adminCookie) {
      console.warn(`[DEBUG Middleware] "admin_session" cookie not found for path: ${path}. Redirecting to /admin/login`)
      const redirectUrl = request.nextUrl.clone()
      redirectUrl.pathname = '/admin/login'
      redirectUrl.search = '' // clear search params to avoid loop carrying
      return NextResponse.redirect(redirectUrl)
    }
    
    console.log(`[DEBUG Middleware] "admin_session" cookie found. Length: ${adminCookie.value ? adminCookie.value.length : 0} characters. Path matching passes.`)
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      }
    })
  }

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    }
  })
}

export const config = {
  matcher: [
    '/admin',
    '/admin/:path*',
    '/dashboard',
    '/dashboard/:path*'
  ]
}

