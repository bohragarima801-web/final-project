import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const adminUser = await getCurrentUser().catch(() => null)
    if (!adminUser || adminUser.role !== 'admin') {
      return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 })
    }

    let paymentSettings = await prisma.websiteSetting.findUnique({
      where: { key: 'payment_settings' }
    })

    if (!paymentSettings) {
      paymentSettings = await prisma.websiteSetting.create({
        data: {
          key: 'payment_settings',
          group: 'payments',
          value: {
            isRazorpayEnabled: true,
            razorpayKeyId: 'rzp_test_108Devy',
            razorpayKeySecret: '••••••••',
            razorpayWebhookSecret: '',
            isUpiQrEnabled: false,
            upiQrCodeUrl: '',
            upiId: 'divyayagyam@upi',
            gstPercentage: 18,
            currency: 'INR',
            refundWindowDays: 7
          }
        }
      })
    }

    return NextResponse.json({ ok: true, data: paymentSettings.value })
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message || 'Database error fetching settings' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const adminUser = await getCurrentUser().catch(() => null)
    if (!adminUser || adminUser.role !== 'admin') {
      return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const {
      isRazorpayEnabled,
      razorpayKeyId,
      razorpayKeySecret,
      razorpayWebhookSecret,
      isUpiQrEnabled,
      upiQrCodeUrl,
      upiId,
      gstPercentage,
      currency,
      refundWindowDays
    } = body

    const paymentSettings = await prisma.websiteSetting.upsert({
      where: { key: 'payment_settings' },
      update: {
        value: {
          isRazorpayEnabled: !!isRazorpayEnabled,
          razorpayKeyId,
          razorpayKeySecret,
          razorpayWebhookSecret,
          isUpiQrEnabled: !!isUpiQrEnabled,
          upiQrCodeUrl,
          upiId,
          gstPercentage: Number(gstPercentage) || 0,
          currency: currency || 'INR',
          refundWindowDays: Number(refundWindowDays) || 7
        }
      },
      create: {
        key: 'payment_settings',
        group: 'payments',
        value: {
          isRazorpayEnabled: !!isRazorpayEnabled,
          razorpayKeyId,
          razorpayKeySecret,
          razorpayWebhookSecret,
          isUpiQrEnabled: !!isUpiQrEnabled,
          upiQrCodeUrl,
          upiId,
          gstPercentage: Number(gstPercentage) || 0,
          currency: currency || 'INR',
          refundWindowDays: Number(refundWindowDays) || 7
        }
      }
    })

    return NextResponse.json({ ok: true, message: 'Payment Settings saved successfully!', data: paymentSettings.value })
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message || 'Database update failed' }, { status: 500 })
  }
}
