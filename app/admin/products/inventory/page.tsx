import { PageHeader } from '@/components/admin/page-header'
import { KpiCard } from '@/components/admin/kpi-card'
import { DataTableShell } from '@/components/admin/data-table-shell'
import { Package, AlertTriangle, TrendingDown } from 'lucide-react'

export default function InventoryPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Inventory" description="Track stock levels across products."
        breadcrumbs={[{ label: 'Products', href: '/admin/products' }, { label: 'Inventory' }]} />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <KpiCard title="Total SKUs" value="0" icon={Package} />
        <KpiCard title="Low Stock (<10)" value="0" icon={TrendingDown} iconClass="text-orange-500" />
        <KpiCard title="Out of Stock" value="0" icon={AlertTriangle} iconClass="text-red-500" />
      </div>
      <DataTableShell
        columns={[
          { key: 'sku', label: 'SKU' }, { key: 'product', label: 'Product' },
          { key: 'quantity', label: 'Qty' }, { key: 'reserved', label: 'Reserved' },
          { key: 'warehouse', label: 'Warehouse' },
        ]}
        rows={[]}
      />
    </div>
  )
}
