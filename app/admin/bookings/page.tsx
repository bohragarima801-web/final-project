"use client"

import { PageHeader } from '@/components/admin/page-header'
import { KpiCard } from '@/components/admin/kpi-card'
import { AdminTabs } from '@/components/admin/admin-tabs'
import { DataTableShell } from '@/components/admin/data-table-shell'
import { Badge } from '@/components/ui/badge'
import { Ticket, Clock, CheckCircle2, XCircle, RotateCw } from 'lucide-react'

export default function BookingsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Bookings"
        description="All puja bookings across your platform."
        breadcrumbs={[{ label: 'Admin', href: '/admin' }, { label: 'Bookings' }]}
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <KpiCard title="Total" value="0" icon={Ticket} />
        <KpiCard title="Pending" value="0" icon={Clock} iconClass="text-orange-500" />
        <KpiCard title="Confirmed" value="0" icon={CheckCircle2} iconClass="text-blue-500" />
        <KpiCard title="Completed" value="0" icon={CheckCircle2} iconClass="text-green-600" />
        <KpiCard title="Cancelled" value="0" icon={XCircle} iconClass="text-red-500" />
      </div>
      <AdminTabs tabs={[
        { label: 'All' }, { label: 'Pending', value: 'pending' }, { label: 'Confirmed', value: 'confirmed' },
        { label: 'Completed', value: 'completed' }, { label: 'Cancelled', value: 'cancelled' },
        { label: 'Refunds', value: 'refunds' }, { label: 'Reschedule', value: 'reschedule' },
      ]} />
      <DataTableShell
        columns={[
          { key: 'bookingNumber', label: 'Booking #' },
          { key: 'customer', label: 'Customer' },
          { key: 'puja', label: 'Puja' },
          { key: 'date', label: 'Scheduled' },
          { key: 'total', label: 'Amount' },
          { key: 'status', label: 'Status', render: (r) => <Badge>{r.status}</Badge> },
        ]}
        rows={[]}
      />
    </div>
  )
}
