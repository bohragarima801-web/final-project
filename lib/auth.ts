import { createClient } from '@/lib/supabase/server'
import prisma from '@/lib/prisma'
import type { RoleSlug } from '@/lib/rbac'

export type AuthUser = {
  id: string
  email: string
  fullName: string | null
  avatar: string | null
  role: RoleSlug | null
  supabaseId: string
}

export async function getSession() {
  const isPlaceholder = !process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder')
  if (!isPlaceholder) {
    try {
      const supabase = await createClient()
      const { data } = await supabase.auth.getUser()
      if (data?.user) return data.user
    } catch (e) {
      console.warn('[getSession] Supabase client error:', e)
    }
  }

  // Fallback: Check cookie for local/development session
  try {
    const { cookies } = await import('next/headers')
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get('customer_session')
    if (sessionCookie?.value) {
      const parsed = JSON.parse(decodeURIComponent(sessionCookie.value))
      if (parsed && parsed.id) {
        return {
          id: parsed.id,
          email: parsed.email,
          email_confirmed_at: new Date().toISOString(),
          user_metadata: {
            full_name: parsed.fullName || 'Devotee',
          },
        } as any
      }
    }
  } catch (e: any) {
    if (e && (e.digest === 'DYNAMIC_SERVER_USAGE' || e.digest?.startsWith('NEXT_REDIRECT') || e.digest === 'NEXT_NOT_FOUND')) {
      throw e
    }
    console.warn('[getSession] Fallback session parsing failed:', e)
  }
  return null
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  try {
    const supaUser = await getSession()
    if (!supaUser) return null

    // Try to find local user record; if not found, create one on the fly.
    let dbUser = await prisma.user.findUnique({
      where: { supabaseId: supaUser.id },
      include: { role: true },
    })

    if (!dbUser && supaUser.email) {
      const defaultRole = await prisma.role.findUnique({ where: { slug: 'devotee' } })
      dbUser = await prisma.user.create({
        data: {
          supabaseId: supaUser.id,
          email: supaUser.email,
          emailVerified: !!supaUser.email_confirmed_at,
          fullName: (supaUser.user_metadata?.full_name as string) || null,
          avatar: (supaUser.user_metadata?.avatar_url as string) || null,
          roleId: defaultRole?.id ?? null,
        },
        include: { role: true },
      })
    }

    if (!dbUser) return null

    return {
      id: dbUser.id,
      email: dbUser.email,
      fullName: dbUser.fullName,
      avatar: dbUser.avatar,
      role: (dbUser.role?.slug as RoleSlug) ?? 'devotee',
      supabaseId: dbUser.supabaseId!,
    }
  } catch (err: any) {
    if (err && (err.digest === 'DYNAMIC_SERVER_USAGE' || err.digest?.startsWith('NEXT_REDIRECT') || err.digest === 'NEXT_NOT_FOUND')) {
      throw err
    }
    // If DB is unreachable (e.g. dev env), fall back to Supabase user only.
    const supaUser = await getSession()
    if (!supaUser) return null
    return {
      id: supaUser.id,
      email: supaUser.email ?? '',
      fullName: (supaUser.user_metadata?.full_name as string) ?? null,
      avatar: (supaUser.user_metadata?.avatar_url as string) ?? null,
      role: 'devotee',
      supabaseId: supaUser.id,
    }
  }
}

export async function requireUser(): Promise<AuthUser> {
  const user = await getCurrentUser()
  if (!user) throw new Error('UNAUTHORIZED')
  return user
}
