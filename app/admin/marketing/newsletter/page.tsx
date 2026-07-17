'use client'

import { useEffect, useState } from 'react'
import { PageHeader } from '@/components/admin/page-header'
import { DataTableShell } from '@/components/admin/data-table-shell'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'

export default function NewsletterPage() {
  const [subs, setSubs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadSubs() {
      try {
        const res = await fetch('/api/newsletter')
        const data = await res.json()
        if (data.ok) {
          setSubs(data.data || [])
        } else {
          toast.error(data.error || 'Failed to load newsletter subscribers')
        }
      } catch {
        toast.error('Network error loading subscribers')
      } finally {
        setLoading(false)
      }
    }
    loadSubs()
  }, [])

  return (
    <div className="space-y-6">
      <PageHeader
        title="Newsletter Subscribers"
        description="View and manage users subscribed to updates and newsletter announcements."
        breadcrumbs={[{ label: 'Marketing', href: '/admin/marketing' }, { label: 'Newsletter' }]}
      />
      {loading ? (
        <div className="flex h-48 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <DataTableShell
          columns={[
            { key: 'email', label: 'Email Address' },
            { 
              key: 'isActive', 
              label: 'Status', 
              render: (r) => (
                <Badge variant={r.isActive ? 'success' : 'secondary'} className={r.isActive ? 'bg-green-100 text-green-800' : ''}>
                  {r.isActive ? 'Active' : 'Unsubscribed'}
                </Badge>
              ) 
            },
            { 
              key: 'subscribedAt', 
              label: 'Subscribed On',
              render: (r) => new Date(r.subscribedAt).toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'short',
                year: 'numeric'
              })
            },
          ]}
          rows={subs}
        />
      )}
    </div>
  )
}
