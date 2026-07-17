import { PageHeader } from '@/components/admin/page-header'
import { KpiCard } from '@/components/admin/kpi-card'
import { AdminTabs } from '@/components/admin/admin-tabs'
import { DataTableShell } from '@/components/admin/data-table-shell'
import { Package, Clock, Truck, CheckCircle2, XCircle } from 'lucide-react'

export default function OrdersPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Orders"
        description="All customer orders across the store."
        breadcrumbs={[{ label: 'Admin', href: '/admin' }, { label: 'Orders' }]}
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <KpiCard title="Total" value="0" icon={Package} />
        <KpiCard title="Pending" value="0" icon={Clock} iconClass="text-orange-500" />
        <KpiCard title="Shipped" value="0" icon={Truck} iconClass="text-blue-500" />
        <KpiCard title="Delivered" value="0" icon={CheckCircle2} iconClass="text-green-600" />
        <KpiCard title="Returned" value="0" icon={XCircle} iconClass="text-red-500" />
      </div>
      <AdminTabs tabs={[
        { label: 'All' }, { label: 'Pending', value: 'pending' }, { label: 'Processing', value: 'processing' },
        { label: 'Shipped', value: 'shipped' }, { label: 'Delivered', value: 'delivered' },
        { label: 'Cancelled', value: 'cancelled' }, { label: 'Returned', value: 'returned' },
        { label: 'Refunds', value: 'refunds' },
      ]} />
      <DataTableShell
        columns={[
          { key: 'orderNumber', label: 'Order #' }, { key: 'customer', label: 'Customer' },
          { key: 'items', label: 'Items' }, { key: 'total', label: 'Total' },
          { key: 'status', label: 'Status' }, { key: 'date', label: 'Date' },
        ]}
        rows={[]}
      />
    </div>
  )
}
