'use client'

import { useEffect, useState } from 'react'
import { PageHeader } from '@/components/admin/page-header'
import { KpiCard } from '@/components/admin/kpi-card'
import { DataTableShell } from '@/components/admin/data-table-shell'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Package, Clock, Truck, CheckCircle2, XCircle, Loader2, Trash2 } from 'lucide-react'
import { toast } from 'sonner'

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  async function loadOrders() {
    try {
      setLoading(true)
      const res = await fetch('/api/admin/orders')
      const data = await res.json()
      if (data.ok) {
        setOrders(data.data || [])
      }
    } catch {
      toast.error('Failed to load orders')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadOrders()
  }, [])

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this order?')) return
    try {
      const res = await fetch(`/api/admin/orders?id=${id}`, {
        method: 'DELETE'
      })
      const data = await res.json()
      if (data.ok) {
        toast.success('Order deleted successfully')
        loadOrders()
      } else {
        toast.error(data.error || 'Failed to delete order')
      }
    } catch {
      toast.error('Network error deleting order')
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Orders (ऑर्डर्स)"
        description="Track and manage all customer purchases of sacred prasad and products."
        breadcrumbs={[{ label: 'Admin', href: '/admin' }, { label: 'Orders' }]}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <KpiCard title="Total Orders" value={orders.length.toString()} icon={Package} />
        <KpiCard title="Pending" value={orders.filter(o => o.status === 'PENDING').length.toString()} icon={Clock} iconClass="text-orange-500" />
        <KpiCard title="Processing" value={orders.filter(o => o.status === 'PROCESSING').length.toString()} icon={Truck} iconClass="text-blue-500" />
        <KpiCard title="Delivered" value={orders.filter(o => o.status === 'DELIVERED').length.toString()} icon={CheckCircle2} iconClass="text-green-600" />
        <KpiCard title="Cancelled" value={orders.filter(o => o.status === 'CANCELLED').length.toString()} icon={XCircle} iconClass="text-red-500" />
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-10 w-10 animate-spin text-orange-600" />
        </div>
      ) : (
        <DataTableShell
          columns={[
            { key: 'orderNumber', label: 'Order #' },
            {
              key: 'customer',
              label: 'Devotee / Customer',
              render: (r) => (
                <div className="flex flex-col text-xs">
                  <span className="font-bold">{r.user?.fullName || 'Guest Devotee'}</span>
                  <span className="text-[10px] text-muted-foreground">{r.user?.email || 'No email'}</span>
                </div>
              )
            },
            {
              key: 'items',
              label: 'Purchased Items',
              render: (r) => {
                const count = r.items?.length || 0
                return <span>{count} {count === 1 ? 'item' : 'items'}</span>
              }
            },
            {
              key: 'total',
              label: 'Total Amount',
              render: (r) => <span className="font-bold text-orange-600">₹{Number(r.total)}</span>
            },
            {
              key: 'status',
              label: 'Status',
              render: (r) => (
                <Badge variant={r.status === 'DELIVERED' ? 'success' : r.status === 'PENDING' ? 'secondary' : 'default'}>
                  {r.status}
                </Badge>
              )
            },
            {
              key: 'date',
              label: 'Date',
              render: (r) => <span>{new Date(r.createdAt).toLocaleDateString('en-IN')}</span>
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
          rows={orders}
        />
      )}
    </div>
  )
}
