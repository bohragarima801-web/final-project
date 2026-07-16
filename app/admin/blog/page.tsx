'use client'

import { useEffect, useState } from 'react'
import { PageHeader } from '@/components/admin/page-header'
import { KpiCard } from '@/components/admin/kpi-card'
import { DataTableShell } from '@/components/admin/data-table-shell'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Newspaper, FileText, MessageSquare, Eye, Trash2 } from 'lucide-react'
import { toast } from 'sonner'

export default function BlogPage() {
  const [rows, setRows] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const loadBlogs = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/admin/blogs')
      const json = await res.json()
      if (json.ok) {
        setRows(json.data || [])
      } else {
        toast.error(json.error || 'Failed to load blog posts')
      }
    } catch (err) {
      console.error('Error fetching blogs:', err)
      toast.error('Network error loading blogs')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadBlogs()
  }, [])

  // Delete
  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete blog post "${title}"?`)) return
    try {
      const res = await fetch(`/api/admin/blogs?id=${id}`, { method: 'DELETE' })
      const json = await res.json()
      if (json.ok) {
        toast.success(`Post "${title}" deleted`)
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
      const res = await fetch('/api/admin/blogs', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete', ids })
      })
      const json = await res.json()
      if (json.ok) {
        toast.success(`Successfully deleted ${ids.length} posts`)
        setRows(prev => prev.filter(r => !ids.includes(r.id)))
      } else {
        toast.error(json.error || 'Failed to bulk delete')
      }
    } catch (err) {
      toast.error('Network error bulk deleting posts')
    }
  }

  const handleBulkStatusChange = async (ids: string[], status: string) => {
    try {
      const res = await fetch('/api/admin/blogs', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'status', ids, status })
      })
      const json = await res.json()
      if (json.ok) {
        toast.success(`Updated status for ${ids.length} posts`)
        setRows(prev => prev.map(r => ids.includes(r.id) ? { ...r, status } : r))
      } else {
        toast.error(json.error || 'Failed to update status')
      }
    } catch (err) {
      toast.error('Network error during bulk update')
    }
  }

  // KPIs
  const totalCount = rows.length
  const publishedCount = rows.filter(r => r.isActive || r.status === 'PUBLISHED').length
  const draftCount = totalCount - publishedCount
  const totalViews = rows.reduce((acc, r) => acc + (r.viewsCount || r.views || 0), 0)

  const columns = [
    { 
      key: 'title', 
      label: 'Article Title', 
      render: (r: any) => (
        <div className="flex items-center gap-3">
          {r.coverImage ? (
            <img src={r.coverImage} alt="" className="h-10 w-12 rounded object-cover border" />
          ) : (
            <div className="h-10 w-12 bg-muted rounded flex items-center justify-center text-muted-foreground">
              <Newspaper className="h-4 w-4" />
            </div>
          )}
          <div>
            <span className="font-semibold text-foreground block">{r.title}</span>
            <span className="text-[10px] text-muted-foreground font-mono">{r.slug}</span>
          </div>
        </div>
      )
    },
    { 
      key: 'author', 
      label: 'Author', 
      render: (r: any) => <span>{r.author?.fullName || r.authorName || 'Administrator'}</span> 
    },
    { 
      key: 'category', 
      label: 'Category', 
      render: (r: any) => <Badge variant="outline" className="capitalize bg-muted border-none text-foreground font-medium">{r.category?.name || r.categoryName || 'General'}</Badge> 
    },
    { 
      key: 'status', 
      label: 'Status', 
      render: (r: any) => (
        <Badge variant={(r.isActive || r.status === 'PUBLISHED') ? 'default' : 'secondary'} className={(r.isActive || r.status === 'PUBLISHED') ? 'bg-emerald-500 hover:bg-emerald-600 border-none' : ''}>
          {r.isActive || r.status === 'PUBLISHED' ? 'PUBLISHED' : 'DRAFT'}
        </Badge>
      )
    },
    { 
      key: 'viewsCount', 
      label: 'Total Views', 
      render: (r: any) => <span className="font-mono text-xs font-bold">{r.viewsCount || r.views || 0}</span> 
    },
    { 
      key: 'createdAt', 
      label: 'Created Date', 
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
        title="Spiritual Articles & Blog"
        description="Author, publish, edit, and organize devotional, astronomical, and philosophical articles."
        breadcrumbs={[{ label: 'Admin', href: '/admin' }, { label: 'Blog' }]}
        action={{ label: 'New Post', href: '/admin/blog/new' }}
        secondaryAction={{ label: 'Categories', href: '/admin/blog/categories' }}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard title="Total Articles" value={String(totalCount)} icon={Newspaper} />
        <KpiCard title="Published" value={String(publishedCount)} icon={FileText} iconClass="text-emerald-500" />
        <KpiCard title="Drafts/Archived" value={String(draftCount)} icon={MessageSquare} iconClass="text-amber-500" />
        <KpiCard title="Total Views" value={String(totalViews)} icon={Eye} iconClass="text-blue-500" />
      </div>

      <DataTableShell
        columns={columns}
        rows={rows}
        searchPlaceholder="Search blogs by title or author..."
        emptyMessage={loading ? "Loading articles..." : "No articles found in database."}
        onBulkDelete={handleBulkDelete}
        onBulkStatusChange={handleBulkStatusChange}
      />
    </div>
  )
}
