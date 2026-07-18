import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const adminUser = await getCurrentUser().catch(() => null)
    if (!adminUser || adminUser.role?.slug !== 'admin') {
      return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 })
    }

    let marketingHubSetting = await prisma.websiteSetting.findUnique({
      where: { key: 'marketing_hub' }
    })

    if (!marketingHubSetting) {
      marketingHubSetting = await prisma.websiteSetting.create({
        data: {
          key: 'marketing_hub',
          group: 'marketing',
          value: {
            googleAnalyticsId: 'G-108DAVYAG',
            googleAdsId: 'AW-10899403',
            metaPixelId: '1081739201948',
            customHeaderScripts: '<!-- Google Tag Manager -->\n<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({"gtm.start":new Date().getTime(),event:"gtm.js"});})(window,document,"script","dataLayer","GTM-108YAG");</script>\n<!-- End Google Tag Manager -->'
          }
        }
      })
    }

    // Get Active coupons and newsletters to display stats
    const couponsCount = await prisma.coupon.count()
    const newsletterCount = await prisma.newsletter.count()

    return NextResponse.json({
      ok: true,
      data: marketingHubSetting.value,
      stats: {
        couponsCount,
        newsletterCount
      }
    })
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message || 'Database error fetching marketing settings' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const adminUser = await getCurrentUser().catch(() => null)
    if (!adminUser || adminUser.role?.slug !== 'admin') {
      return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { googleAnalyticsId, googleAdsId, metaPixelId, customHeaderScripts } = body

    const marketingHubSetting = await prisma.websiteSetting.upsert({
      where: { key: 'marketing_hub' },
      update: {
        value: {
          googleAnalyticsId,
          googleAdsId,
          metaPixelId,
          customHeaderScripts
        }
      },
      create: {
        key: 'marketing_hub',
        group: 'marketing',
        value: {
          googleAnalyticsId,
          googleAdsId,
          metaPixelId,
          customHeaderScripts
        }
      }
    })

    return NextResponse.json({ ok: true, message: 'Marketing Settings saved and applied successfully!', data: marketingHubSetting.value })
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message || 'Database update failed' }, { status: 500 })
  }
}
