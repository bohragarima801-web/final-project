'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { PageHeader } from '@/components/admin/page-header'
import { KpiCard } from '@/components/admin/kpi-card'
import { AdminTabs } from '@/components/admin/admin-tabs'
import { Flame, Star, CalendarClock, Video, Edit, Trash2, Search, Filter } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'

export default function PujasPage() {
  const [pujas, setPujas] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [activeTab, setActiveTab] = useState('All')

  // Load pujas from database
  const loadPujas = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/admin/pujas')
      const data = await res.json()
      if (data.ok) {
        setPujas(data.pujas || [])
      } else {
        toast.error(data.error || 'Failed to load pujas')
      }
    } catch (err) {
      console.error('Error fetching pujas:', err)
      toast.error('Network error loading pujas')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadPujas()
  }, [])

  // Delete puja handler
  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return

    try {
      const res = await fetch(`/api/admin/pujas?id=${id}`, {
        method: 'DELETE'
      })
      const data = await res.json()
      if (data.ok) {
        toast.success(`"${name}" deleted successfully`)
        // Refresh local state
        setPujas(pujas.filter(p => p.id !== id))
      } else {
        toast.error(data.error || 'Failed to delete puja')
      }
    } catch (err) {
      console.error('Error deleting puja:', err)
      toast.error('Network error deleting puja')
    }
  }

  // Filter & Search logic
  const filteredPujas = pujas.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || 
                          (p.shortDescription && p.shortDescription.toLowerCase().includes(search.toLowerCase())) ||
                          (p.temple?.name && p.temple.name.toLowerCase().includes(search.toLowerCase()))

    if (activeTab === 'All') return matchesSearch
    if (activeTab === 'Featured') return matchesSearch && p.isFeatured
    if (activeTab === 'VIP') return matchesSearch && p.isVip
    if (activeTab === 'Live') return matchesSearch && p.isOnline
    if (activeTab === 'Drafts') return matchesSearch && p.status === 'DRAFT'
    return matchesSearch
  })

  // Calculate real-time KPI counts
  const totalCount = pujas.length
  const vipCount = pujas.filter(p => p.isVip).length
  const featuredCount = pujas.filter(p => p.isFeatured).length
  const liveCount = pujas.filter(p => p.isOnline).length

  return (
    <div className="space-y-6">
      <PageHeader
        title="Puja Management"
        description="Manage all pujas, categories, slots, media & pricing."
        breadcrumbs={[{ label: 'Admin', href: '/admin' }, { label: 'Pujas' }]}
        action={{ label: 'Add Puja', href: '/admin/pujas/new' }}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard title="Total Pujas" value={String(totalCount)} icon={Flame} />
        <KpiCard title="VIP Pujas" value={String(vipCount)} icon={Star} />
        <KpiCard title="Featured" value={String(featuredCount)} icon={CalendarClock} />
        <KpiCard title="Live (Online)" value={String(liveCount)} icon={Video} iconClass="text-red-500" />
      </div>

      <div className="flex items-center justify-between border-b pb-1">
        <div className="flex items-center gap-1.5 bg-muted p-1 rounded-lg">
          {['All', 'Featured', 'VIP', 'Live', 'Drafts'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                activeTab === tab
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <Card className="overflow-hidden">
        <div className="p-3 flex flex-col sm:flex-row items-stretch sm:items-center gap-2 border-b">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search pujas by name or temple…" 
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
                <th className="px-4 py-3">Puja Name</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Temple</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">VIP Price</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-4 py-16 text-center text-muted-foreground">
                    <span className="animate-pulse">Loading pujas...</span>
                  </td>
                </tr>
              ) : filteredPujas.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-16 text-center text-muted-foreground">
                    No pujas found. Click "Add Puja" to create one.
                  </td>
                </tr>
              ) : (
                filteredPujas.map((p) => (
                  <tr key={p.id} className="hover:bg-muted/10 transition-colors">
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-3">
                        {p.coverImage && (
                          <img src={p.coverImage} alt="" className="h-10 w-10 rounded-md object-cover border" />
                        )}
                        <div>
                          <p className="font-semibold text-foreground">{p.name}</p>
                          <p className="text-[10px] text-muted-foreground font-mono">{p.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground capitalize">
                      {p.category?.name || 'Uncategorized'}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground font-medium">
                      {p.temple?.name || 'All Temples'}
                    </td>
                    <td className="px-4 py-3 font-semibold text-foreground">
                      ₹{parseFloat(p.price || '0').toLocaleString('en-IN')}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {p.vipPrice ? `₹${parseFloat(p.vipPrice).toLocaleString('en-IN')}` : '—'}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${
                        p.status === 'PUBLISHED' 
                          ? 'bg-emerald-100 text-emerald-800' 
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link href={`/admin/pujas/new?id=${p.id}`}>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600 hover:text-blue-700">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-red-600 hover:text-red-700"
                          onClick={() => handleDelete(p.id, p.name)}
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
