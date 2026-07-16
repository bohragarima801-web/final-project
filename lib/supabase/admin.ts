import { createClient } from '@supabase/supabase-js'
import { getSetting } from '@/lib/settings'

// Server-only admin client using the service-role key.
// Never expose this on the browser.
export async function createAdminClient() {
  const url = await getSetting('secret.supabase_url', 'NEXT_PUBLIC_SUPABASE_URL')
  const serviceKey = await getSetting('secret.supabase_service_role_key', 'SUPABASE_SERVICE_ROLE_KEY')

  if (!serviceKey) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY is not configured')
  }

  return createClient(url, serviceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}

