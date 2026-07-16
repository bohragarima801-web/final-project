'use client'

import { useEffect, useState } from 'react'
import { PageHeader } from '@/components/admin/page-header'
import { KpiCard } from '@/components/admin/kpi-card'
import { DataTableShell } from '@/components/admin/data-table-shell'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Calendar, Video, CheckCircle, Radio, Trash2 } from 'lucide-react'
import { toast } from 'sonner'

export default function EventsPage() {
  const [rows, setRows] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const loadEvents = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/admin/events')
      const json = await res.json()
      if (json.ok) {
        setRows(json.data || [])
      } else {
        toast.error(json.error || 'Failed to load events')
      }
    } catch (err) {
      console.error('Error fetching events:', err)
      toast.error('Network error loading events')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadEvents()
  }, [])

  // Delete handler
  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete event "${title}"?`)) return
    try {
      const res = await fetch(`/api/admin/events?id=${id}`, { method: 'DELETE' })
      const json = await res.json()
      if (json.ok) {
        toast.success(`Event "${title}" deleted`)
        setRows(prev => prev.filter(r => r.id !== id))
      } else {
        toast.error(json.error || 'Failed to delete')
      }
    } catch (err) {
      toast.error('Network error during deletion')
    }
  }

  // Bulk Actions
  const handleBulkDelete = async (ids: string[]) => {
    try {
      const res = await fetch('/api/admin/events', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete', ids })
      })
      const json = await res.json()
      if (json.ok) {
        toast.success(`Deleted ${ids.length} events`)
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
      const res = await fetch('/api/admin/events', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'status', ids, status })
      })
      const json = await res.json()
      if (json.ok) {
        toast.success(`Updated status for ${ids.length} events`)
        setRows(prev => prev.map(r => ids.includes(r.id) ? { ...r, status } : r))
      } else {
        toast.error(json.error || 'Failed to update status')
      }
    } catch (err) {
      toast.error('Network error during bulk status update')
    }
  }

  // KPI Calculations
  const totalCount = rows.length
  const liveBroadcasts = rows.filter(r => r.isLive).length
  const featuredEvents = rows.filter(r => r.isFeatured).length
  const activeCount = rows.filter(r => r.isActive).length

  const columns = [
    { 
      key: 'title', 
      label: 'Event Title', 
      render: (r: any) => (
        <div className="flex items-center gap-3">
          {r.coverImage ? (
            <img src={r.coverImage} alt="" className="h-10 w-12 rounded object-cover border" />
          ) : (
            <div className="h-10 w-12 bg-muted rounded flex items-center justify-center text-muted-foreground">
              <Calendar className="h-4 w-4" />
            </div>
          )}
          <div>
            <span className="font-semibold text-foreground block">{r.title}</span>
            <span className="text-[10px] text-muted-foreground font-mono">{r.slug}</span>
          </div>
        </div>
      )
    },
    { key: 'location', label: 'Broadcast Location' },
    { 
      key: 'startsAt', 
      label: 'Start Date/Time', 
      render: (r: any) => <span className="text-muted-foreground text-xs">{new Date(r.startsAt).toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' })}</span> 
    },
    { 
      key: 'isLive', 
      label: 'Live Streaming', 
      render: (r: any) => (
        <Badge variant={r.isLive ? 'default' : 'secondary'} className={r.isLive ? 'bg-rose-500 hover:bg-rose-600 text-white font-bold border-none animate-pulse' : ''}>
          {r.isLive ? 'LIVE' : 'UPCOMING'}
        </Badge>
      )
    },
    { 
      key: 'isFeatured', 
      label: 'Featured', 
      render: (r: any) => (
        <Badge variant={r.isFeatured ? 'default' : 'secondary'} className={r.isFeatured ? 'bg-amber-500 text-white border-none' : ''}>
          {r.isFeatured ? 'YES' : 'NO'}
        </Badge>
      )
    },
    { 
      key: 'isActive', 
      label: 'Published', 
      render: (r: any) => (
        <Badge variant={r.isActive ? 'default' : 'secondary'} className={r.isActive ? 'bg-emerald-500 hover:bg-emerald-600 border-none' : ''}>
          {r.isActive ? 'ACTIVE' : 'DRAFT'}
        </Badge>
      )
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
          onClick={() => handleDelete(r.id, r.title)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      )
    }
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title="Live Broadcasts & Events"
        description="Schedule live temple broadcasts, Vedic spiritual classes, offline festivals, and registrations."
        breadcrumbs={[{ label: 'Admin', href: '/admin' }, { label: 'Events' }]}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard title="Total Events" value={String(totalCount)} icon={Calendar} />
        <KpiCard title="Live Streams" value={String(liveBroadcasts)} icon={Radio} iconClass="text-rose-500 animate-pulse" />
        <KpiCard title="Featured Festivals" value={String(featuredEvents)} icon={Video} iconClass="text-amber-500" />
        <KpiCard title="Active Enrolled" value={String(activeCount)} icon={CheckCircle} iconClass="text-emerald-500" />
      </div>

      <DataTableShell
        columns={columns}
        rows={rows}
        searchPlaceholder="Search events by title or location..."
        emptyMessage={loading ? "Loading events..." : "No events found in database."}
        onBulkDelete={handleBulkDelete}
      />
    </div>
  )
}
