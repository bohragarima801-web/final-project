import prisma from '@/lib/prisma'

export async function getSetting(key: string, envFallback?: string): Promise<string> {
  try {
    const setting = await prisma.websiteSetting.findUnique({
      where: { key }
    })
    if (setting && setting.value) {
      return typeof setting.value === 'string' ? setting.value : JSON.stringify(setting.value)
    }
  } catch (e) {
    // DB unreachable or table doesn't exist
  }

  if (envFallback) {
    return process.env[envFallback] || ''
  }
  return ''
}
