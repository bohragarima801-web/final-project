// app/admin/page.tsx
import { cookies } from 'next/headers'
import { verifyAdminToken, ADMIN_COOKIE_NAME } from '@/lib/admin-session'
import { prisma } from '@/lib/prisma'
import { DashboardView } from '@/components/admin/dashboard-view'

export const dynamic = 'force-dynamic'

export default async function AdminPage() {
  console.log('[DEBUG AdminPage] Rendering AdminPage - starting auth checks...')
  try {
    const cookieStore = await cookies()
    const cookieObj = cookieStore.get(ADMIN_COOKIE_NAME)
    const token = cookieObj?.value
    
    if (!token) {
      console.warn('[DEBUG AdminPage] No admin token found in cookies. Showing Unauthorized.')
      return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 text-center">
          <div className="h-12 w-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-xl font-bold mb-3">!</div>
          <h2 className="text-xl font-bold text-foreground">Unauthorized Access</h2>
          <p className="text-muted-foreground text-sm mt-1 max-w-sm">Please log in as an administrator to access the Control Center.</p>
        </div>
      )
    }

    console.log('[DEBUG AdminPage] Verifying admin token...')
    const isValid = await verifyAdminToken(token)

    if (!isValid) {
      console.warn('[DEBUG AdminPage] Token verification failed.')
      return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 text-center">
          <div className="h-12 w-12 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center text-xl font-bold mb-3">?</div>
          <h2 className="text-xl font-bold text-foreground">Session Expired</h2>
          <p className="text-muted-foreground text-sm mt-1 max-w-sm">Your admin session is invalid or has expired. Please sign in again.</p>
        </div>
      )
    }

    console.log('[DEBUG AdminPage] Token verified. Fetching real-time system metrics from PostgreSQL...')
    
    // Query metrics
    let stats = {
      totalCollections: 0,
      bookingsCount: 0,
      ordersCount: 0,
      usersCount: 0,
      supportTicketsCount: 0,
      activePujasCount: 0,
      templesCount: 0,
      productsCount: 0,
      blogsCount: 0,
      eventsCount: 0,
      galleryCount: 0,
      testimonialsCount: 0,
      chadhawaCount: 0,
      donationsCount: 0
    }

    let recentBookings: any[] = []
    let recentOrders: any[] = []
    let recentChadhawa: any[] = []
    let recentDonations: any[] = []
    let recentUsers: any[] = []
    let recentPayments: any[] = []
    let recentSupportTickets: any[] = []

    let weeklyTrend: any[] = []
    let monthlyMetrics: any[] = []

    try {
      // 1. Dashboard counts
      const [
        totalDevotees,
        pujaBookings,
        storeOrders,
        supportTickets,
        activePujas,
        templeCount,
        products,
        blogs,
        events,
        galleryImages,
        testimonials,
        chadhawaCount,
        donationsCount
      ] = await Promise.all([
        prisma.user.count(),
        prisma.booking.count(),
        prisma.order.count(),
        prisma.supportTicket.count({ where: { status: 'OPEN' } }),
        prisma.puja.count({ where: { status: 'PUBLISHED' } }),
        prisma.temple.count(),
        prisma.product.count(),
        prisma.blog.count(),
        prisma.event.count(),
        prisma.galleryItem.count(),
        prisma.testimonial.count(),
        prisma.chadhawa.count(),
        prisma.donation.count()
      ])

      const paymentSum = await prisma.payment.aggregate({
        where: { status: 'SUCCESS' },
        _sum: { amount: true }
      })

      stats = {
        totalCollections: Number(paymentSum._sum.amount || 0),
        bookingsCount: pujaBookings,
        ordersCount: storeOrders,
        usersCount: totalDevotees,
        supportTicketsCount: supportTickets,
        activePujasCount: activePujas,
        templesCount: templeCount,
        productsCount: products,
        blogsCount: blogs,
        eventsCount: events,
        galleryCount: galleryImages,
        testimonialsCount: testimonials,
        chadhawaCount: chadhawaCount,
        donationsCount: donationsCount
      }

      // 2. Recent activities
      recentBookings = await prisma.booking.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          user: { select: { email: true, fullName: true } },
          puja: { select: { name: true } }
        }
      })

      recentOrders = await prisma.order.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          user: { select: { email: true, fullName: true } }
        }
      })

      recentChadhawa = await prisma.chadhawa.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          user: { select: { fullName: true } }
        }
      })

      recentDonations = await prisma.donation.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          user: { select: { email: true, fullName: true } }
        }
      })

      recentUsers = await prisma.user.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' }
      })

      recentPayments = await prisma.payment.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          user: { select: { email: true, fullName: true } }
        }
      })

      recentSupportTickets = await prisma.supportTicket.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          user: { select: { email: true, fullName: true } }
        }
      })

      // 3. Weekly Seva Trend (Last 7 days bookings & orders)
      const sevenDaysAgo = new Date()
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

      const [bookingsLast7Days, ordersLast7Days] = await Promise.all([
        prisma.booking.findMany({
          where: { createdAt: { gte: sevenDaysAgo } },
          select: { createdAt: true }
        }),
        prisma.order.findMany({
          where: { createdAt: { gte: sevenDaysAgo } },
          select: { createdAt: true }
        })
      ])

      const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
      const last7DaysMap = Array.from({ length: 7 }, (_, i) => {
        const d = new Date()
        d.setDate(d.getDate() - (6 - i))
        return {
          day: daysOfWeek[d.getDay()],
          dateStr: d.toDateString(),
          bookings: 0,
          orders: 0
        }
      })

      bookingsLast7Days.forEach(b => {
        const bDayStr = new Date(b.createdAt).toDateString()
        const found = last7DaysMap.find(d => d.dateStr === bDayStr)
        if (found) found.bookings++
      })

      ordersLast7Days.forEach(o => {
        const oDayStr = new Date(o.createdAt).toDateString()
        const found = last7DaysMap.find(d => d.dateStr === oDayStr)
        if (found) found.orders++
      })

      weeklyTrend = last7DaysMap.map(({ day, bookings, orders }) => ({ day, bookings, orders }))

      // 4. Monthly metrics (Last 6 months revenue, orders, users, payments, temples)
      const sixMonthsAgo = new Date()
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)

      const [
        paymentsLast6Months,
        ordersLast6Months,
        usersLast6Months,
        templesLast6Months
      ] = await Promise.all([
        prisma.payment.findMany({
          where: { createdAt: { gte: sixMonthsAgo }, status: 'SUCCESS' },
          select: { createdAt: true, amount: true }
        }),
        prisma.order.findMany({
          where: { createdAt: { gte: sixMonthsAgo } },
          select: { createdAt: true }
        }),
        prisma.user.findMany({
          where: { createdAt: { gte: sixMonthsAgo } },
          select: { createdAt: true }
        }),
        prisma.temple.findMany({
          where: { createdAt: { gte: sixMonthsAgo } },
          select: { createdAt: true }
        })
      ])

      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      const last6MonthsMap = Array.from({ length: 6 }, (_, i) => {
        const d = new Date()
        d.setMonth(d.getMonth() - (5 - i))
        return {
          month: months[d.getMonth()],
          year: d.getFullYear(),
          monthIndex: d.getMonth(),
          revenue: 0,
          orders: 0,
          users: 0,
          payments: 0,
          temples: 0
        }
      })

      paymentsLast6Months.forEach(p => {
        const pDate = new Date(p.createdAt)
        const found = last6MonthsMap.find(m => m.monthIndex === pDate.getMonth() && m.year === pDate.getFullYear())
        if (found) {
          found.revenue += Number(p.amount || 0)
          found.payments++
        }
      })

      ordersLast6Months.forEach(o => {
        const oDate = new Date(o.createdAt)
        const found = last6MonthsMap.find(m => m.monthIndex === oDate.getMonth() && m.year === oDate.getFullYear())
        if (found) found.orders++
      })

      usersLast6Months.forEach(u => {
        const uDate = new Date(u.createdAt)
        const found = last6MonthsMap.find(m => m.monthIndex === uDate.getMonth() && m.year === uDate.getFullYear())
        if (found) found.users++
      })

      templesLast6Months.forEach(t => {
        const tDate = new Date(t.createdAt)
        const found = last6MonthsMap.find(m => m.monthIndex === tDate.getMonth() && m.year === tDate.getFullYear())
        if (found) found.temples++
      })

      monthlyMetrics = last6MonthsMap.map(({ month, revenue, orders, users, payments, temples }) => ({
        month, revenue, orders, users, payments, temples
      }))

    } catch (dbError: any) {
      console.warn('[DEBUG AdminPage] Database query error, fallback to blank arrays:', dbError?.message)
    }

    return (
      <DashboardView 
        stats={stats}
        recentBookings={recentBookings}
        recentOrders={recentOrders}
        recentChadhawa={recentChadhawa}
        recentDonations={recentDonations}
        recentUsers={recentUsers}
        recentPayments={recentPayments}
        recentSupportTickets={recentSupportTickets}
        weeklyTrend={weeklyTrend}
        monthlyMetrics={monthlyMetrics}
      />
    )
  } catch (error: any) {
    console.error('[DEBUG AdminPage] Unhandled error loading admin panel:', error?.message || error, error?.stack)
    return (
      <div className="p-6 bg-red-50 text-red-900 border border-red-200 rounded-lg max-w-xl mx-auto my-8">
        <h3 className="font-bold text-lg">Control Center Load Error</h3>
        <p className="text-sm mt-1">An unexpected error occurred while loading the dashboard. Please check server logs.</p>
        <pre className="mt-3 p-3 bg-red-100 text-xs font-mono rounded overflow-x-auto">{error?.message || error}</pre>
      </div>
    )
  }
}


