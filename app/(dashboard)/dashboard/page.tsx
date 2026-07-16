import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Calendar, ShoppingBag, Heart, Bell, Flame, ArrowRight, Clock, MapPin } from 'lucide-react'
import { getCurrentUser } from '@/lib/auth'
import prisma from '@/lib/prisma'
import Link from 'next/link'

export default async function DashboardPage() {
  const user = await getCurrentUser()
  if (!user) return null

  // Fetch real-time metrics
  const bookingsCount = await prisma.booking.count({
    where: { userId: user.id }
  }).catch(() => 0)

  const ordersCount = await prisma.order.count({
    where: { userId: user.id }
  }).catch(() => 0)

  const wishlistCount = await prisma.wishlist.count({
    where: { userId: user.id }
  }).catch(() => 0)

  const notificationsCount = await prisma.notification.count({
    where: { userId: user.id, isRead: false }
  }).catch(() => 0)

  // Fetch recent activities
  const recentBookings = await prisma.booking.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: 'desc' },
    take: 3,
    include: {
      puja: { select: { name: true } },
      temple: { select: { name: true } }
    }
  }).catch(() => [])

  const recentOrders = await prisma.order.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: 'desc' },
    take: 3,
  }).catch(() => [])

  const stats = [
    { title: 'My Bookings', value: bookingsCount.toString(), icon: Calendar, color: 'text-primary', link: '/dashboard/bookings' },
    { title: 'My Orders', value: ordersCount.toString(), icon: ShoppingBag, color: 'text-amber-500', link: '/dashboard/orders' },
    { title: 'Wishlist Items', value: wishlistCount.toString(), icon: Heart, color: 'text-pink-500', link: '/dashboard/wishlist' },
    { title: 'Unread Alerts', value: notificationsCount.toString(), icon: Bell, color: 'text-rose-500', link: '/dashboard/notifications' },
  ]

  return (
    <div className="space-y-6">
      {/* Welcome Message */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-gradient-to-r from-primary/10 via-background to-accent/10 p-6 rounded-2xl border border-primary/10">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            नमस्ते, {user.fullName?.split(' ')[0] || 'Devotee'} 🙏
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Welcome to your spiritual customer portal. Access your scheduled pujas, track offerings, and manage orders.
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/pujas">
            <button className="px-4 py-2 text-xs font-semibold rounded-lg bg-primary text-white hover:bg-primary/95 transition-all shadow-sm">
              Book a Puja
            </button>
          </Link>
          <Link href="/store">
            <button className="px-4 py-2 text-xs font-semibold rounded-lg bg-background border border-border text-foreground hover:bg-muted/35 transition-all">
              Browse Store
            </button>
          </Link>
        </div>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => {
          const Icon = s.icon
          return (
            <Link key={s.title} href={s.link} className="block transition-transform hover:-translate-y-0.5">
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader className="pb-2 flex-row items-center justify-between space-y-0">
                  <CardTitle className="text-sm font-medium text-muted-foreground">{s.title}</CardTitle>
                  <Icon className={`h-4 w-4 ${s.color}`} />
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-extrabold tracking-tight">{s.value}</p>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>

      {/* Main Grid: Bookings and Orders lists */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Bookings Card */}
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2 border-b mb-4">
            <div>
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <Flame className="h-5 w-5 text-orange-500 animate-pulse" />
                Recent Pujas
              </CardTitle>
              <CardDescription className="text-xs">Your upcoming or completed puja sessions</CardDescription>
            </div>
            <Link href="/dashboard/bookings" className="text-xs font-semibold text-primary flex items-center gap-1 hover:underline">
              View All <ArrowRight className="h-3 w-3" />
            </Link>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentBookings.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-sm text-muted-foreground mb-4">No pujas booked yet.</p>
                <Link href="/pujas">
                  <span className="text-xs font-semibold text-primary hover:underline">Browse active pujas →</span>
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-border">
                {recentBookings.map((b) => (
                  <div key={b.id} className="py-3 first:pt-0 last:pb-0 flex items-start justify-between gap-2">
                    <div className="space-y-1">
                      <p className="font-bold text-sm text-foreground">{b.puja?.name}</p>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground font-mono">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" /> {b.temple?.name || 'Virtual / Online'}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" /> {new Date(b.createdAt).toLocaleDateString('en-IN')}
                        </span>
                      </div>
                    </div>
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                      b.status === 'CONFIRMED' ? 'bg-emerald-100 text-emerald-800' :
                      b.status === 'PENDING' ? 'bg-amber-100 text-amber-800' : 'bg-muted text-muted-foreground'
                    }`}>
                      {b.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Orders Card */}
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2 border-b mb-4">
            <div>
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <ShoppingBag className="h-5 w-5 text-blue-500" />
                Store Orders
              </CardTitle>
              <CardDescription className="text-xs">Prasad and spiritual item deliveries</CardDescription>
            </div>
            <Link href="/dashboard/orders" className="text-xs font-semibold text-primary flex items-center gap-1 hover:underline">
              View All <ArrowRight className="h-3 w-3" />
            </Link>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentOrders.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-sm text-muted-foreground mb-4">No product orders found.</p>
                <Link href="/store">
                  <span className="text-xs font-semibold text-primary hover:underline">Visit spiritual store →</span>
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-border">
                {recentOrders.map((o) => (
                  <div key={o.id} className="py-3 first:pt-0 last:pb-0 flex items-start justify-between gap-2">
                    <div className="space-y-1">
                      <p className="font-bold text-sm text-foreground font-mono">{o.orderNumber}</p>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground font-mono">
                        <span>Total: ₹{parseFloat(o.total.toString()).toLocaleString('en-IN')}</span>
                        <span>•</span>
                        <span>{new Date(o.createdAt).toLocaleDateString('en-IN')}</span>
                      </div>
                    </div>
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                      o.status === 'DELIVERED' ? 'bg-emerald-100 text-emerald-800' :
                      o.status === 'PROCESSING' ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {o.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
