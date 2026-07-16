import { PageHeader } from '@/components/admin/page-header'
import { KpiCard } from '@/components/admin/kpi-card'
import { DataTableShell } from '@/components/admin/data-table-shell'
import { Building2, MapPin, Star, ImageIcon } from 'lucide-react'

export default function TemplesPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Temple Management"
        description="Manage temples, categories, timings, galleries and events."
        breadcrumbs={[{ label: 'Admin', href: '/admin' }, { label: 'Temples' }]}
        action={{ label: 'Add Temple', href: '/admin/temples/new' }}
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard title="Total Temples" value="0" icon={Building2} />
        <KpiCard title="Featured" value="0" icon={Star} />
        <KpiCard title="Locations" value="0" icon={MapPin} />
        <KpiCard title="Media Uploaded" value="0" icon={ImageIcon} />
      </div>
      <DataTableShell
        columns={[
          { key: 'name', label: 'Temple Name' },
          { key: 'deity', label: 'Deity' },
          { key: 'city', label: 'City' },
          { key: 'state', label: 'State' },
          { key: 'featured', label: 'Featured' },
          { key: 'status', label: 'Status' },
        ]}
        rows={[]}
        searchPlaceholder="Search temples…"
      />
    </div>
  )
}
