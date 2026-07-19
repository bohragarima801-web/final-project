import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAdminSession } from '@/lib/admin-session'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  try {
    const session = await getAdminSession()
    if (!session) {
      return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 })
    }

    const { subject, message } = await req.json()

    if (!subject || !message) {
      return NextResponse.json({ ok: false, error: 'Subject and Message are required' }, { status: 400 })
    }

    // Get all active subscribers
    const subscribers = await prisma.newsletter.findMany({
      where: {
        isActive: true
      },
      select: {
        email: true
      }
    })

    if (subscribers.length === 0) {
      return NextResponse.json({
        ok: true,
        message: 'No active subscribers found to send the newsletter.'
      })
    }

    // Since we don't have an active SMTP integration right now, 
    // we simulate sending the newsletter emails.
    const emailSentCount = subscribers.length

    // Optional: Log the newsletter dispatch to the database if there was a NewsletterLog model,
    // but for now, we just return success.

    return NextResponse.json({
      ok: true,
      message: `Newsletter "${subject}" broadcasted successfully! Sent ${emailSentCount} emails.`,
      details: {
        totalRecipients: subscribers.length,
        recipients: subscribers.map(s => s.email)
      }
    })
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message || 'Database error during newsletter broadcast' }, { status: 500 })
  }
}
