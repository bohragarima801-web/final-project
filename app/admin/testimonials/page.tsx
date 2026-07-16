"use client"

import { PageHeader } from '@/components/admin/page-header'
import { DataTableShell } from '@/components/admin/data-table-shell'
import { Badge } from '@/components/ui/badge'
import { Star } from 'lucide-react'

export default function TestimonialsPage() {
  const rows = [
    { name: 'Anjali Sharma', location: 'Mumbai', rating: 5, message: 'The puja was conducted with such devotion. Received prasad within a week!', status: 'Approved' },
    { name: 'Rajesh Kumar', location: 'Delhi', rating: 5, message: 'Live streaming quality was superb. Felt like being at the temple.', status: 'Approved' },
    { name: 'Priya Nair', location: 'Bangalore', rating: 5, message: 'Excellent service and authentic pandits.', status: 'Approved' },
  ]
  return (
    <div className="space-y-6">
      <PageHeader title="Testimonials" description="Customer reviews and video testimonials."
        breadcrumbs={[{ label: 'Admin', href: '/admin' }, { label: 'Testimonials' }]}
        action={{ label: 'Add Testimonial' }} />
      <DataTableShell
        columns={[
          { key: 'name', label: 'Name' }, { key: 'location', label: 'Location' },
          { key: 'rating', label: 'Rating', render: (r) => (
            <div className="flex gap-0.5">{Array.from({ length: r.rating }).map((_, i) => <Star key={i} className="h-3 w-3 fill-primary text-primary" />)}</div>
          ) },
          { key: 'message', label: 'Message', render: (r) => <span className="line-clamp-1 max-w-xs">{r.message}</span> },
          { key: 'status', label: 'Status', render: (r) => <Badge variant="secondary">{r.status}</Badge> },
        ]}
        rows={rows}
      />
    </div>
  )
}
