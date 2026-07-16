'use client';  // <- यह line सबसे ऊपर add करें

import { PageHeader } from '@/components/admin/page-header'
import { KpiCard } from '@/components/admin/kpi-card'
import { AdminTabs } from '@/components/admin/admin-tabs'
import { DataTableShell } from '@/components/admin/data-table-shell'
import { Badge } from '@/components/ui/badge'
import { Image, Calendar, Eye, Edit, Trash2 } from 'lucide-react'

export default function HeroPage() {
  const columns = [
    { key: 'title', label: 'Title' },
    { key: 'subtitle', label: 'Subtitle' },
    { key: 'image', label: 'Image', render: (r) => <Badge variant="outline">{r.image}</Badge> },
    { key: 'status', label: 'Status', render: (r) => <Badge variant={r.status === 'active' ? 'default' : 'secondary'}>{r.status}</Badge> },
    { key: 'order', label: 'Order' },
    { key: 'actions', label: 'Actions', render: () => <div className="flex gap-2"><Eye className="h-4 w-4" /><Edit className="h-4 w-4" /><Trash2 className="h-4 w-4" /></div> },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title="Hero Slider"
        description="Manage homepage hero slides."
        breadcrumbs={[{ label: 'Admin', href: '/admin' }, { label: 'CMS' }, { label: 'Hero' }]}
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard title="Total Slides" value="0" icon={Image} />
        <KpiCard title="Active" value="0" icon={Eye} />
        <KpiCard title="Inactive" value="0" icon={Eye} />
        <KpiCard title="Last Updated" value="Today" icon={Calendar} />
      </div>
      <AdminTabs tabs={[
        { label: 'All' },
        { label: 'Active', value: 'active' },
        { label: 'Inactive', value: 'inactive' },
      ]} />
      <DataTableShell
        columns={columns}
        rows={[]}
      />
    </div>
  )
}
