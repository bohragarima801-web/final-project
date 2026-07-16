import { PageHeader } from '@/components/admin/page-header'
import { KpiCard } from '@/components/admin/kpi-card'
import { DataTableShell } from '@/components/admin/data-table-shell'
import { HeartHandshake, Wallet, Star, TrendingUp } from 'lucide-react'

export default function CustomersPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Customers"
        description="View and manage all your devotees."
        breadcrumbs={[{ label: 'Admin', href: '/admin' }, { label: 'Customers' }]}
        action={{ label: 'Add Customer' }}
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard title="Total Customers" value="0" icon={HeartHandshake} />
        <KpiCard title="Repeat Customers" value="0" icon={TrendingUp} />
        <KpiCard title="Wallet Balance" value="₹0" icon={Wallet} />
        <KpiCard title="Top Rewarded" value="0" icon={Star} />
      </div>
      <DataTableShell
        columns={[
          { key: 'name', label: 'Name' }, { key: 'email', label: 'Email' },
          { key: 'phone', label: 'Phone' }, { key: 'bookings', label: 'Bookings' },
          { key: 'orders', label: 'Orders' }, { key: 'donations', label: 'Donations' },
          { key: 'wallet', label: 'Wallet' },
        ]}
        rows={[]}
      />
    </div>
  )
}
