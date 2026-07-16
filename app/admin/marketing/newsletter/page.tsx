import { PageHeader } from '@/components/admin/page-header'
import { DataTableShell } from '@/components/admin/data-table-shell'

export default function NewsletterPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Newsletter" description="Subscribers & campaigns."
        breadcrumbs={[{ label: 'Marketing', href: '/admin/marketing' }, { label: 'Newsletter' }]}
        action={{ label: 'Send Campaign' }} />
      <DataTableShell
        columns={[
          { key: 'email', label: 'Email' }, { key: 'isActive', label: 'Status' },
          { key: 'subscribedAt', label: 'Subscribed' },
        ]}
        rows={[]}
      />
    </div>
  )
}
