'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { PageHeader } from '@/components/admin/page-header'
import { KpiCard } from '@/components/admin/kpi-card'
import { Building2, MapPin, Star, Edit, Trash2, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'

export default function TemplesPage() {
  const [temples, setTemples] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  const loadTemples = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/admin/temples')
      const data = await res.json()
      if (data.ok) {
        setTemples(data.temples || [])
      } else {
        toast.error(data.error || 'Failed to load temples')
      }
    } catch (err) {
      console.error('Error fetching temples:', err)
      toast.error('Network error loading temples')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadTemples()
  }, [])

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return

    try {
      const res = await fetch(`/api/admin/temples?id=${id}`, {
        method: 'DELETE'
      })
      const data = await res.json()
      if (data.ok) {
        toast.success(`"${name}" deleted successfully`)
        setTemples(temples.filter(t => t.id !== id))
      } else {
        toast.error(data.error || 'Failed to delete temple')
      }
    } catch (err) {
      console.error('Error deleting temple:', err)
      toast.error('Network error deleting temple')
    }
  }

  const filteredTemples = temples.filter(t => 
    t.name.toLowerCase().includes(search.toLowerCase()) ||
    (t.deity && t.deity.toLowerCase().includes(search.toLowerCase())) ||
    (t.city && t.city.toLowerCase().includes(search.toLowerCase())) ||
    (t.state && t.state.toLowerCase().includes(search.toLowerCase()))
  )

  const totalCount = temples.length
  const featuredCount = temples.filter(t => t.isFeatured).length
  const activeCount = temples.filter(t => t.isActive).length
  const citiesCount = new Set(temples.map(t => t.city).filter(Boolean)).size

  return (
    <div className="space-y-6">
      <PageHeader
        title="Temple Management"
        description="Manage temples, locations, timings and associated deities."
        breadcrumbs={[{ label: 'Admin', href: '/admin' }, { label: 'Temples' }]}
        action={{ label: 'Add Temple', href: '/admin/temples/new' }}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard title="Total Temples" value={String(totalCount)} icon={Building2} />
        <KpiCard title="Featured" value={String(featuredCount)} icon={Star} />
        <KpiCard title="Active Enrolled" value={String(activeCount)} icon={Building2} iconClass="text-emerald-500" />
        <KpiCard title="Total Locations" value={String(citiesCount)} icon={MapPin} iconClass="text-orange-500" />
      </div>

      <Card className="overflow-hidden">
        <div className="p-3 flex flex-col sm:flex-row items-stretch sm:items-center gap-2 border-b">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search temples by name, deity, or city…" 
              className="pl-9 h-9" 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr className="text-left font-medium text-muted-foreground text-xs">
                <th className="px-4 py-3">Temple Name</th>
                <th className="px-4 py-3">Presiding Deity</th>
                <th className="px-4 py-3">City</th>
                <th className="px-4 py-3">State</th>
                <th className="px-4 py-3">Featured</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-4 py-16 text-center text-muted-foreground">
                    <span className="animate-pulse">Loading temples...</span>
                  </td>
                </tr>
              ) : filteredTemples.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-16 text-center text-muted-foreground">
                    No temples found. Click "Add Temple" to create one.
                  </td>
                </tr>
              ) : (
                filteredTemples.map((t) => (
                  <tr key={t.id} className="hover:bg-muted/10 transition-colors">
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-3">
                        {t.coverImage && (
                          <img src={t.coverImage} alt="" className="h-10 w-10 rounded-md object-cover border" />
                        )}
                        <div>
                          <p className="font-semibold text-foreground">{t.name}</p>
                          <p className="text-[10px] text-muted-foreground font-mono">{t.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground font-medium">
                      {t.deity || 'Lord Shiva'}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {t.city || '—'}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {t.state || '—'}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${
                        t.isFeatured 
                          ? 'bg-amber-100 text-amber-800' 
                          : 'bg-muted text-muted-foreground'
                      }`}>
                        {t.isFeatured ? 'Yes' : 'No'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${
                        t.isActive 
                          ? 'bg-emerald-100 text-emerald-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {t.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link href={`/admin/temples/new?id=${t.id}`}>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600 hover:text-blue-700">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-red-600 hover:text-red-700"
                          onClick={() => handleDelete(t.id, t.name)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
