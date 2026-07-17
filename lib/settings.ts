import prisma from '@/lib/prisma'

const cache: Record<string, { value: string; expiry: number }> = {}
const CACHE_TTL_MS = 60000 // 1 minute cache

export async function getSetting(key: string, envFallback?: string): Promise<string> {
  const now = Date.now()
  if (cache[key] && cache[key].expiry > now) {
    return cache[key].value
  }

  try {
    const setting = await prisma.websiteSetting.findUnique({
      where: { key }
    })
    if (setting && setting.value) {
      const val = typeof setting.value === 'string' ? setting.value : JSON.stringify(setting.value)
      const cleaned = val.replace(/^"|"$/g, '')
      cache[key] = { value: cleaned, expiry: now + CACHE_TTL_MS }
      return cleaned
    }
  } catch (e) {
    // DB unreachable or table doesn't exist
  }

  if (envFallback) {
    const val = (process.env[envFallback] || '').replace(/^"|"$/g, '')
    cache[key] = { value: val, expiry: now + CACHE_TTL_MS }
    return val
  }
  return ''
}
