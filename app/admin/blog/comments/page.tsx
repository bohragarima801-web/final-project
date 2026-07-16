'use client'

import { useEffect, useState } from 'react'
import { PageHeader } from '@/components/admin/page-header'
import { DataTableShell } from '@/components/admin/data-table-shell'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Trash2 } from 'lucide-react'
import { toast } from 'sonner'

export default function BlogCommentsPage() {
  const [rows, setRows] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const loadComments = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/admin/blog-comments')
      const json = await res.json()
      if (json.ok) {
        setRows(json.data || [])
      } else {
        toast.error(json.error || 'Failed to load comments')
      }
    } catch (err) {
      console.error('Error fetching blog comments:', err)
      toast.error('Network error loading comments')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadComments()
  }, [])

  // Delete
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this comment?')) return
    try {
      const res = await fetch(`/api/admin/blog-comments?id=${id}`, { method: 'DELETE' })
      const json = await res.json()
      if (json.ok) {
        toast.success('Comment deleted')
        setRows(prev => prev.filter(r => r.id !== id))
      } else {
        toast.error(json.error || 'Failed to delete')
      }
    } catch (err) {
      toast.error('Network error deleting comment')
    }
  }

  // Bulk Actions
  const handleBulkDelete = async (ids: string[]) => {
    try {
      const res = await fetch('/api/admin/blog-comments', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete', ids })
      })
      const json = await res.json()
      if (json.ok) {
        toast.success(`Successfully deleted ${ids.length} comments`)
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
      const res = await fetch('/api/admin/blog-comments', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'status', ids, status })
      })
      const json = await res.json()
      if (json.ok) {
        toast.success(`Updated status for ${ids.length} comments`)
        setRows(prev => prev.map(r => ids.includes(r.id) ? { ...r, status } : r))
      } else {
        toast.error(json.error || 'Failed to update comments status')
      }
    } catch (err) {
      toast.error('Network error bulk updating comments')
    }
  }

  const columns = [
    { 
      key: 'user', 
      label: 'Commenter', 
      render: (r: any) => (
        <div className="flex flex-col">
          <span className="font-semibold text-foreground">{r.user?.fullName || r.authorName || 'Devotee Guest'}</span>
          <span className="text-[10px] text-muted-foreground">{r.user?.email || r.authorEmail || 'N/A'}</span>
        </div>
      )
    },
    { 
      key: 'content', 
      label: 'Comment content', 
      render: (r: any) => <span className="text-muted-foreground text-xs italic font-normal line-clamp-2">"{r.content}"</span> 
    },
    { 
      key: 'blog', 
      label: 'Article / Blog Post', 
      render: (r: any) => <span className="font-medium text-foreground">{r.blog?.title || 'Unknown Post'}</span> 
    },
    { 
      key: 'status', 
      label: 'Moderation', 
      render: (r: any) => (
        <Badge variant={r.status === 'APPROVED' ? 'default' : 'secondary'} className={
          r.status === 'APPROVED' ? 'bg-emerald-500 hover:bg-emerald-600 border-none' : 
          r.status === 'SPAM' ? 'bg-rose-100 text-rose-800 border-none font-bold' : 'bg-amber-100 text-amber-800 border-none'
        }>
          {r.status || 'PENDING'}
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
        title="Blog Comments & Moderation"
        description="Review, approve, or flag reader discussion and devotee feedback on published articles."
        breadcrumbs={[{ label: 'Blog', href: '/admin/blog' }, { label: 'Comments' }]}
      />

      <DataTableShell
        columns={columns}
        rows={rows}
        searchPlaceholder="Search comments by content or author..."
        emptyMessage={loading ? "Loading comments..." : "No comments found."}
        onBulkDelete={handleBulkDelete}
        onBulkStatusChange={handleBulkStatusChange}
        statusOptions={['PENDING', 'APPROVED', 'SPAM']}
      />
    </div>
  )
}
