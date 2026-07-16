'use client'

import { useEffect, useState } from 'react'
import { PageHeader } from '@/components/admin/page-header'
import { KpiCard } from '@/components/admin/kpi-card'
import { DataTableShell } from '@/components/admin/data-table-shell'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Ticket, Clock, CheckCircle2, XCircle, Trash2, ShieldCheck } from 'lucide-react'
import { toast } from 'sonner'

export default function BookingsPage() {
  const [rows, setRows] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // Fetch bookings from database
  const loadBookings = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/admin/bookings')
      const json = await res.json()
      if (json.ok) {
        setRows(json.data || [])
      } else {
        toast.error(json.error || 'Failed to load bookings')
      }
    } catch (err) {
      console.error('Error fetching bookings:', err)
      toast.error('Network error loading bookings')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadBookings()
  }, [])

  // Delete single booking handler
  const handleDeleteSingle = async (id: string, code: string) => {
    if (!confirm(`Are you sure you want to delete Booking #${code}?`)) return
    try {
      const res = await fetch(`/api/admin/bookings?id=${id}`, { method: 'DELETE' })
      const json = await res.json()
      if (json.ok) {
        toast.success(`Booking ${code} deleted`)
        setRows(prev => prev.filter(r => r.id !== id))
      } else {
        toast.error(json.error || 'Failed to delete booking')
      }
    } catch (err) {
      toast.error('Network error during deletion')
    }
  }

  // Bulk Actions
  const handleBulkDelete = async (ids: string[]) => {
    try {
      const res = await fetch('/api/admin/bookings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete', ids })
      })
      const json = await res.json()
      if (json.ok) {
        toast.success(json.message || `Deleted ${ids.length} bookings`)
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
      const res = await fetch('/api/admin/bookings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'status', ids, status })
      })
      const json = await res.json()
      if (json.ok) {
        toast.success(`Updated status for ${ids.length} bookings`)
        setRows(prev => prev.map(r => ids.includes(r.id) ? { ...r, status } : r))
      } else {
        toast.error(json.error || 'Failed to update status')
      }
    } catch (err) {
      toast.error('Network error during bulk update')
    }
  }

  // Real-time stats calculations
  const totalCount = rows.length
  const pendingCount = rows.filter(r => r.status === 'PENDING').length
  const confirmedCount = rows.filter(r => r.status === 'CONFIRMED').length
  const completedCount = rows.filter(r => r.status === 'COMPLETED').length
  const cancelledCount = rows.filter(r => r.status === 'CANCELLED').length

  const columns = [
    { 
      key: 'bookingNumber', 
      label: 'Booking #', 
      render: (r: any) => <span className="font-mono text-xs font-bold text-foreground">{r.bookingNumber}</span> 
    },
    { 
      key: 'customer', 
      label: 'Customer', 
      render: (r: any) => (
        <div className="flex flex-col">
          <span className="font-semibold text-foreground">{r.user?.fullName || 'Registered User'}</span>
          <span className="text-[10px] text-muted-foreground">{r.user?.email || 'N/A'}</span>
        </div>
      )
    },
    { 
      key: 'puja', 
      label: 'Puja Ceremony', 
      render: (r: any) => <span className="font-medium text-foreground">{r.puja?.name || 'Vedic Puja'}</span> 
    },
    { 
      key: 'scheduledAt', 
      label: 'Scheduled Date', 
      render: (r: any) => (
        <span className="text-muted-foreground text-xs">
          {r.scheduledAt ? new Date(r.scheduledAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Flexible'}
        </span>
      )
    },
    { 
      key: 'total', 
      label: 'Total Amount', 
      render: (r: any) => <span className="font-bold text-foreground">₹{parseFloat(r.total || '0').toLocaleString('en-IN')}</span> 
    },
    { 
      key: 'paymentStatus', 
      label: 'Payment', 
      render: (r: any) => (
        <Badge variant={r.paymentStatus === 'SUCCESS' ? 'default' : 'secondary'} className={r.paymentStatus === 'SUCCESS' ? 'bg-emerald-500 hover:bg-emerald-600 text-white border-none' : ''}>
          {r.paymentStatus}
        </Badge>
      )
    },
    { 
      key: 'status', 
      label: 'Status', 
      render: (r: any) => (
        <Badge variant={r.status === 'COMPLETED' ? 'outline' : 'secondary'} className={
          r.status === 'CONFIRMED' ? 'bg-blue-100 text-blue-800 border-none' : 
          r.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-800 border-none' : 
          r.status === 'CANCELLED' ? 'bg-rose-100 text-rose-800 border-none' : 'bg-amber-100 text-amber-800 border-none'
        }>
          {r.status}
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
          onClick={() => handleDeleteSingle(r.id, r.bookingNumber)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      )
    }
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title="Puja Bookings"
        description="All Vedic puja bookings, ritual completions, and scheduling."
        breadcrumbs={[{ label: 'Admin', href: '/admin' }, { label: 'Bookings' }]}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <KpiCard title="Total" value={String(totalCount)} icon={Ticket} />
        <KpiCard title="Pending" value={String(pendingCount)} icon={Clock} iconClass="text-orange-500" />
        <KpiCard title="Confirmed" value={String(confirmedCount)} icon={ShieldCheck} iconClass="text-blue-500" />
        <KpiCard title="Completed" value={String(completedCount)} icon={CheckCircle2} iconClass="text-green-600" />
        <KpiCard title="Cancelled" value={String(cancelledCount)} icon={XCircle} iconClass="text-rose-500" />
      </div>

      <DataTableShell
        columns={columns}
        rows={rows}
        searchPlaceholder="Search bookings by code, puja, customer..."
        emptyMessage={loading ? "Loading bookings..." : "No bookings found in database."}
        onBulkDelete={handleBulkDelete}
        onBulkStatusChange={handleBulkStatusChange}
        statusOptions={['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED', 'REFUNDED']}
      />
    </div>
  )
}
