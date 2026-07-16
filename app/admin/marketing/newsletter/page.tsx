'use client'

import { useEffect, useState } from 'react'
import { PageHeader } from '@/components/admin/page-header'
import { DataTableShell } from '@/components/admin/data-table-shell'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Trash2 } from 'lucide-react'
import { toast } from 'sonner'

export default function NewsletterPage() {
  const [rows, setRows] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const loadSubscribers = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/admin/newsletters')
      const json = await res.json()
      if (json.ok) {
        setRows(json.data || [])
      } else {
        toast.error(json.error || 'Failed to load subscribers')
      }
    } catch (err) {
      console.error('Error fetching subscribers:', err)
      toast.error('Network error loading subscribers')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadSubscribers()
  }, [])

  // Delete
  const handleDelete = async (id: string, email: string) => {
    if (!confirm(`Remove subscriber "${email}"?`)) return
    try {
      const res = await fetch(`/api/admin/newsletters?id=${id}`, { method: 'DELETE' })
      const json = await res.json()
      if (json.ok) {
        toast.success(`Subscriber "${email}" removed`)
        setRows(prev => prev.filter(r => r.id !== id))
      } else {
        toast.error(json.error || 'Failed to remove subscriber')
      }
    } catch (err) {
      toast.error('Network error removing subscriber')
    }
  }

  // Bulk Actions
  const handleBulkDelete = async (ids: string[]) => {
    try {
      const res = await fetch('/api/admin/newsletters', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete', ids })
      })
      const json = await res.json()
      if (json.ok) {
        toast.success(`Successfully removed ${ids.length} subscribers`)
        setRows(prev => prev.filter(r => !ids.includes(r.id)))
      } else {
        toast.error(json.error || 'Failed to bulk remove')
      }
    } catch (err) {
      toast.error('Network error during bulk remove')
    }
  }

  const handleBulkStatusChange = async (ids: string[], status: string) => {
    try {
      const res = await fetch('/api/admin/newsletters', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'status', ids, status: status === 'ACTIVE' })
      })
      const json = await res.json()
      if (json.ok) {
        toast.success(`Successfully updated subscription status for ${ids.length} emails`)
        setRows(prev => prev.map(r => ids.includes(r.id) ? { ...r, isActive: status === 'ACTIVE' } : r))
      } else {
        toast.error(json.error || 'Failed to update subscription status')
      }
    } catch (err) {
      toast.error('Network error updating subscription status')
    }
  }

  const columns = [
    { 
      key: 'email', 
      label: 'Email Address', 
      className: 'font-semibold font-mono text-sm' 
    },
    { 
      key: 'isActive', 
      label: 'Subscription Status', 
      render: (r: any) => (
        <Badge variant={r.isActive ? 'default' : 'secondary'} className={r.isActive ? 'bg-emerald-500 hover:bg-emerald-600 border-none' : ''}>
          {r.isActive ? 'SUBSCRIBED' : 'UNSUBSCRIBED'}
        </Badge>
      )
    },
    { 
      key: 'subscribedAt', 
      label: 'Date Subscribed', 
      render: (r: any) => <span className="text-muted-foreground text-xs">{new Date(r.subscribedAt || r.createdAt).toLocaleDateString('en-IN', { dateStyle: 'medium' })}</span> 
    },
    {
      key: 'actions',
      label: 'Actions',
      sortable: false,
      render: (r: any) => (
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8 text-rose-600 hover:text-rose-700 hover:bg-rose-50"
          onClick={() => handleDelete(r.id, r.email)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      )
    }
  ]

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Newsletter Subscribers" 
        description="Verify, manage, export, and delete email subscriptions for platforms updates and devotional flyers."
        breadcrumbs={[{ label: 'Marketing', href: '/admin/marketing' }, { label: 'Newsletter' }]} 
      />

      <DataTableShell
        columns={columns}
        rows={rows}
        searchPlaceholder="Search subscribers by email..."
        emptyMessage={loading ? "Loading subscribers..." : "No subscribers found in database."}
        onBulkDelete={handleBulkDelete}
        onBulkStatusChange={handleBulkStatusChange}
        statusOptions={['ACTIVE', 'INACTIVE']}
      />
    </div>
  )
}
