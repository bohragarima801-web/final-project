import { prisma } from '@/lib/prisma'

export async function getWebsiteSettings() {
  try {
    const settings = await prisma.websiteSetting.findMany()
    const config: Record<string, any> = {}
    settings.forEach(s => {
      config[s.key] = s.value
    })
    return config
  } catch (err) {
    console.error('[getWebsiteSettings] Failed to load settings:', err)
    return {}
  }
}
