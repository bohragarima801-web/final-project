import { prisma } from '@/lib/prisma'
import { initSecrets } from '@/lib/secrets'

export async function getWebsiteSettings() {
  try {
    // Automatically populate and synchronize process.env with latest DB-configured secrets
    await initSecrets()

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
