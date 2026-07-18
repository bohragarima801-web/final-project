import { prisma } from './prisma'

let secretsLoaded = false

/**
 * Loads all secrets from the database and populates process.env with them.
 * This overrides standard env variables at runtime using admin-configured values.
 */
export async function initSecrets(force = false) {
  if (secretsLoaded && !force) return

  try {
    const settings = await prisma.websiteSetting.findMany({
      where: {
        OR: [
          { group: 'secrets' },
          { key: { startsWith: 'secret_' } }
        ]
      }
    })

    settings.forEach(setting => {
      const val = setting.value
      if (val === undefined || val === null) return

      // Handle both pure strings and JSON-wrapped values
      let cleanVal = ''
      if (typeof val === 'string') {
        cleanVal = val
      } else {
        try {
          cleanVal = typeof val === 'object' ? (val as any).value ?? JSON.stringify(val) : String(val)
        } catch {
          cleanVal = String(val)
        }
      }

      if (!cleanVal) return

      // Map configuration keys to system process.env variables
      switch (setting.key) {
        case 'secret_razorpay_key_id':
          process.env.RAZORPAY_KEY_ID = cleanVal
          process.env['NEXT_PUBLIC_' + 'RAZORPAY_KEY_ID'] = cleanVal
          break
        case 'secret_razorpay_key_secret':
          process.env.RAZORPAY_KEY_SECRET = cleanVal
          break
        case 'secret_razorpay_webhook_secret':
          process.env.RAZORPAY_WEBHOOK_SECRET = cleanVal
          break
        case 'secret_emergent_llm_key':
          process.env.EMERGENT_LLM_KEY = cleanVal
          break
        case 'secret_gemini_api_key':
          process.env.GEMINI_API_KEY = cleanVal
          break
        case 'secret_supabase_url':
          process.env['NEXT_PUBLIC_' + 'SUPABASE_URL'] = cleanVal
          break
        case 'secret_supabase_anon_key':
          process.env['NEXT_PUBLIC_' + 'SUPABASE_ANON_KEY'] = cleanVal
          break
        case 'secret_supabase_service_role_key':
          process.env.SUPABASE_SERVICE_ROLE_KEY = cleanVal
          break
        case 'secret_admin_email':
          process.env.ADMIN_EMAIL = cleanVal
          break
        case 'secret_admin_password':
          process.env.ADMIN_PASSWORD = cleanVal
          break
        case 'secret_admin_jwt_secret':
          process.env.ADMIN_JWT_SECRET = cleanVal
          break
        default:
          if (setting.key.startsWith('secret_')) {
            const envKey = setting.key.replace(/^secret_/, '').toUpperCase()
            process.env[envKey] = cleanVal
          }
          break
      }
    })

    secretsLoaded = true
    console.log('[Secrets Engine] Successfully loaded DB site secrets into environment variables.')
  } catch (err) {
    console.error('[Secrets Engine] Error loading secrets from database:', err)
  }
}
