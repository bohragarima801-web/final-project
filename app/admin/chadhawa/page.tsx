'use client'

import { useEffect, useState } from 'react'
import { PageHeader } from '@/components/admin/page-header'
import { KpiCard } from '@/components/admin/kpi-card'
import { DataTableShell } from '@/components/admin/data-table-shell'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Sparkles, Trash2, ShieldCheck, HeartHandshake, Flame } from 'lucide-react'
import { toast } from 'sonner'

export default function ChadhawaPage() {
  const [rows, setRows] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const loadChadhawa = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/admin/chadhawa')
      const json = await res.json()
      if (json.ok) {
        setRows(json.data || [])
      } else {
        toast.error(json.error || 'Failed to load Chadhawa records')
      }
    } catch (err) {
      console.error('Error fetching chadhawa:', err)
      toast.error('Network error loading Chadhawa data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadChadhawa()
  }, [])

  // Delete single
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this Chadhawa request?')) return
    try {
      const res = await fetch(`/api/admin/chadhawa?id=${id}`, { method: 'DELETE' })
      const json = await res.json()
      if (json.ok) {
        toast.success('Chadhawa record deleted')
        setRows(prev => prev.filter(r => r.id !== id))
      } else {
        toast.error(json.error || 'Failed to delete record')
      }
    } catch (err) {
      toast.error('Network error deleting record')
    }
  }

  // Bulk deletion
  const handleBulkDelete = async (ids: string[]) => {
    try {
      const res = await fetch('/api/admin/chadhawa', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete', ids })
      })
      const json = await res.json()
      if (json.ok) {
        toast.success(`Deleted ${ids.length} records`)
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
      const res = await fetch('/api/admin/chadhawa', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'status', ids, status })
      })
      const json = await res.json()
      if (json.ok) {
        toast.success(`Updated status for ${ids.length} Chadhawa requests`)
        setRows(prev => prev.map(r => ids.includes(r.id) ? { ...r, status } : r))
      } else {
        toast.error(json.error || 'Failed to update status')
      }
    } catch (err) {
      toast.error('Network error updating status')
    }
  }

  // KPI calculations
  const totalCount = rows.length
  const flowersCount = rows.filter(r => r.category === 'FLOWERS' || r.item?.toLowerCase().includes('flower')).length
  const prasadCount = rows.filter(r => r.category === 'PRASAD' || r.item?.toLowerCase().includes('prasad')).length
  const bhogCount = rows.filter(r => r.category === 'BHOG' || r.item?.toLowerCase().includes('bhog')).length

  const columns = [
    { 
      key: 'id', 
      label: 'ID', 
      render: (r: any) => <span className="font-mono text-[10px] font-bold text-muted-foreground">#{r.id.substring(0, 8)}</span> 
    },
    { 
      key: 'user', 
      label: 'Devotee', 
      render: (r: any) => (
        <span className="font-semibold text-foreground">{r.user?.fullName || 'Generous Devotee'}</span>
      )
    },
    { key: 'item', label: 'Offering / Item' },
    { 
      key: 'temple', 
      label: 'Destined Temple', 
      render: (r: any) => <span className="text-muted-foreground font-medium">{r.temple?.name || 'Vedic Temple'}</span> 
    },
    { 
      key: 'amount', 
      label: 'Sewa Amount', 
      render: (r: any) => <span className="font-bold text-foreground">₹{parseFloat(r.amount || '0').toLocaleString('en-IN')}</span> 
    },
    { 
      key: 'status', 
      label: 'Status', 
      render: (r: any) => (
        <Badge variant={r.status === 'COMPLETED' ? 'default' : 'secondary'} className={
          r.status === 'COMPLETED' ? 'bg-emerald-500 hover:bg-emerald-600 border-none' : 
          r.status === 'PENDING' ? 'bg-amber-100 text-amber-800 border-none' : 'bg-muted border-none'
        }>
          {r.status}
        </Badge>
      )
    },
    { 
      key: 'createdAt', 
      label: 'Offering Date', 
      render: (r: any) => <span className="text-muted-foreground text-xs">{new Date(r.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span> 
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
        title="Chadhawa Seva offerings"
        description="Verify, perform, and catalog devotional items and flowers offered on behalf of devotees."
        breadcrumbs={[{ label: 'Admin', href: '/admin' }, { label: 'Chadhawa' }]}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard title="Total Offerings" value={String(totalCount)} icon={Sparkles} />
        <KpiCard title="Flower Offerings" value={String(flowersCount)} icon={HeartHandshake} iconClass="text-rose-500" />
        <KpiCard title="Holy Prasad" value={String(prasadCount)} icon={ShieldCheck} iconClass="text-emerald-500" />
        <KpiCard title="Deep / Bhog offerings" value={String(bhogCount)} icon={Flame} iconClass="text-amber-500" />
      </div>

      <DataTableShell
        columns={columns}
        rows={rows}
        searchPlaceholder="Search offerings by item, devotee..."
        emptyMessage={loading ? "Loading offerings..." : "No Chadhawa requests found in database."}
        onBulkDelete={handleBulkDelete}
        onBulkStatusChange={handleBulkStatusChange}
        statusOptions={['PENDING', 'PROCESSING', 'COMPLETED', 'CANCELLED']}
      />
    </div>
  )
}
