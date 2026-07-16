"use client"

import { PageHeader } from '@/components/admin/page-header'
import { DataTableShell } from '@/components/admin/data-table-shell'
import { Badge } from '@/components/ui/badge'

export default function HeroSliderPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Hero Slider" description="Landing page rotating banners."
        breadcrumbs={[{ label: 'CMS', href: '/admin/cms' }, { label: 'Hero Slider' }]}
        action={{ label: 'Add Slide' }} />
      <DataTableShell
        columns={[
          { key: 'title', label: 'Title' }, { key: 'subtitle', label: 'Subtitle' },
          { key: 'ctaText', label: 'CTA' }, { key: 'order', label: 'Order' },
          { key: 'isActive', label: 'Status', render: (r) => <Badge variant={r.isActive ? 'default' : 'secondary'}>{r.isActive ? 'Active' : 'Draft'}</Badge> },
        ]}
        rows={[
          { title: 'Book Sacred Pujas Online', subtitle: 'Live streamed from India’s temples', ctaText: 'Explore', order: 1, isActive: true },
          { title: 'Offer Chadhawa from Home', subtitle: 'Flowers, prasad & deep daan', ctaText: 'Offer Now', order: 2, isActive: true },
        ]}
      />
    </div>
  )
}
