import { PageHeader } from '@/components/admin/page-header'
import { KpiCard } from '@/components/admin/kpi-card'
import { AdminTabs } from '@/components/admin/admin-tabs'
import { DataTableShell } from '@/components/admin/data-table-shell'
import { Sparkles } from 'lucide-react'

export default function ChadhawaPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Chadhawa Seva" description="Manage all chadhawa (offering) requests."
        breadcrumbs={[{ label: 'Admin', href: '/admin' }, { label: 'Chadhawa' }]} />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard title="Total Requests" value="0" icon={Sparkles} />
        <KpiCard title="Flowers" value="0" />
        <KpiCard title="Prasad" value="0" />
        <KpiCard title="Deep Daan" value="0" />
      </div>
      <AdminTabs tabs={[
        { label: 'All' }, { label: 'Flowers', value: 'flowers' }, { label: 'Prasad', value: 'prasad' },
        { label: 'Bhog', value: 'bhog' }, { label: 'Deep Daan', value: 'deep-daan' },
        { label: 'Gau Seva', value: 'gau-seva' }, { label: 'Temple Seva', value: 'temple-seva' },
      ]} />
      <DataTableShell
        columns={[
          { key: 'id', label: 'ID' }, { key: 'user', label: 'Devotee' },
          { key: 'item', label: 'Item' }, { key: 'temple', label: 'Temple' },
          { key: 'amount', label: 'Amount' }, { key: 'status', label: 'Status' },
        ]}
        rows={[]}
      />
    </div>
  )
}
