'use client'

import { useEffect, useState } from 'react'
import { PageHeader } from '@/components/admin/page-header'
import { KpiCard } from '@/components/admin/kpi-card'
import { DataTableShell } from '@/components/admin/data-table-shell'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Building2, MapPin, Star, Trash2, Loader2, Plus } from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'

export default function TemplesPage() {
  const [temples, setTemples] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  async function loadTemples() {
    try {
      const res = await fetch('/api/admin/temples')
      const data = await res.json()
      if (data.ok) {
        setTemples(data.data || [])
      }
    } catch {
      toast.error('Failed to load temples list')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadTemples()
  }, [])

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this temple?')) return
    try {
      const res = await fetch(`/api/admin/temples?id=${id}`, {
        method: 'DELETE',
      })
      const data = await res.json()
      if (data.ok) {
        toast.success('Temple deleted successfully')
        loadTemples()
      } else {
        toast.error(data.error || 'Failed to delete temple')
      }
    } catch {
      toast.error('Network error deleting temple')
    }
  }

  // KPIs
  const featuredCount = temples.filter(t => t.isFeatured).length
  const uniqueCities = new Set(temples.map(t => t.city).filter(Boolean)).size

  return (
    <div className="space-y-6">
      <PageHeader
        title="Temple Management"
        description="Configure pilgrimage destinations, deities, and gallery images."
        breadcrumbs={[{ label: 'Admin', href: '/admin' }, { label: 'Temples' }]}
        action={{ label: 'Add Temple', href: '/admin/temples/new', icon: Plus }}
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <KpiCard title="Total Temples" value={temples.length.toString()} icon={Building2} />
        <KpiCard title="Featured Temples" value={featuredCount.toString()} icon={Star} iconClass="text-yellow-500" />
        <KpiCard title="Cities Covered" value={uniqueCities.toString()} icon={MapPin} iconClass="text-green-600" />
      </div>

      {loading ? (
        <div className="flex h-48 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <DataTableShell
          columns={[
            {
              key: 'coverImage',
              label: 'Cover',
              render: (r) => (
                <div className="h-10 w-16 bg-slate-100 rounded border overflow-hidden">
                  {r.coverImage ? (
                    <img src={r.coverImage} alt={r.name} className="h-full w-full object-cover" />
                  ) : (
                    <div className="h-full w-full bg-slate-200" />
                  )}
                </div>
              ),
            },
            { key: 'name', label: 'Temple Name' },
            { key: 'deity', label: 'Presiding Deity' },
            { key: 'city', label: 'City' },
            { key: 'state', label: 'State' },
            {
              key: 'isFeatured',
              label: 'Featured',
              render: (r) => (
                <Badge variant={r.isFeatured ? 'default' : 'secondary'}>
                  {r.isFeatured ? '⭐ Yes' : 'No'}
                </Badge>
              ),
            },
            {
              key: 'isActive',
              label: 'Status',
              render: (r) => (
                <Badge
                  variant={r.isActive ? 'success' : 'secondary'}
                  className={r.isActive ? 'bg-green-100 text-green-800' : ''}
                >
                  {r.isActive ? 'Active' : 'Disabled'}
                </Badge>
              ),
            },
            {
              key: 'actions',
              label: 'Actions',
              render: (r) => (
                <Button
                  size="icon"
                  variant="destructive"
                  className="h-8 w-8"
                  onClick={() => handleDelete(r.id)}
                  title="Delete Temple"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              ),
            },
          ]}
          rows={temples}
          searchPlaceholder="Search temples…"
        />
      )}
    </div>
  )
}
