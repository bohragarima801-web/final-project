import { PageHeader } from '@/components/admin/page-header'
import { DataTableShell } from '@/components/admin/data-table-shell'

export default function UserActivityPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Login History & Activity"
        description="Audit trail of user logins and admin actions."
        breadcrumbs={[{ label: 'Users', href: '/admin/users' }, { label: 'Activity' }]}
      />
      <DataTableShell
        columns={[
          { key: 'user', label: 'User' },
          { key: 'action', label: 'Action' },
          { key: 'ip', label: 'IP' },
          { key: 'ua', label: 'Device' },
          { key: 'time', label: 'Time' },
        ]}
        rows={[]}
      />
    </div>
  )
}
