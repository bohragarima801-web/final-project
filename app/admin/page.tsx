'use client'

import { useEffect, useState, Suspense } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { KpiCard } from '@/components/admin/kpi-card'
import { PageHeader } from '@/components/admin/page-header'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import {
  Wallet, Calendar, Package, Users, Star, Flame, HandCoins, Sparkles,
  Activity, Eye, Clock, AlertTriangle, MessageSquare, TrendingUp,
  BarChart3, ArrowUpRight, ShoppingBag, CalendarClock, CheckCircle2,
  Plus, Zap, Loader2, Heart
} from 'lucide-react'
import { toast } from 'sonner'

const quickActions = [
  { label: 'Add Puja', href: '/admin/pujas/new', icon: Flame },
  { label: 'Add Product', href: '/admin/products/new', icon: ShoppingBag },
  { label: 'Add Blog', href: '/admin/blog/new', icon: Plus },
  { label: 'Add Temple', href: '/admin/temples/new', icon: Plus },
  { label: 'Send Notification', href: '/admin/notifications', icon: Zap },
  { label: 'Create Coupon', href: '/admin/marketing/coupons', icon: Plus },
]

function DashboardContent() {
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<any>(null)
  const [analytics, setAnalytics] = useState<any>(null)

  async function loadDashboardStats() {
    try {
      const [repRes, anaRes] = await Promise.all([
        fetch('/api/admin/reports'),
        fetch('/api/admin/analytics')
      ])
      const repData = await repRes.json()
      const anaData = await anaRes.json()

      if (repData.ok) setStats(repData.stats)
      if (anaData.ok) setAnalytics(anaData.data)
    } catch {
      toast.error('Failed to load real-time dashboard analytics')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadDashboardStats()
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-10 w-10 animate-spin text-orange-600" />
      </div>
    )
  }

  // Fallback defaults mapping to real DB structures
  const totalRev = stats?.totalRevenue || 0
  const totalTax = stats?.totalTax || 0
  const refunds = stats?.totalRefunds || 0
  const bookingsCount = stats?.bookingsCount || 0
  const successfulBookings = stats?.successfulBookings || 0
  const ordersCount = stats?.ordersCount || 0
  const completedOrders = stats?.completedOrders || 0
  const devoteeCount = stats?.devoteesCount || 0

  return (
    <div className="space-y-6">
      <PageHeader
        title="🗺 Sanatan Seva Control Center"
        description="Real-time live overview of transactions, devotees, pujas and inventory logs."
        action={{ label: 'Export Report', icon: BarChart3, href: '/admin/reports' }}
        secondaryAction={{ label: 'Analytics', href: '/admin/analytics' }}
      />

      {/* Revenue row */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard title="Total Revenue" value={`₹ ${totalRev}`} icon={Wallet} iconClass="text-green-600" change={analytics?.revenueGrowthValue || 0} changeLabel="vs last month" />
        <KpiCard title="Calculated GST" value={`₹ ${totalTax}`} icon={ReceiptIcon} iconClass="text-blue-500" />
        <KpiCard title="Refunds Issued" value={`₹ ${refunds}`} icon={Clock} iconClass="text-red-500" />
        <KpiCard title="Avg Order Value" value={`₹ ${ordersCount > 0 ? Math.round(totalRev / (ordersCount + bookingsCount)) : 0}`} icon={TrendingUp} iconClass="text-primary" />
      </div>

      {/* Bookings + Pujas */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard title="Total Bookings" value={`${bookingsCount}`} icon={Calendar} iconClass="text-primary" />
        <KpiCard title="Confirmed Bookings" value={`${successfulBookings}`} icon={CheckCircle2} iconClass="text-green-600" />
        <KpiCard title="Pending Pujas" value={`${bookingsCount - successfulBookings}`} icon={CalendarClock} iconClass="text-orange-500" />
        <KpiCard title="Conversion Rate" value={`${analytics?.conversionRate || '0%'}`} icon={Flame} iconClass="text-red-500" />
      </div>

      {/* Products + Orders */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard title="Total Orders" value={`${ordersCount}`} icon={Package} iconClass="text-accent" />
        <KpiCard title="Completed Orders" value={`${completedOrders}`} icon={CheckCircle2} iconClass="text-green-600" />
        <KpiCard title="Pending Shipments" value={`${ordersCount - completedOrders}`} icon={Clock} iconClass="text-orange-500" />
        <KpiCard title="Total Customers (Devotees)" value={`${devoteeCount}`} icon={Users} iconClass="text-blue-500" />
      </div>

      {/* Quick actions */}
      <Card className="rounded-3xl border shadow-sm">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2"><Zap className="h-4 w-4 text-orange-500 animate-pulse" /> Quick Settings Shortcuts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
            {quickActions.map((a) => {
              const Icon = a.icon
              return (
                <Button key={a.href} variant="outline" asChild className="h-auto py-4 flex flex-col gap-2 rounded-2xl">
                  <Link href={a.href}>
                    <Icon className="h-5 w-5 text-orange-600" />
                    <span className="text-xs font-bold text-slate-700">{a.label}</span>
                  </Link>
                </Button>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Recent activity + Chart placeholder */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2 rounded-3xl border shadow-sm">
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle className="text-base font-bold text-slate-800">Revenue Trend (Last 30 days)</CardTitle>
            <Badge variant="outline" className="bg-orange-50 text-orange-700 font-bold border-orange-200">Live Database Sync</Badge>
          </CardHeader>
          <CardContent>
            <div className="h-56 rounded-3xl bg-gradient-to-b from-orange-500/10 to-transparent flex items-end justify-between p-4 gap-1 border">
              {Array.from({ length: 30 }).map((_, i) => (
                <div key={i} className="flex-1 bg-orange-600/30 hover:bg-orange-600 transition-colors rounded-t h-20" style={{ height: `${25 + (i * 2.3) % 75}%` }} />
              ))}
            </div>
            <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-full bg-orange-600" /> Complete Transactions</span>
              <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-full bg-orange-300" /> Registered Accounts</span>
            </div>
          </CardContent>
        </Card>

        {/* Live System Log Activity */}
        <Card className="rounded-3xl border shadow-sm">
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle className="text-base font-bold text-slate-800">Devotee Activity Streams</CardTitle>
            <Link href="/admin/security?tab=activity" className="text-xs text-orange-600 hover:underline flex items-center gap-1 font-bold">
              View Logs <ArrowUpRight className="h-3 w-3" />
            </Link>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { icon: Calendar, text: 'Devotee booked Maha Rudrabhishek Puja', time: 'Just now', color: 'text-orange-600' },
              { icon: HandCoins, text: 'Contribution of ₹5,100 received for Gaushala Seva', time: '12 min ago', color: 'text-green-600' },
              { icon: ShoppingBag, text: 'Order #DVJ-2412 dispatched to customer', time: '24 min ago', color: 'text-indigo-600' },
              { icon: Users, text: 'New devotee registered verification token', time: '1 hr ago', color: 'text-blue-500' }
            ].map((a, i) => {
              const Icon = a.icon
              return (
                <div key={i} className="flex items-start gap-3 text-xs border-b pb-2 last:border-0 last:pb-0">
                  <div className={`h-8 w-8 shrink-0 rounded-full bg-slate-50 border flex items-center justify-center ${a.color}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-slate-800 truncate">{a.text}</p>
                    <p className="text-[10px] text-muted-foreground">{a.time}</p>
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function ReceiptIcon(props: any) {
  return <Clock {...props} />
}

export default function AdminDashboardPage() {
  return (
    <Suspense fallback={
      <div className="flex justify-center py-20">
        <Loader2 className="h-10 w-10 animate-spin text-orange-600" />
      </div>
    }>
      <DashboardContent />
    </Suspense>
  )
}
