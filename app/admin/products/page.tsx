import { PageHeader } from '@/components/admin/page-header'
import { KpiCard } from '@/components/admin/kpi-card'
import { AdminTabs } from '@/components/admin/admin-tabs'
import { DataTableShell } from '@/components/admin/data-table-shell'
import { ShoppingBag, Package, AlertTriangle, Star } from 'lucide-react'

export default function ProductsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Products"
        description="Prasad, rudraksha, idols, puja samagri & spiritual books."
        breadcrumbs={[{ label: 'Admin', href: '/admin' }, { label: 'Products' }]}
        action={{ label: 'Add Product', href: '/admin/products/new' }}
        secondaryAction={{ label: 'Categories', href: '/admin/products/categories' }}
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard title="Total Products" value="0" icon={ShoppingBag} />
        <KpiCard title="Active" value="0" icon={Package} iconClass="text-green-600" />
        <KpiCard title="Low Stock" value="0" icon={AlertTriangle} iconClass="text-red-500" />
        <KpiCard title="Reviews" value="0" icon={Star} />
      </div>
      <AdminTabs tabs={[
        { label: 'All' }, { label: 'Active', value: 'active' }, { label: 'Draft', value: 'draft' },
        { label: 'Out of Stock', value: 'oos' }, { label: 'Abhimantrit', value: 'abhimantrit' },
        { label: 'Reviews', value: 'reviews' },
      ]} />
      <DataTableShell
        columns={[
          { key: 'name', label: 'Product' }, { key: 'category', label: 'Category' },
          { key: 'price', label: 'Price' }, { key: 'stock', label: 'Stock' },
          { key: 'status', label: 'Status' },
        ]}
        rows={[]}
      />
    </div>
  )
}
