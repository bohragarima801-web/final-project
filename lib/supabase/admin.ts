import { createClient } from '@supabase/supabase-js'

const getSafeSupabaseUrl = (url?: string) => {
  if (url && (url.startsWith('http://') || url.startsWith('https://'))) {
    try {
      new URL(url)
      return url
    } catch (_) {}
  }
  return 'https://placeholder.supabase.co'
}

// Server-only admin client using the service-role key.
// Never expose this on the browser.
export function createAdminClient() {
  const url = getSafeSupabaseUrl(process.env.NEXT_PUBLIC_SUPABASE_URL)
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!serviceKey) {
    console.warn('⚠️ SUPABASE_SERVICE_ROLE_KEY is not configured. Some admin actions may fail.')
  }

  return createClient(url, serviceKey || 'placeholder-service-key', {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}
