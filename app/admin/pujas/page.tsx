import { PageHeader } from '@/components/admin/page-header'
import { KpiCard } from '@/components/admin/kpi-card'
import { AdminTabs } from '@/components/admin/admin-tabs'
import { DataTableShell } from '@/components/admin/data-table-shell'
import { Flame, Star, CalendarClock, Video } from 'lucide-react'

export default function PujasPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Puja Management"
        description="Manage all pujas, categories, slots, media & pricing."
        breadcrumbs={[{ label: 'Admin', href: '/admin' }, { label: 'Pujas' }]}
        action={{ label: 'Add Puja', href: '/admin/pujas/new' }}
        secondaryAction={{ label: 'Manage Categories', href: '/admin/pujas/categories' }}
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard title="Total Pujas" value="0" icon={Flame} />
        <KpiCard title="VIP Pujas" value="0" icon={Star} />
        <KpiCard title="Upcoming" value="0" icon={CalendarClock} />
        <KpiCard title="Live Now" value="0" icon={Video} iconClass="text-red-500" />
      </div>
      <AdminTabs tabs={[
        { label: 'All' }, { label: 'Featured', value: 'featured' }, { label: 'VIP', value: 'vip' },
        { label: 'Upcoming', value: 'upcoming' }, { label: 'Live', value: 'live' },
        { label: 'Media', value: 'media' }, { label: 'Drafts', value: 'draft' },
      ]} />
      <DataTableShell
        columns={[
          { key: 'name', label: 'Puja' },
          { key: 'category', label: 'Category' },
          { key: 'temple', label: 'Temple' },
          { key: 'price', label: 'Price' },
          { key: 'vipPrice', label: 'VIP' },
          { key: 'status', label: 'Status' },
        ]}
        rows={[]}
      />
    </div>
  )
}
