'use client'

import { useEffect, useState } from 'react'
import { PageHeader } from '@/components/admin/page-header'
import { DataTableShell } from '@/components/admin/data-table-shell'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Trash2 } from 'lucide-react'
import { toast } from 'sonner'

export default function BlogCategoriesPage() {
  const [rows, setRows] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const loadCategories = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/admin/blog-categories')
      const json = await res.json()
      if (json.ok) {
        setRows(json.data || [])
      } else {
        toast.error(json.error || 'Failed to load blog categories')
      }
    } catch (err) {
      console.error('Error fetching blog categories:', err)
      toast.error('Network error loading categories')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadCategories()
  }, [])

  // Delete
  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete blog category "${name}"?`)) return
    try {
      const res = await fetch(`/api/admin/blog-categories?id=${id}`, { method: 'DELETE' })
      const json = await res.json()
      if (json.ok) {
        toast.success(`Category "${name}" deleted`)
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
      const res = await fetch('/api/admin/blog-categories', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete', ids })
      })
      const json = await res.json()
      if (json.ok) {
        toast.success(`Successfully deleted ${ids.length} categories`)
        setRows(prev => prev.filter(r => !ids.includes(r.id)))
      } else {
        toast.error(json.error || 'Failed to bulk delete')
      }
    } catch (err) {
      toast.error('Network error bulk deleting categories')
    }
  }

  const columns = [
    { key: 'name', label: 'Category Name', className: 'font-semibold' },
    { key: 'slug', label: 'URL Slug', render: (r: any) => <span className="font-mono text-xs text-muted-foreground">{r.slug}</span> },
    { key: 'description', label: 'Description', render: (r: any) => <span className="text-muted-foreground text-xs">{r.description || '—'}</span> },
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
        title="Blog Categories"
        description="Categorize spiritual blogs, temple news, astrology write-ups, and customer announcements."
        breadcrumbs={[{ label: 'Blog', href: '/admin/blog' }, { label: 'Categories' }]}
      />

      <DataTableShell
        columns={columns}
        rows={rows}
        searchPlaceholder="Search categories..."
        emptyMessage={loading ? "Loading categories..." : "No categories found in database."}
        onBulkDelete={handleBulkDelete}
      />
    </div>
  )
}
