import { PageHeader } from '@/components/admin/page-header'
import { KpiCard } from '@/components/admin/kpi-card'
import { AdminTabs } from '@/components/admin/admin-tabs'
import { DataTableShell } from '@/components/admin/data-table-shell'
import { HandCoins, Users, Target, Wallet } from 'lucide-react'

export default function DonationsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Donations"
        description="Track all donation categories and campaigns."
        breadcrumbs={[{ label: 'Admin', href: '/admin' }, { label: 'Donations' }]}
        action={{ label: 'New Campaign', href: '/admin/donations/campaigns' }}
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard title="Total Raised" value="₹0" icon={HandCoins} iconClass="text-green-600" />
        <KpiCard title="Active Campaigns" value="1" icon={Target} />
        <KpiCard title="Total Donors" value="0" icon={Users} />
        <KpiCard title="This Month" value="₹0" icon={Wallet} />
      </div>
      <AdminTabs tabs={[
        { label: 'All' }, { label: 'Temple', value: 'temple' }, { label: 'Gaushala', value: 'gaushala' },
        { label: 'Annadan', value: 'annadan' }, { label: 'Gurukul', value: 'gurukul' },
        { label: 'Donors', value: 'donors' }, { label: 'Reports', value: 'reports' },
      ]} />
      <DataTableShell
        columns={[
          { key: 'id', label: 'ID' }, { key: 'donor', label: 'Donor' },
          { key: 'campaign', label: 'Campaign' }, { key: 'amount', label: 'Amount' },
          { key: 'status', label: 'Status' }, { key: 'date', label: 'Date' },
        ]}
        rows={[]}
      />
    </div>
  )
}
