import { PageHeader } from '@/components/admin/page-header'
import { AdminTabs } from '@/components/admin/admin-tabs'
import { KpiCard } from '@/components/admin/kpi-card'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FileText, TrendingUp, ShoppingBag, HandCoins, Users, Receipt, Download } from 'lucide-react'

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Reports" description="Business intelligence across all modules."
        breadcrumbs={[{ label: 'Admin', href: '/admin' }, { label: 'Reports' }]}
        action={{ label: 'Export All', icon: Download }} />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <KpiCard title="Total Revenue" value="₹0" icon={TrendingUp} iconClass="text-green-600" />
        <KpiCard title="Tax Collected" value="₹0" icon={Receipt} />
        <KpiCard title="Refunds Issued" value="₹0" icon={FileText} iconClass="text-red-500" />
      </div>
      <AdminTabs tabs={[
        { label: 'Overview' }, { label: 'Revenue', value: 'revenue' },
        { label: 'Bookings', value: 'bookings' }, { label: 'Products', value: 'products' },
        { label: 'Donations', value: 'donations' }, { label: 'Customers', value: 'customers' },
        { label: 'Tax / GST', value: 'tax' },
      ]} />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[
          { title: 'Revenue Report', icon: TrendingUp },
          { title: 'Booking Report', icon: FileText },
          { title: 'Product Sales', icon: ShoppingBag },
          { title: 'Donation Report', icon: HandCoins },
          { title: 'Customer Insights', icon: Users },
          { title: 'GST / Tax Report', icon: Receipt },
        ].map((r) => {
          const Icon = r.icon
          return (
            <Card key={r.title}>
              <CardHeader><CardTitle className="text-base flex items-center gap-2"><Icon className="h-4 w-4 text-primary" />{r.title}</CardTitle></CardHeader>
              <CardContent className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground">Export Excel / PDF / CSV</p>
                <Button size="sm" variant="outline"><Download className="h-3 w-3 mr-1" /> Export</Button>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
