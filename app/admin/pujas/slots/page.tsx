import { PageHeader } from '@/components/admin/page-header'
import { EmptyState } from '@/components/admin/empty-state'
import { CalendarClock } from 'lucide-react'

export default function PujaSlotsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Puja Time Slots"
        description="Manage capacity and availability for scheduled pujas."
        breadcrumbs={[{ label: 'Pujas', href: '/admin/pujas' }, { label: 'Slots' }]}
        action={{ label: 'Add Slot' }}
      />
      <EmptyState
        icon={CalendarClock}
        title="No slots configured yet"
        description="Create time slots per puja to enable devotees to book at specific times."
      />
    </div>
  )
}
