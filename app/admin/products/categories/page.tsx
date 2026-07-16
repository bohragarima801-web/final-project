import { PageHeader } from '@/components/admin/page-header'
import { DataTableShell } from '@/components/admin/data-table-shell'

export default function ProductCategoriesPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Product Categories" description="Organize your product catalog."
        breadcrumbs={[{ label: 'Products', href: '/admin/products' }, { label: 'Categories' }]}
        action={{ label: 'Add Category' }} />
      <DataTableShell
        columns={[{ key: 'name', label: 'Name' }, { key: 'slug', label: 'Slug' }, { key: 'products', label: 'Products' }]}
        rows={[
          { name: 'Prasad', slug: 'prasad', products: 0 },
          { name: 'Rudraksha', slug: 'rudraksha', products: 0 },
          { name: 'Idols & Murtis', slug: 'idols-murtis', products: 0 },
          { name: 'Puja Samagri', slug: 'puja-samagri', products: 0 },
          { name: 'Books', slug: 'books', products: 0 },
        ]}
      />
    </div>
  )
}
