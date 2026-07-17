'use client'

import { useEffect, useState } from 'react'
import { PageHeader } from '@/components/admin/page-header'
import { KpiCard } from '@/components/admin/kpi-card'
import { DataTableShell } from '@/components/admin/data-table-shell'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Ticket, Clock, CheckCircle2, XCircle, Loader2, Trash2 } from 'lucide-react'
import { toast } from 'sonner'

export default function BookingsPage() {
  const [bookings, setBookings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  async function loadBookings() {
    try {
      setLoading(true)
      const res = await fetch('/api/admin/bookings')
      const data = await res.json()
      if (data.ok) {
        setBookings(data.data || [])
      }
    } catch {
      toast.error('Failed to load bookings')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadBookings()
  }, [])

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this booking?')) return
    try {
      const res = await fetch(`/api/admin/bookings?id=${id}`, {
        method: 'DELETE'
      })
      const data = await res.json()
      if (data.ok) {
        toast.success('Booking deleted successfully')
        loadBookings()
      } else {
        toast.error(data.error || 'Failed to delete booking')
      }
    } catch {
      toast.error('Network error deleting booking')
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Bookings (पूजा बुकिंग्स)"
        description="View and manage all devotee puja bookings, gotra details, and status updates."
        breadcrumbs={[{ label: 'Admin', href: '/admin' }, { label: 'Bookings' }]}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <KpiCard title="Total" value={bookings.length.toString()} icon={Ticket} />
        <KpiCard title="Pending" value={bookings.filter(b => b.status === 'PENDING').length.toString()} icon={Clock} iconClass="text-orange-500" />
        <KpiCard title="Confirmed" value={bookings.filter(b => b.status === 'CONFIRMED').length.toString()} icon={CheckCircle2} iconClass="text-blue-500" />
        <KpiCard title="Completed" value={bookings.filter(b => b.status === 'COMPLETED').length.toString()} icon={CheckCircle2} iconClass="text-green-600" />
        <KpiCard title="Cancelled" value={bookings.filter(b => b.status === 'CANCELLED').length.toString()} icon={XCircle} iconClass="text-red-500" />
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-10 w-10 animate-spin text-orange-600" />
        </div>
      ) : (
        <DataTableShell
          columns={[
            { key: 'bookingNumber', label: 'Booking #' },
            {
              key: 'customer',
              label: 'Devotee / Customer',
              render: (r) => (
                <div className="flex flex-col text-xs">
                  <span className="font-bold">{r.user?.fullName || 'Guest User'}</span>
                  <span className="text-[10px] text-muted-foreground">{r.user?.email || 'No email'}</span>
                  {r.gotra && <span className="text-[10px] text-orange-600 font-semibold">Gotra: {r.gotra}</span>}
                </div>
              )
            },
            {
              key: 'puja',
              label: 'Puja Details',
              render: (r) => (
                <div className="flex flex-col text-xs">
                  <span className="font-bold">{r.puja?.name || 'Unknown Puja'}</span>
                  <span className="text-[10px] text-muted-foreground">{r.temple?.name || 'Any Temple'}</span>
                </div>
              )
            },
            {
              key: 'date',
              label: 'Scheduled',
              render: (r) => <span>{r.scheduledAt ? new Date(r.scheduledAt).toLocaleDateString('en-IN') : 'Not Scheduled'}</span>
            },
            {
              key: 'total',
              label: 'Amount',
              render: (r) => <span className="font-bold">₹{Number(r.total)}</span>
            },
            {
              key: 'status',
              label: 'Status',
              render: (r) => (
                <Badge variant={r.status === 'COMPLETED' ? 'success' : r.status === 'PENDING' ? 'secondary' : 'default'}>
                  {r.status}
                </Badge>
              )
            },
            {
              key: 'actions',
              label: 'Actions',
              render: (r) => (
                <Button size="icon" variant="ghost" className="h-8 w-8 text-red-600" onClick={() => handleDelete(r.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              )
            }
          ]}
          rows={bookings}
        />
      )}
    </div>
  )
}
