import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

const getSafeSupabaseUrl = (url?: string) => {
  if (url && (url.startsWith('http://') || url.startsWith('https://'))) {
    try {
      new URL(url)
      return url
    } catch (_) {}
  }
  return 'https://placeholder.supabase.co'
}

export async function createClient() {
  const cookieStore = await cookies()
  const url = getSafeSupabaseUrl(process.env.NEXT_PUBLIC_SUPABASE_URL)
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key'

  return createServerClient(
    url,
    key,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Server Component cannot set cookies; middleware handles refresh
          }
        },
      },
    }
  )
}

