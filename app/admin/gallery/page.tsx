'use client'

import { useEffect, useState } from 'react'
import { PageHeader } from '@/components/admin/page-header'
import { KpiCard } from '@/components/admin/kpi-card'
import { DataTableShell } from '@/components/admin/data-table-shell'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ImageIcon, Film, Image as ImgIcon, Calendar, Trash2 } from 'lucide-react'
import { toast } from 'sonner'

export default function GalleryPage() {
  const [rows, setRows] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const loadGallery = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/admin/gallery')
      const json = await res.json()
      if (json.ok) {
        setRows(json.data || [])
      } else {
        toast.error(json.error || 'Failed to load gallery')
      }
    } catch (err) {
      console.error('Error fetching gallery:', err)
      toast.error('Network error loading gallery')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadGallery()
  }, [])

  // Delete handler
  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete the gallery "${title}"?`)) return
    try {
      const res = await fetch(`/api/admin/gallery?id=${id}`, { method: 'DELETE' })
      const json = await res.json()
      if (json.ok) {
        toast.success(`Gallery "${title}" deleted successfully`)
        setRows(prev => prev.filter(r => r.id !== id))
      } else {
        toast.error(json.error || 'Failed to delete')
      }
    } catch (err) {
      toast.error('Network error during deletion')
    }
  }

  // Bulk deletion
  const handleBulkDelete = async (ids: string[]) => {
    try {
      const res = await fetch('/api/admin/gallery', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete', ids })
      })
      const json = await res.json()
      if (json.ok) {
        toast.success(`Successfully deleted ${ids.length} galleries`)
        setRows(prev => prev.filter(r => !ids.includes(r.id)))
      } else {
        toast.error(json.error || 'Failed to bulk delete')
      }
    } catch (err) {
      toast.error('Network error during bulk delete')
    }
  }

  // Counts
  const totalCount = rows.length
  const photosCount = rows.filter(r => r.type === 'PHOTO').length
  const videosCount = rows.filter(r => r.type === 'VIDEO').length
  const activeCount = rows.filter(r => r.isActive).length

  const columns = [
    { 
      key: 'title', 
      label: 'Gallery Title', 
      render: (r: any) => (
        <div className="flex items-center gap-3">
          {r.coverImage ? (
            <img src={r.coverImage} alt="" className="h-10 w-12 rounded object-cover border" />
          ) : (
            <div className="h-10 w-12 bg-muted rounded flex items-center justify-center text-muted-foreground">
              <ImageIcon className="h-4 w-4" />
            </div>
          )}
          <div>
            <span className="font-semibold text-foreground block">{r.title}</span>
            <span className="text-[10px] text-muted-foreground font-mono">{r.slug}</span>
          </div>
        </div>
      )
    },
    { key: 'description', label: 'Description' },
    { 
      key: 'type', 
      label: 'Type', 
      render: (r: any) => (
        <Badge variant="outline" className="capitalize border-none bg-muted text-foreground font-semibold">
          {r.type}
        </Badge>
      )
    },
    { 
      key: 'isActive', 
      label: 'Status', 
      render: (r: any) => (
        <Badge variant={r.isActive ? 'default' : 'secondary'} className={r.isActive ? 'bg-emerald-500 hover:bg-emerald-600 border-none' : ''}>
          {r.isActive ? 'ACTIVE' : 'DRAFT'}
        </Badge>
      )
    },
    { 
      key: 'createdAt', 
      label: 'Created At', 
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
        title="Photo & Video Gallery"
        description="Manage sacred ritual images, temple photos, dynamic event records, and festival folders."
        breadcrumbs={[{ label: 'Admin', href: '/admin' }, { label: 'Gallery' }]}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard title="Total Galleries" value={String(totalCount)} icon={ImageIcon} />
        <KpiCard title="Photo Galleries" value={String(photosCount)} icon={ImgIcon} iconClass="text-blue-500" />
        <KpiCard title="Video Galleries" value={String(videosCount)} icon={Film} iconClass="text-orange-500" />
        <KpiCard title="Active Galleries" value={String(activeCount)} icon={Calendar} iconClass="text-emerald-500" />
      </div>

      <DataTableShell
        columns={columns}
        rows={rows}
        searchPlaceholder="Search galleries by title or type..."
        emptyMessage={loading ? "Loading galleries..." : "No galleries found in database."}
        onBulkDelete={handleBulkDelete}
      />
    </div>
  )
}
