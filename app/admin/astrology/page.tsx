'use client'

import { useEffect, useState } from 'react'
import { PageHeader } from '@/components/admin/page-header'
import { KpiCard } from '@/components/admin/kpi-card'
import { DataTableShell } from '@/components/admin/data-table-shell'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Sparkles, FileText, Users, Trash2, Calendar } from 'lucide-react'
import { toast } from 'sonner'

export default function AstrologyPage() {
  const [rows, setRows] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const loadAstrology = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/admin/astrology')
      const json = await res.json()
      if (json.ok) {
        setRows(json.data || [])
      } else {
        toast.error(json.error || 'Failed to load astrology reports')
      }
    } catch (err) {
      console.error('Error fetching astrology reports:', err)
      toast.error('Network error loading reports')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadAstrology()
  }, [])

  // Delete
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this report request?')) return
    try {
      const res = await fetch(`/api/admin/astrology?id=${id}`, { method: 'DELETE' })
      const json = await res.json()
      if (json.ok) {
        toast.success('Report request deleted')
        setRows(prev => prev.filter(r => r.id !== id))
      } else {
        toast.error(json.error || 'Failed to delete request')
      }
    } catch (err) {
      toast.error('Network error during deletion')
    }
  }

  // Bulk actions
  const handleBulkDelete = async (ids: string[]) => {
    try {
      const res = await fetch('/api/admin/astrology', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete', ids })
      })
      const json = await res.json()
      if (json.ok) {
        toast.success(`Deleted ${ids.length} astrology requests`)
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
      const res = await fetch('/api/admin/astrology', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'status', ids, status })
      })
      const json = await res.json()
      if (json.ok) {
        toast.success(`Updated status for ${ids.length} requests`)
        setRows(prev => prev.map(r => ids.includes(r.id) ? { ...r, status } : r))
      } else {
        toast.error(json.error || 'Failed to update status')
      }
    } catch (err) {
      toast.error('Network error during bulk update')
    }
  }

  // Metrics
  const totalCount = rows.length
  const completedCount = rows.filter(r => r.status === 'COMPLETED').length
  const pendingCount = rows.filter(r => r.status === 'PENDING').length

  const columns = [
    { 
      key: 'id', 
      label: 'ID', 
      render: (r: any) => <span className="font-mono text-[10px] font-bold text-muted-foreground">#{r.id.substring(0, 8)}</span> 
    },
    { 
      key: 'user', 
      label: 'Devotee / Customer', 
      render: (r: any) => (
        <div className="flex flex-col">
          <span className="font-semibold text-foreground">{r.user?.fullName || 'Spiritual Devotee'}</span>
          <span className="text-[10px] text-muted-foreground">{r.user?.email || 'N/A'}</span>
        </div>
      )
    },
    { 
      key: 'type', 
      label: 'Consultation Type', 
      render: (r: any) => (
        <Badge variant="outline" className="capitalize bg-muted border-none text-foreground font-semibold">
          {r.reportType || r.type || 'Kundali Reading'}
        </Badge>
      )
    },
    { 
      key: 'status', 
      label: 'Status', 
      render: (r: any) => (
        <Badge variant={r.status === 'COMPLETED' ? 'default' : 'secondary'} className={
          r.status === 'COMPLETED' ? 'bg-emerald-500 hover:bg-emerald-600 border-none' : 
          r.status === 'PENDING' ? 'bg-amber-100 text-amber-800 border-none' : 'bg-muted border-none'
        }>
          {r.status || 'PENDING'}
        </Badge>
      )
    },
    { 
      key: 'createdAt', 
      label: 'Request Date', 
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
          onClick={() => handleDelete(r.id)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      )
    }
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title="Vedic Astrology Consultation"
        description="Verify birth details, assign astrologers, review Kundali matches, and deliver digital reports."
        breadcrumbs={[{ label: 'Admin', href: '/admin' }, { label: 'Astrology' }]}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <KpiCard title="Total Consultations" value={String(totalCount)} icon={FileText} />
        <KpiCard title="Reports Delivered" value={String(completedCount)} icon={Sparkles} iconClass="text-emerald-500" />
        <KpiCard title="Pending Review" value={String(pendingCount)} icon={Users} iconClass="text-amber-500" />
      </div>

      <DataTableShell
        columns={columns}
        rows={rows}
        searchPlaceholder="Search consultation orders..."
        emptyMessage={loading ? "Loading reports..." : "No astrology requests found in database."}
        onBulkDelete={handleBulkDelete}
        onBulkStatusChange={handleBulkStatusChange}
        statusOptions={['PENDING', 'PROCESSING', 'COMPLETED', 'CANCELLED']}
      />
    </div>
  )
}
