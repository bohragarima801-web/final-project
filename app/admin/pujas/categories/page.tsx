import { PageHeader } from '@/components/admin/page-header'
import { DataTableShell } from '@/components/admin/data-table-shell'

export default function PujaCategoriesPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Puja Categories"
        description="Organize pujas into categories and sub-categories."
        breadcrumbs={[{ label: 'Pujas', href: '/admin/pujas' }, { label: 'Categories' }]}
        action={{ label: 'Add Category' }}
      />
      <DataTableShell
        columns={[
          { key: 'name', label: 'Name' },
          { key: 'slug', label: 'Slug' },
          { key: 'parent', label: 'Parent' },
          { key: 'pujas', label: 'Pujas' },
          { key: 'order', label: 'Order' },
        ]}
        rows={[
          { name: 'Shiva Pujas', slug: 'shiva-pujas', parent: '—', pujas: 0, order: 1 },
          { name: 'Devi Pujas', slug: 'devi-pujas', parent: '—', pujas: 0, order: 2 },
          { name: 'Vishnu Pujas', slug: 'vishnu-pujas', parent: '—', pujas: 0, order: 3 },
          { name: 'Ganesh Pujas', slug: 'ganesh-pujas', parent: '—', pujas: 0, order: 4 },
          { name: 'Navagraha Pujas', slug: 'navagraha-pujas', parent: '—', pujas: 0, order: 5 },
          { name: 'VIP Pujas', slug: 'vip-pujas', parent: '—', pujas: 0, order: 6 },
        ]}
      />
    </div>
  )
}
