import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { getSetting } from '@/lib/settings'

export async function createClient() {
  const cookieStore = await cookies()
  const sbUrl = await getSetting('secret.supabase_url', 'NEXT_PUBLIC_SUPABASE_URL')
  const sbKey = await getSetting('secret.supabase_anon_key', 'NEXT_PUBLIC_SUPABASE_ANON_KEY')

  return createServerClient(
    sbUrl,
    sbKey,
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

