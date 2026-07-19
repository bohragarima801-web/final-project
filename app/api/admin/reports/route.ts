import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const adminUser = await getCurrentUser().catch(() => null)
    if (!adminUser || adminUser.role !== 'admin') {
      return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 })
    }

    // 1. Get Successful Payments Revenue
    const successfulPayments = await prisma.payment.findMany({
      where: { status: 'SUCCESS' },
      select: { amount: true }
    })
    const totalRevenue = successfulPayments.reduce((sum, p) => sum + Number(p.amount), 0)

    // 2. Get Refunds Issued
    const refunds = await prisma.refund.findMany({
      where: { status: 'SUCCESS' },
      select: { amount: true }
    })
    const totalRefunds = refunds.reduce((sum, r) => sum + Number(r.amount), 0)

    // 3. Get Tax Collected (from Invoices, fallback to 18% of revenue if 0)
    const invoices = await prisma.invoice.findMany({
      select: { tax: true }
    })
    let totalTax = invoices.reduce((sum, i) => sum + Number(i.tax), 0)
    if (totalTax === 0) {
      totalTax = totalRevenue * 0.18 // 18% GST estimate
    }

    // 4. Bookings statistics
    const bookingsCount = await prisma.booking.count()
    const successfulBookings = await prisma.booking.count({
      where: { status: 'CONFIRMED' }
    })

    // 5. Products/Orders statistics
    const ordersCount = await prisma.order.count()
    const completedOrders = await prisma.order.count({
      where: { status: 'DELIVERED' }
    })

    // 6. Customers statistics
    const devoteesCount = await prisma.user.count({
      where: { role: { slug: 'devotee' } }
    })

    return NextResponse.json({
      ok: true,
      stats: {
        totalRevenue: Math.round(totalRevenue),
        totalRefunds: Math.round(totalRefunds),
        totalTax: Math.round(totalTax),
        bookingsCount,
        successfulBookings,
        ordersCount,
        completedOrders,
        devoteesCount
      }
    })
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message || 'Database aggregation failed' }, { status: 500 })
  }
}
