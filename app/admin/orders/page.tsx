'use client'

import { useEffect, useState } from 'react'
import { PageHeader } from '@/components/admin/page-header'
import { KpiCard } from '@/components/admin/kpi-card'
import { DataTableShell } from '@/components/admin/data-table-shell'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Package, Clock, Truck, CheckCircle2, XCircle, Trash2 } from 'lucide-react'
import { toast } from 'sonner'

export default function OrdersPage() {
  const [rows, setRows] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const loadOrders = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/admin/orders')
      const json = await res.json()
      if (json.ok) {
        setRows(json.data || [])
      } else {
        toast.error(json.error || 'Failed to load orders')
      }
    } catch (err) {
      console.error('Error fetching orders:', err)
      toast.error('Network error loading orders')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadOrders()
  }, [])

  // Delete handler
  const handleDelete = async (id: string, num: string) => {
    if (!confirm(`Delete Order #${num}?`)) return
    try {
      const res = await fetch(`/api/admin/orders?id=${id}`, { method: 'DELETE' })
      const json = await res.json()
      if (json.ok) {
        toast.success(`Order ${num} deleted`)
        setRows(prev => prev.filter(r => r.id !== id))
      } else {
        toast.error(json.error || 'Failed to delete order')
      }
    } catch (err) {
      toast.error('Network error deleting order')
    }
  }

  // Bulk Actions
  const handleBulkDelete = async (ids: string[]) => {
    try {
      const res = await fetch('/api/admin/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete', ids })
      })
      const json = await res.json()
      if (json.ok) {
        toast.success(`Deleted ${ids.length} orders`)
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
      const res = await fetch('/api/admin/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'status', ids, status })
      })
      const json = await res.json()
      if (json.ok) {
        toast.success(`Updated status for ${ids.length} orders`)
        setRows(prev => prev.map(r => ids.includes(r.id) ? { ...r, status } : r))
      } else {
        toast.error(json.error || 'Failed to update status')
      }
    } catch (err) {
      toast.error('Network error during bulk status update')
    }
  }

  // Stats calculation
  const totalCount = rows.length
  const pendingCount = rows.filter(r => r.status === 'PENDING').length
  const shippedCount = rows.filter(r => r.status === 'SHIPPED').length
  const deliveredCount = rows.filter(r => r.status === 'DELIVERED').length
  const returnedCount = rows.filter(r => r.status === 'RETURNED').length

  const columns = [
    { 
      key: 'orderNumber', 
      label: 'Order #', 
      render: (r: any) => <span className="font-mono text-xs font-bold text-foreground">{r.orderNumber}</span> 
    },
    { 
      key: 'customer', 
      label: 'Customer', 
      render: (r: any) => (
        <div className="flex flex-col">
          <span className="font-semibold text-foreground">{r.user?.fullName || 'Spiritual Devotee'}</span>
          <span className="text-[10px] text-muted-foreground">{r.user?.email || 'N/A'}</span>
        </div>
      )
    },
    { 
      key: 'items', 
      label: 'Items Ordered', 
      render: (r: any) => <span className="font-medium">{r.items?.length || 0} item(s)</span> 
    },
    { 
      key: 'total', 
      label: 'Total Total', 
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
      label: 'Order Status', 
      render: (r: any) => (
        <Badge variant={r.status === 'DELIVERED' ? 'outline' : 'secondary'} className={
          r.status === 'CONFIRMED' ? 'bg-blue-100 text-blue-800 border-none' : 
          r.status === 'SHIPPED' ? 'bg-sky-100 text-sky-800 border-none' : 
          r.status === 'DELIVERED' ? 'bg-emerald-100 text-emerald-800 border-none' : 
          r.status === 'CANCELLED' ? 'bg-rose-100 text-rose-800 border-none' : 'bg-amber-100 text-amber-800 border-none'
        }>
          {r.status}
        </Badge>
      )
    },
    { 
      key: 'createdAt', 
      label: 'Order Date', 
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
          onClick={() => handleDelete(r.id, r.orderNumber)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      )
    }
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title="Store Orders"
        description="Track physical prasad shipments, spiritual books, and customized religious items."
        breadcrumbs={[{ label: 'Admin', href: '/admin' }, { label: 'Orders' }]}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <KpiCard title="Total Orders" value={String(totalCount)} icon={Package} />
        <KpiCard title="Pending" value={String(pendingCount)} icon={Clock} iconClass="text-orange-500" />
        <KpiCard title="Shipped" value={String(shippedCount)} icon={Truck} iconClass="text-blue-500" />
        <KpiCard title="Delivered" value={String(deliveredCount)} icon={CheckCircle2} iconClass="text-green-600" />
        <KpiCard title="Returned/Cancelled" value={String(returnedCount)} icon={XCircle} iconClass="text-rose-500" />
      </div>

      <DataTableShell
        columns={columns}
        rows={rows}
        searchPlaceholder="Search orders by order number, customer..."
        emptyMessage={loading ? "Loading orders..." : "No orders found in database."}
        onBulkDelete={handleBulkDelete}
        onBulkStatusChange={handleBulkStatusChange}
        statusOptions={['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'RETURNED']}
      />
    </div>
  )
}
