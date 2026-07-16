'use client'

import { useEffect, useState } from 'react'
import { PageHeader } from '@/components/admin/page-header'
import { DataTableShell } from '@/components/admin/data-table-shell'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Trash2, File, Image as ImgIcon, Film, Layers } from 'lucide-react'
import { toast } from 'sonner'

export default function MediaLibraryPage() {
  const [rows, setRows] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const loadMedia = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/admin/media')
      const json = await res.json()
      if (json.ok) {
        setRows(json.data || [])
      } else {
        toast.error(json.error || 'Failed to load media items')
      }
    } catch (err) {
      console.error('Error fetching media:', err)
      toast.error('Network error loading media')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadMedia()
  }, [])

  // Delete
  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}" from media library? This will delete the database record.`)) return
    try {
      const res = await fetch(`/api/admin/media?id=${id}`, { method: 'DELETE' })
      const json = await res.json()
      if (json.ok) {
        toast.success(`Media "${name}" deleted`)
        setRows(prev => prev.filter(r => r.id !== id))
      } else {
        toast.error(json.error || 'Failed to delete media item')
      }
    } catch (err) {
      toast.error('Network error during deletion')
    }
  }

  // Bulk Actions
  const handleBulkDelete = async (ids: string[]) => {
    try {
      const res = await fetch('/api/admin/media', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete', ids })
      })
      const json = await res.json()
      if (json.ok) {
        toast.success(`Deleted ${ids.length} media files`)
        setRows(prev => prev.filter(r => !ids.includes(r.id)))
      } else {
        toast.error(json.error || 'Failed to bulk delete')
      }
    } catch (err) {
      toast.error('Network error bulk deleting files')
    }
  }

  // Format bytes helper
  const formatBytes = (bytes: number) => {
    if (!bytes) return '—'
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    return parseFloat((bytes / Math.pow(1024, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const columns = [
    { 
      key: 'filename', 
      label: 'File Name & Preview', 
      render: (r: any) => (
        <div className="flex items-center gap-3">
          {r.type === 'IMAGE' || r.mimeType?.startsWith('image/') ? (
            <img src={r.url} alt="" className="h-10 w-12 rounded object-cover border" />
          ) : r.type === 'VIDEO' ? (
            <div className="h-10 w-12 bg-amber-500/10 rounded flex items-center justify-center text-amber-600">
              <Film className="h-4 w-4" />
            </div>
          ) : (
            <div className="h-10 w-12 bg-muted rounded flex items-center justify-center text-muted-foreground">
              <File className="h-4 w-4" />
            </div>
          )}
          <div className="max-w-xs truncate">
            <span className="font-semibold text-foreground block truncate">{r.filename || 'Unnamed File'}</span>
            <span className="text-[10px] text-muted-foreground font-mono block truncate">{r.url}</span>
          </div>
        </div>
      )
    },
    { 
      key: 'type', 
      label: 'Type', 
      render: (r: any) => (
        <Badge variant="outline" className="text-[10px] border-none bg-muted font-bold text-foreground">
          {r.type || 'DOCUMENT'}
        </Badge>
      )
    },
    { 
      key: 'size', 
      label: 'File Size', 
      render: (r: any) => <span className="text-xs font-semibold">{formatBytes(r.size)}</span> 
    },
    { 
      key: 'mimeType', 
      label: 'Mime Type', 
      render: (r: any) => <span className="font-mono text-xs text-muted-foreground">{r.mimeType || '—'}</span> 
    },
    { 
      key: 'createdAt', 
      label: 'Uploaded On', 
      render: (r: any) => <span className="text-muted-foreground text-xs">{new Date(r.createdAt).toLocaleDateString('en-IN', { dateStyle: 'medium' })}</span> 
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
          onClick={() => handleDelete(r.id, r.filename || 'Unnamed file')}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      )
    }
  ]

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Media Library" 
        description="View and manage all uploaded files, temple banners, and product attachments across the platform."
        breadcrumbs={[{ label: 'Admin', href: '/admin' }, { label: 'Media' }]} 
      />

      <DataTableShell
        columns={columns}
        rows={rows}
        searchPlaceholder="Search files by name..."
        emptyMessage={loading ? "Loading media library..." : "No media items uploaded yet."}
        onBulkDelete={handleBulkDelete}
      />
    </div>
  )
}
