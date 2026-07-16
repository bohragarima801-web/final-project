'use client'

import { useEffect, useState } from 'react'
import { PageHeader } from '@/components/admin/page-header'
import { KpiCard } from '@/components/admin/kpi-card'
import { DataTableShell } from '@/components/admin/data-table-shell'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tag, Calendar, Users, Trash2 } from 'lucide-react'
import { toast } from 'sonner'

export default function CouponsPage() {
  const [rows, setRows] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const loadCoupons = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/admin/coupons')
      const json = await res.json()
      if (json.ok) {
        setRows(json.data || [])
      } else {
        toast.error(json.error || 'Failed to load coupons')
      }
    } catch (err) {
      console.error('Error fetching coupons:', err)
      toast.error('Network error loading coupons')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadCoupons()
  }, [])

  // Delete
  const handleDelete = async (id: string, code: string) => {
    if (!confirm(`Are you sure you want to delete coupon code "${code}"?`)) return
    try {
      const res = await fetch(`/api/admin/coupons?id=${id}`, { method: 'DELETE' })
      const json = await res.json()
      if (json.ok) {
        toast.success(`Coupon "${code}" deleted`)
        setRows(prev => prev.filter(r => r.id !== id))
      } else {
        toast.error(json.error || 'Failed to delete coupon')
      }
    } catch (err) {
      toast.error('Network error during deletion')
    }
  }

  // Bulk Actions
  const handleBulkDelete = async (ids: string[]) => {
    try {
      const res = await fetch('/api/admin/coupons', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete', ids })
      })
      const json = await res.json()
      if (json.ok) {
        toast.success(`Successfully deleted ${ids.length} coupons`)
        setRows(prev => prev.filter(r => !ids.includes(r.id)))
      } else {
        toast.error(json.error || 'Failed to bulk delete')
      }
    } catch (err) {
      toast.error('Network error bulk deleting coupons')
    }
  }

  const handleBulkStatusChange = async (ids: string[], status: string) => {
    try {
      const res = await fetch('/api/admin/coupons', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'status', ids, status: status === 'ACTIVE' })
      })
      const json = await res.json()
      if (json.ok) {
        toast.success(`Updated status for ${ids.length} coupons`)
        setRows(prev => prev.map(r => ids.includes(r.id) ? { ...r, isActive: status === 'ACTIVE' } : r))
      } else {
        toast.error(json.error || 'Failed to update coupons')
      }
    } catch (err) {
      toast.error('Network error during bulk update')
    }
  }

  // Metrics
  const totalCount = rows.length
  const activeCount = rows.filter(r => r.isActive).length
  const totalUsed = rows.reduce((acc, r) => acc + (r.usedCount || 0), 0)
  const expiredCount = rows.filter(r => r.expiresAt && new Date(r.expiresAt) < new Date()).length

  const columns = [
    { 
      key: 'code', 
      label: 'Coupon Code', 
      render: (r: any) => <Badge variant="outline" className="font-mono text-sm uppercase font-bold border-amber-500/30 text-amber-600 bg-amber-500/[0.04]">{r.code}</Badge> 
    },
    { 
      key: 'discountValue', 
      label: 'Discount Value', 
      render: (r: any) => (
        <span className="font-bold text-foreground">
          {r.discountType === 'PERCENTAGE' ? `${r.discountValue}%` : `₹${parseFloat(r.discountValue || '0').toLocaleString('en-IN')}`}
        </span>
      )
    },
    { 
      key: 'discountType', 
      label: 'Discount Type', 
      render: (r: any) => <Badge variant="secondary" className="text-[10px] border-none bg-muted font-bold text-muted-foreground">{r.discountType}</Badge> 
    },
    { 
      key: 'usedCount', 
      label: 'Redemptions', 
      render: (r: any) => <span className="text-xs font-semibold">{r.usedCount || 0} / {r.maxUses || 'Unlimited'}</span> 
    },
    { 
      key: 'expiresAt', 
      label: 'Valid Until', 
      render: (r: any) => (
        <span className="text-muted-foreground text-xs font-medium">
          {r.expiresAt ? new Date(r.expiresAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Lifetime'}
        </span>
      )
    },
    { 
      key: 'isActive', 
      label: 'Status', 
      render: (r: any) => (
        <Badge variant={r.isActive ? 'default' : 'secondary'} className={r.isActive ? 'bg-emerald-500 hover:bg-emerald-600 border-none' : ''}>
          {r.isActive ? 'ACTIVE' : 'INACTIVE'}
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
          onClick={() => handleDelete(r.id, r.code)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      )
    }
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title="Promotional Coupon Codes"
        description="Configure discount coupons, seasonal promo offers, percentage cuts, and max usage thresholds."
        breadcrumbs={[{ label: 'Admin', href: '/admin' }, { label: 'Marketing' }, { label: 'Coupons' }]}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard title="Total Coupons" value={String(totalCount)} icon={Tag} />
        <KpiCard title="Active Codes" value={String(activeCount)} icon={Tag} iconClass="text-emerald-500" />
        <KpiCard title="Redeemed Uses" value={String(totalUsed)} icon={Users} iconClass="text-blue-500" />
        <KpiCard title="Expired Offers" value={String(expiredCount)} icon={Calendar} iconClass="text-rose-500" />
      </div>

      <DataTableShell
        columns={columns}
        rows={rows}
        searchPlaceholder="Search coupon codes..."
        emptyMessage={loading ? "Loading coupons..." : "No promotional coupons found in database."}
        onBulkDelete={handleBulkDelete}
        onBulkStatusChange={handleBulkStatusChange}
        statusOptions={['ACTIVE', 'INACTIVE']}
      />
    </div>
  )
}
