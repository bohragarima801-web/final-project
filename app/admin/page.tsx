import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { KpiCard } from '@/components/admin/kpi-card'
import { PageHeader } from '@/components/admin/page-header'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import {
  Wallet, Calendar, Package, Users, Star, Flame, HandCoins, Sparkles,
  Activity, Eye, Clock, AlertTriangle, MessageSquare, TrendingUp,
  BarChart3, ArrowUpRight, ShoppingBag, CalendarClock, CheckCircle2,
  Plus, Zap,
} from 'lucide-react'

const quickActions = [
  { label: 'Add Puja', href: '/admin/pujas/new', icon: Flame },
  { label: 'Add Product', href: '/admin/products/new', icon: ShoppingBag },
  { label: 'Add Blog', href: '/admin/blog/new', icon: Plus },
  { label: 'Add Temple', href: '/admin/temples/new', icon: Plus },
  { label: 'Send Notification', href: '/admin/notifications', icon: Zap },
  { label: 'Create Coupon', href: '/admin/marketing/coupons', icon: Plus },
]

const recentActivities = [
  { icon: Calendar, text: 'New booking for Maha Rudrabhishek', user: 'Anjali S.', time: '2 min ago', color: 'text-primary' },
  { icon: HandCoins, text: '₹5,100 donated to Gaushala campaign', user: 'Rajesh K.', time: '18 min ago', color: 'text-green-600' },
  { icon: ShoppingBag, text: 'Order #DVJ-2412 placed', user: 'Priya N.', time: '32 min ago', color: 'text-accent' },
  { icon: MessageSquare, text: 'New support ticket #ST-108', user: 'Vikram M.', time: '1 hr ago', color: 'text-orange-500' },
  { icon: Users, text: '3 new customers registered', user: 'System', time: '2 hrs ago', color: 'text-blue-500' },
]

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="🗺 Sanatan Seva Control Center"
        description="Real-time overview of your platform."
        action={{ label: 'Export Report', icon: BarChart3, href: '/admin/reports' }}
        secondaryAction={{ label: 'Analytics', href: '/admin/analytics' }}
      />

      {/* Revenue row */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard title="Total Revenue" value="₹0" icon={Wallet} iconClass="text-green-600" change={0} changeLabel="vs last month" />
        <KpiCard title="Today's Revenue" value="₹0" icon={TrendingUp} iconClass="text-primary" change={0} changeLabel="vs yesterday" />
        <KpiCard title="Monthly Revenue" value="₹0" icon={BarChart3} iconClass="text-accent" change={0} />
        <KpiCard title="Pending Payments" value="₹0" icon={Clock} iconClass="text-orange-500" />
      </div>

      {/* Bookings + Pujas */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard title="Total Bookings" value="0" icon={Calendar} iconClass="text-primary" />
        <KpiCard title="Upcoming Pujas" value="0" icon={CalendarClock} iconClass="text-secondary" />
        <KpiCard title="Completed Pujas" value="0" icon={CheckCircle2} iconClass="text-green-600" />
        <KpiCard title="Live Pujas Now" value="0" icon={Flame} iconClass="text-red-500" />
      </div>

      {/* Products + Orders */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard title="Total Products" value="0" icon={ShoppingBag} iconClass="text-blue-500" />
        <KpiCard title="Total Orders" value="0" icon={Package} iconClass="text-accent" />
        <KpiCard title="Low Stock Items" value="0" icon={AlertTriangle} iconClass="text-red-500" />
        <KpiCard title="Pending Orders" value="0" icon={Clock} iconClass="text-orange-500" />
      </div>

      {/* People + Community */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard title="Total Customers" value="0" icon={Users} iconClass="text-blue-500" />
        <KpiCard title="Total Pandits" value="0" icon={Star} iconClass="text-yellow-500" />
        <KpiCard title="Active Users" value="0" icon={Activity} iconClass="text-green-600" />
        <KpiCard title="Live Visitors" value="0" icon={Eye} iconClass="text-primary" />
      </div>

      {/* Seva */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard title="Total Donations" value="₹0" icon={HandCoins} iconClass="text-purple-500" />
        <KpiCard title="Total Chadhawa" value="0" icon={Sparkles} iconClass="text-yellow-500" />
        <KpiCard title="Website Visitors (24h)" value="0" icon={Eye} iconClass="text-pink-500" />
        <KpiCard title="Pending Support Tickets" value="0" icon={MessageSquare} iconClass="text-orange-500" />
      </div>

      {/* Quick actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2"><Zap className="h-4 w-4 text-primary" /> Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
            {quickActions.map((a) => {
              const Icon = a.icon
              return (
                <Button key={a.href} variant="outline" asChild className="h-auto py-4 flex flex-col gap-2">
                  <Link href={a.href}>
                    <Icon className="h-5 w-5 text-primary" />
                    <span className="text-xs">{a.label}</span>
                  </Link>
                </Button>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Recent activity + Chart placeholder */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle className="text-base">Revenue Trend (Last 30 days)</CardTitle>
            <Badge variant="outline">Live</Badge>
          </CardHeader>
          <CardContent>
            <div className="h-56 rounded-md bg-gradient-to-b from-primary/10 to-transparent flex items-end justify-between p-4 gap-1">
              {Array.from({ length: 30 }).map((_, i) => (
                <div key={i} className="flex-1 bg-primary/30 hover:bg-primary transition-colors rounded-t" style={{ height: `${20 + Math.random() * 80}%` }} />
              ))}
            </div>
            <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-primary" /> Bookings</span>
              <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-secondary" /> Products</span>
              <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-accent" /> Donations</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle className="text-base">Recent Activity</CardTitle>
            <Link href="/admin/security?tab=activity" className="text-xs text-primary hover:underline flex items-center gap-1">
              View all <ArrowUpRight className="h-3 w-3" />
            </Link>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentActivities.map((a, i) => {
              const Icon = a.icon
              return (
                <div key={i} className="flex items-start gap-3">
                  <div className={`h-8 w-8 shrink-0 rounded-full bg-muted flex items-center justify-center ${a.color}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium truncate">{a.text}</p>
                    <p className="text-[11px] text-muted-foreground">{a.user} • {a.time}</p>
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>
      </div>

      {/* Traffic by module */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle className="text-base">Top Performing Pujas</CardTitle></CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Data will appear once bookings start.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-base">Top Donation Campaigns</CardTitle></CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Data will appear once donations start.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
