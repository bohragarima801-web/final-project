import { PageHeader } from '@/components/admin/page-header'
import { AdminTabs } from '@/components/admin/admin-tabs'
import { DataTableShell } from '@/components/admin/data-table-shell'

export default function EventsPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Events" description="Live aarti, festivals & special events."
        breadcrumbs={[{ label: 'Admin', href: '/admin' }, { label: 'Events' }]}
        action={{ label: 'Add Event' }} />
      <AdminTabs tabs={[
        { label: 'All' }, { label: 'Upcoming', value: 'upcoming' },
        { label: 'Live', value: 'live' }, { label: 'Past', value: 'past' },
      ]} />
      <DataTableShell
        columns={[
          { key: 'title', label: 'Event' }, { key: 'location', label: 'Location' },
          { key: 'startsAt', label: 'Starts' }, { key: 'endsAt', label: 'Ends' },
          { key: 'isLive', label: 'Live' }, { key: 'registrations', label: 'Registrations' },
        ]}
        rows={[]}
      />
    </div>
  )
}
