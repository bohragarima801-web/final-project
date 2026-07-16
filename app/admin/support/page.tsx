'use client'

import { useEffect, useState } from 'react'
import { PageHeader } from '@/components/admin/page-header'
import { KpiCard } from '@/components/admin/kpi-card'
import { DataTableShell } from '@/components/admin/data-table-shell'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { MessageSquare, Clock, CheckCircle2, AlertTriangle, Trash2 } from 'lucide-react'
import { toast } from 'sonner'

export default function SupportPage() {
  const [rows, setRows] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const loadTickets = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/admin/support')
      const json = await res.json()
      if (json.ok) {
        setRows(json.data || [])
      } else {
        toast.error(json.error || 'Failed to load support tickets')
      }
    } catch (err) {
      console.error('Error fetching support tickets:', err)
      toast.error('Network error loading support tickets')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadTickets()
  }, [])

  // Delete
  const handleDelete = async (id: string, num: string) => {
    if (!confirm(`Delete ticket #${num}?`)) return
    try {
      const res = await fetch(`/api/admin/support?id=${id}`, { method: 'DELETE' })
      const json = await res.json()
      if (json.ok) {
        toast.success(`Ticket #${num} deleted`)
        setRows(prev => prev.filter(r => r.id !== id))
      } else {
        toast.error(json.error || 'Failed to delete ticket')
      }
    } catch (err) {
      toast.error('Network error during deletion')
    }
  }

  // Bulk Actions
  const handleBulkDelete = async (ids: string[]) => {
    try {
      const res = await fetch('/api/admin/support', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete', ids })
      })
      const json = await res.json()
      if (json.ok) {
        toast.success(`Deleted ${ids.length} tickets`)
        setRows(prev => prev.filter(r => !ids.includes(r.id)))
      } else {
        toast.error(json.error || 'Failed to bulk delete')
      }
    } catch (err) {
      toast.error('Network error during bulk delete')
    }
  }

  const handleBulkStatusChange = async (ids: string[], status: string) => {
    try {
      const res = await fetch('/api/admin/support', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'status', ids, status })
      })
      const json = await res.json()
      if (json.ok) {
        toast.success(`Updated status for ${ids.length} tickets`)
        setRows(prev => prev.map(r => ids.includes(r.id) ? { ...r, status } : r))
      } else {
        toast.error(json.error || 'Failed to update status')
      }
    } catch (err) {
      toast.error('Network error during bulk update')
    }
  }

  // KPIs
  const totalCount = rows.length
  const openCount = rows.filter(r => r.status === 'OPEN' || r.status === 'NEW').length
  const progressCount = rows.filter(r => r.status === 'IN_PROGRESS' || r.status === 'PENDING').length
  const resolvedCount = rows.filter(r => r.status === 'RESOLVED' || r.status === 'CLOSED').length

  const columns = [
    { 
      key: 'ticketNumber', 
      label: 'Ticket #', 
      render: (r: any) => <span className="font-mono text-xs font-bold text-foreground">#{r.ticketNumber || r.id.substring(0, 8)}</span> 
    },
    { 
      key: 'customer', 
      label: 'Customer', 
      render: (r: any) => (
        <div className="flex flex-col">
          <span className="font-semibold text-foreground">{r.user?.fullName || r.userName || 'Anonymous Devotee'}</span>
          <span className="text-[10px] text-muted-foreground">{r.user?.email || r.userEmail || 'N/A'}</span>
        </div>
      )
    },
    { key: 'subject', label: 'Subject / Issue', className: 'max-w-xs truncate' },
    { 
      key: 'priority', 
      label: 'Priority', 
      render: (r: any) => (
        <Badge variant="outline" className={
          r.priority === 'HIGH' || r.priority === 'CRITICAL' ? 'bg-rose-100 text-rose-800 border-none font-bold' : 
          r.priority === 'MEDIUM' ? 'bg-amber-100 text-amber-800 border-none' : 'bg-muted text-muted-foreground border-none'
        }>
          {r.priority || 'MEDIUM'}
        </Badge>
      )
    },
    { 
      key: 'status', 
      label: 'Status', 
      render: (r: any) => (
        <Badge variant={r.status === 'RESOLVED' ? 'default' : 'secondary'} className={
          r.status === 'RESOLVED' || r.status === 'CLOSED' ? 'bg-emerald-500 hover:bg-emerald-600 border-none text-white' : 
          r.status === 'OPEN' || r.status === 'NEW' ? 'bg-rose-100 text-rose-800 border-none' : 'bg-blue-100 text-blue-800 border-none'
        }>
          {r.status || 'OPEN'}
        </Badge>
      )
    },
    { 
      key: 'createdAt', 
      label: 'Created Date', 
      render: (r: any) => <span className="text-muted-foreground text-xs">{new Date(r.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span> 
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
          onClick={() => handleDelete(r.id, r.ticketNumber || r.id.substring(0, 8))}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      )
    }
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title="Customer Support Tickets"
        description="Verify, respond to, and resolve user concerns, booking inquiries, and payment questions."
        breadcrumbs={[{ label: 'Admin', href: '/admin' }, { label: 'Support' }]}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard title="Total Tickets" value={String(totalCount)} icon={MessageSquare} />
        <KpiCard title="Open / New" value={String(openCount)} icon={AlertTriangle} iconClass="text-rose-500" />
        <KpiCard title="In Progress" value={String(progressCount)} icon={Clock} iconClass="text-blue-500" />
        <KpiCard title="Resolved / Closed" value={String(resolvedCount)} icon={CheckCircle2} iconClass="text-emerald-500" />
      </div>

      <DataTableShell
        columns={columns}
        rows={rows}
        searchPlaceholder="Search support tickets..."
        emptyMessage={loading ? "Loading tickets..." : "No support tickets found in database."}
        onBulkDelete={handleBulkDelete}
        onBulkStatusChange={handleBulkStatusChange}
        statusOptions={['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED']}
      />
    </div>
  )
}
