import { PageHeader } from '@/components/admin/page-header'
import { KpiCard } from '@/components/admin/kpi-card'
import { AdminTabs } from '@/components/admin/admin-tabs'
import { DataTableShell } from '@/components/admin/data-table-shell'
import { Newspaper, FileText, MessageSquare, Eye } from 'lucide-react'

export default function BlogPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Blog" description="Manage articles, drafts, categories and comments."
        breadcrumbs={[{ label: 'Admin', href: '/admin' }, { label: 'Blog' }]}
        action={{ label: 'New Post', href: '/admin/blog/new' }}
        secondaryAction={{ label: 'Categories', href: '/admin/blog/categories' }} />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard title="Total Posts" value="1" icon={Newspaper} />
        <KpiCard title="Published" value="1" icon={FileText} iconClass="text-green-600" />
        <KpiCard title="Views (30d)" value="0" icon={Eye} />
        <KpiCard title="Comments" value="0" icon={MessageSquare} />
      </div>
      <AdminTabs tabs={[
        { label: 'All' }, { label: 'Published', value: 'published' },
        { label: 'Drafts', value: 'drafts' }, { label: 'Archived', value: 'archived' },
      ]} />
      <DataTableShell
        columns={[
          { key: 'title', label: 'Title' }, { key: 'author', label: 'Author' },
          { key: 'category', label: 'Category' }, { key: 'status', label: 'Status' },
          { key: 'views', label: 'Views' }, { key: 'publishedAt', label: 'Published' },
        ]}
        rows={[{ title: 'Welcome to Devyajnam', author: 'Admin', category: 'Spirituality', status: 'Published', views: 0, publishedAt: 'Today' }]}
      />
    </div>
  )
}
