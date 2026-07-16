import { PageHeader } from '@/components/admin/page-header'
import { DataTableShell } from '@/components/admin/data-table-shell'

export default function BlogCategoriesPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Blog Categories"
        breadcrumbs={[{ label: 'Blog', href: '/admin/blog' }, { label: 'Categories' }]}
        action={{ label: 'Add Category' }} />
      <DataTableShell
        columns={[{ key: 'name', label: 'Name' }, { key: 'slug', label: 'Slug' }, { key: 'posts', label: 'Posts' }]}
        rows={[{ name: 'Spirituality', slug: 'spirituality', posts: 1 }]}
      />
    </div>
  )
}
