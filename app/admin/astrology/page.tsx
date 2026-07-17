import { PageHeader } from '@/components/admin/page-header'
import { KpiCard } from '@/components/admin/kpi-card'
import { AdminTabs } from '@/components/admin/admin-tabs'
import { DataTableShell } from '@/components/admin/data-table-shell'
import { Sparkle, FileText, Users } from 'lucide-react'

export default function AstrologyPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Astrology Services" description="Kundali, Milan, Numerology & Ratna suggestions."
        breadcrumbs={[{ label: 'Admin', href: '/admin' }, { label: 'Astrology' }]} />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <KpiCard title="Total Orders" value="0" icon={FileText} />
        <KpiCard title="Reports Generated" value="0" icon={Sparkle} />
        <KpiCard title="Astrologers" value="0" icon={Users} />
      </div>
      <AdminTabs tabs={[
        { label: 'All' }, { label: 'Kundali', value: 'kundali' }, { label: 'Milan', value: 'milan' },
        { label: 'Numerology', value: 'numerology' }, { label: 'Ratna', value: 'ratna' },
        { label: 'Astrologers', value: 'astrologers' },
      ]} />
      <DataTableShell
        columns={[
          { key: 'id', label: 'ID' }, { key: 'user', label: 'Customer' },
          { key: 'type', label: 'Type' }, { key: 'status', label: 'Status' },
          { key: 'date', label: 'Date' },
        ]}
        rows={[]}
      />
    </div>
  )
}
