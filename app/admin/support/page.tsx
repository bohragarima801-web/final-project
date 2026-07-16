import { PageHeader } from '@/components/admin/page-header'
import { KpiCard } from '@/components/admin/kpi-card'
import { AdminTabs } from '@/components/admin/admin-tabs'
import { DataTableShell } from '@/components/admin/data-table-shell'
import { MessageSquare, Clock, CheckCircle2, AlertTriangle } from 'lucide-react'

export default function SupportPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Support" description="Tickets, WhatsApp, Email & Live chat."
        breadcrumbs={[{ label: 'Admin', href: '/admin' }, { label: 'Support' }]} />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard title="Total Tickets" value="0" icon={MessageSquare} />
        <KpiCard title="Open" value="0" icon={AlertTriangle} iconClass="text-orange-500" />
        <KpiCard title="In Progress" value="0" icon={Clock} iconClass="text-blue-500" />
        <KpiCard title="Resolved" value="0" icon={CheckCircle2} iconClass="text-green-600" />
      </div>
      <AdminTabs tabs={[
        { label: 'Tickets' }, { label: 'WhatsApp', value: 'whatsapp' },
        { label: 'Email', value: 'email' }, { label: 'Live Chat', value: 'live-chat' },
        { label: 'FAQ Manager', value: 'faq' },
      ]} />
      <DataTableShell
        columns={[
          { key: 'ticketNumber', label: '#' }, { key: 'customer', label: 'Customer' },
          { key: 'subject', label: 'Subject' }, { key: 'priority', label: 'Priority' },
          { key: 'status', label: 'Status' }, { key: 'createdAt', label: 'Created' },
        ]}
        rows={[]}
      />
    </div>
  )
}
