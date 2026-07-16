'use client'

import { createBrowserClient } from '@supabase/ssr'

const getSafeSupabaseUrl = (url?: string) => {
  if (url && (url.startsWith('http://') || url.startsWith('https://'))) {
    try {
      new URL(url)
      return url
    } catch (_) {}
  }
  return 'https://placeholder.supabase.co'
}

export function createClient() {
  const url = getSafeSupabaseUrl(process.env.NEXT_PUBLIC_SUPABASE_URL)
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key'
  return createBrowserClient(url, key)
}

