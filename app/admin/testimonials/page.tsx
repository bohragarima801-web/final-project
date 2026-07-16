'use client'

import { useEffect, useState } from 'react'
import { PageHeader } from '@/components/admin/page-header'
import { KpiCard } from '@/components/admin/kpi-card'
import { DataTableShell } from '@/components/admin/data-table-shell'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Star, Users, Trash2 } from 'lucide-react'
import { toast } from 'sonner'

export default function TestimonialsPage() {
  const [rows, setRows] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const loadTestimonials = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/admin/testimonials')
      const json = await res.json()
      if (json.ok) {
        setRows(json.data || [])
      } else {
        toast.error(json.error || 'Failed to load testimonials')
      }
    } catch (err) {
      console.error('Error fetching testimonials:', err)
      toast.error('Network error loading testimonials')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadTestimonials()
  }, [])

  // Delete handler
  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete testimonial from "${name}"?`)) return
    try {
      const res = await fetch(`/api/admin/testimonials?id=${id}`, { method: 'DELETE' })
      const json = await res.json()
      if (json.ok) {
        toast.success(`Testimonial from ${name} deleted`)
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
      const res = await fetch('/api/admin/testimonials', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete', ids })
      })
      const json = await res.json()
      if (json.ok) {
        toast.success(`Successfully deleted ${ids.length} testimonials`)
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
      const res = await fetch('/api/admin/testimonials', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'status', ids, status })
      })
      const json = await res.json()
      if (json.ok) {
        toast.success(`Updated status for ${ids.length} testimonials`)
        setRows(prev => prev.map(r => ids.includes(r.id) ? { ...r, status } : r))
      } else {
        toast.error(json.error || 'Failed to update status')
      }
    } catch (err) {
      toast.error('Network error during bulk status update')
    }
  }

  // Testimonial metrics
  const totalCount = rows.length
  const publishedCount = rows.filter(r => r.isActive).length
  const featuredCount = rows.filter(r => r.isFeatured).length
  const avgRating = totalCount > 0 
    ? (rows.reduce((sum, r) => sum + Number(r.rating || 5), 0) / totalCount).toFixed(1) 
    : '5.0'

  const columns = [
    { 
      key: 'name', 
      label: 'Devotee Name', 
      render: (r: any) => (
        <div className="flex items-center gap-2">
          {r.avatar && (
            <img src={r.avatar} alt="" className="h-7 w-7 rounded-full object-cover border" />
          )}
          <span className="font-semibold text-foreground">{r.name}</span>
        </div>
      )
    },
    { key: 'location', label: 'Location' },
    { 
      key: 'rating', 
      label: 'Rating', 
      render: (r: any) => (
        <div className="flex items-center gap-0.5 text-amber-500">
          {Array.from({ length: r.rating || 5 }).map((_, i) => (
            <Star key={i} className="h-3.5 w-3.5 fill-current" />
          ))}
        </div>
      )
    },
    { 
      key: 'message', 
      label: 'Review Message', 
      render: (r: any) => <span className="text-muted-foreground text-xs line-clamp-2 italic font-normal">"{r.message}"</span> 
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
      key: 'isFeatured', 
      label: 'Featured', 
      render: (r: any) => (
        <Badge variant={r.isFeatured ? 'default' : 'secondary'} className={r.isFeatured ? 'bg-amber-500 hover:bg-amber-600 border-none text-white font-bold' : ''}>
          {r.isFeatured ? 'YES' : 'NO'}
        </Badge>
      )
    },
    { 
      key: 'createdAt', 
      label: 'Date', 
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
          onClick={() => handleDelete(r.id, r.name)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      )
    }
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title="Devotee Testimonials"
        description="Verify, publish, feature, or manage customer experiences and reviews across the system."
        breadcrumbs={[{ label: 'Admin', href: '/admin' }, { label: 'Testimonials' }]}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard title="Total Reviews" value={String(totalCount)} icon={Users} />
        <KpiCard title="Published" value={String(publishedCount)} icon={Users} iconClass="text-emerald-500" />
        <KpiCard title="Featured" value={String(featuredCount)} icon={Star} iconClass="text-amber-500" />
        <KpiCard title="Avg Rating" value={`${avgRating}/5.0`} icon={Star} iconClass="text-amber-500" />
      </div>

      <DataTableShell
        columns={columns}
        rows={rows}
        searchPlaceholder="Search reviews by name or location..."
        emptyMessage={loading ? "Loading testimonials..." : "No customer reviews found in database."}
        onBulkDelete={handleBulkDelete}
        onBulkStatusChange={handleBulkStatusChange}
      />
    </div>
  )
}
