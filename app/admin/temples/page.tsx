'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { PageHeader } from '@/components/admin/page-header'
import { KpiCard } from '@/components/admin/kpi-card'
import { DataTableShell } from '@/components/admin/data-table-shell'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Building2, MapPin, Star, Trash2, Loader2, Plus, Film, Image as ImageIcon, CalendarDays, Layers } from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'

function TemplesManager() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const activeTab = searchParams.get('tab') || 'all'

  const [temples, setTemples] = useState<any[]>([])
  const [gallery, setGallery] = useState<any[]>([])
  const [events, setEvents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [acting, setActing] = useState(false)

  // Extra form states for Categories / Videos / Gallery
  const [newCatName, setNewCatName] = useState('')
  const [videoUrl, setVideoUrl] = useState('')
  const [videoTitle, setVideoTitle] = useState('')
  
  // Dummy Categories state for temples
  const [categories, setCategories] = useState<string[]>([
    'Jyotirlinga (ज्योतिर्लिंग)', 
    'Shakti Peeth (शक्तिपीठ)', 
    'Vishnu Mandir (विष्णु मंदिर)', 
    'Char Dham (चार धाम)'
  ])

  // Mock videos list
  const [videos, setVideos] = useState<any[]>([
    { id: '1', title: 'Kashi Vishwanath Aarti Live Stream', url: 'https://youtube.com/watch?v=kashi', temple: 'Kashi Vishwanath' },
    { id: '2', title: 'Kedarnath Temple Drone Footage', url: 'https://youtube.com/watch?v=kedarnath', temple: 'Kedarnath Temple' }
  ])

  async function loadData() {
    try {
      setLoading(true)
      // Load temples
      const templesRes = await fetch('/api/admin/temples')
      const templesData = await templesRes.json()
      if (templesData.ok) {
        setTemples(templesData.data || [])
      }

      // Load gallery items
      const galleryRes = await fetch('/api/admin/gallery')
      const galleryData = await galleryRes.json()
      if (galleryData.ok) {
        setGallery(galleryData.data || [])
      }

      // Load events
      const eventsRes = await fetch('/api/admin/events')
      const eventsData = await eventsRes.json()
      if (eventsData.ok) {
        setEvents(eventsData.data || [])
      }
    } catch {
      toast.error('Failed to load temple management data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  async function handleDeleteTemple(id: string) {
    if (!confirm('Are you sure you want to delete this temple?')) return
    try {
      const res = await fetch(`/api/admin/temples?id=${id}`, { method: 'DELETE' })
      const data = await res.json()
      if (data.ok) {
        toast.success('Temple deleted successfully')
        loadData()
      } else {
        toast.error(data.error || 'Failed to delete temple')
      }
    } catch {
      toast.error('Network error deleting temple')
    }
  }

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newCatName.trim()) return
    setCategories([...categories, newCatName.trim()])
    setNewCatName('')
    toast.success('Category added successfully!')
  }

  const handleAddVideo = (e: React.FormEvent) => {
    e.preventDefault()
    if (!videoTitle.trim() || !videoUrl.trim()) return
    setVideos([...videos, { id: Date.now().toString(), title: videoTitle, url: videoUrl, temple: 'General Temple' }])
    setVideoTitle('')
    setVideoUrl('')
    toast.success('Video link added successfully!')
  }

  // Filter tabs bar
  const tabs = [
    { label: 'All Temples', value: 'all' },
    { label: 'Categories', value: 'categories' },
    { label: 'Gallery', value: 'gallery' },
    { label: 'Videos', value: 'videos' },
    { label: 'Events', value: 'events' }
  ]

  const changeTab = (val: string) => {
    router.push(`/admin/temples?tab=${val}`)
  }

  // KPIs
  const featuredCount = temples.filter(t => t.isFeatured).length
  const uniqueCities = new Set(temples.map(t => t.city).filter(Boolean)).size

  return (
    <div className="space-y-6">
      <PageHeader
        title="Temple Management"
        description="Configure pilgrimage destinations, deities, categories, and media library."
        breadcrumbs={[{ label: 'Admin', href: '/admin' }, { label: 'Temples' }]}
        action={activeTab === 'all' ? { label: 'Add Temple', href: '/admin/temples/new', icon: Plus } : undefined}
      />

      {/* Tabs Menu */}
      <div className="flex gap-2 border-b pb-1 overflow-x-auto">
        {tabs.map((t) => (
          <button
            key={t.value}
            onClick={() => changeTab(t.value)}
            className={`px-4 py-2 text-xs font-bold border-b-2 transition-all shrink-0 ${activeTab === t.value ? 'border-orange-500 text-orange-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex h-48 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
        </div>
      ) : (
        <>
          {/* TAB 1: ALL TEMPLES LIST */}
          {activeTab === 'all' && (
            <div className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-3">
                <KpiCard title="Total Temples" value={temples.length.toString()} icon={Building2} />
                <KpiCard title="Featured Temples" value={featuredCount.toString()} icon={Star} iconClass="text-yellow-500" />
                <KpiCard title="Cities Covered" value={uniqueCities.toString()} icon={MapPin} iconClass="text-green-600" />
              </div>

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
                    key: 'actions',
                    label: 'Actions',
                    render: (r) => (
                      <Button
                        size="icon"
                        variant="destructive"
                        className="h-8 w-8"
                        onClick={() => handleDeleteTemple(r.id)}
                        title="Delete Temple"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    ),
                  },
                ]}
                rows={temples}
                searchPlaceholder="Search temples by name or deity…"
              />
            </div>
          )}

          {/* TAB 2: TEMPLE CATEGORIES */}
          {activeTab === 'categories' && (
            <div className="grid gap-6 md:grid-cols-3 items-start">
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle className="text-base">Temple Categories & Lineages</CardTitle>
                </CardHeader>
                <CardContent>
                  <DataTableShell
                    columns={[
                      { key: 'name', label: 'Category Name', render: (r) => <span className="font-bold text-slate-800">{r}</span> },
                      { key: 'type', label: 'Status', render: () => <Badge variant="success">Active</Badge> }
                    ]}
                    rows={categories}
                    searchPlaceholder="Search categories…"
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Add Category</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleAddCategory} className="space-y-4">
                    <div className="space-y-2">
                      <Label>Category Title *</Label>
                      <Input 
                        placeholder="e.g. Shakti Peeth" 
                        value={newCatName}
                        onChange={(e) => setNewCatName(e.target.value)}
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full bg-orange-600 hover:bg-orange-700">Add Category</Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          )}

          {/* TAB 3: GALLERY MANAGER */}
          {activeTab === 'gallery' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider">Temple Photo Gallery</h3>
                <Button asChild variant="outline" size="sm" className="rounded-xl">
                  <Link href="/admin/gallery">Upload New Media <Layers className="h-4 w-4 ml-1" /></Link>
                </Button>
              </div>

              <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
                {gallery.length === 0 ? (
                  <p className="col-span-full text-center py-10 text-xs text-slate-500 italic">No gallery images uploaded yet.</p>
                ) : (
                  gallery.map((g) => (
                    <Card key={g.id} className="overflow-hidden border group relative">
                      <img src={g.imageUrl} alt={g.title} className="aspect-[4/3] object-cover w-full" />
                      <div className="p-3 bg-white border-t">
                        <span className="font-bold text-xs line-clamp-1">{g.title || 'Untitled'}</span>
                        <span className="text-[10px] text-muted-foreground">{g.category || 'General'}</span>
                      </div>
                    </Card>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 4: VIDEOS MANAGER */}
          {activeTab === 'videos' && (
            <div className="grid gap-6 md:grid-cols-3 items-start">
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle className="text-base">Temple Video Streams</CardTitle>
                </CardHeader>
                <CardContent>
                  <DataTableShell
                    columns={[
                      { key: 'title', label: 'Video Title' },
                      { key: 'url', label: 'YouTube / Embed Link', render: (r) => <span className="font-mono text-xs text-orange-600 hover:underline">{r.url}</span> },
                      { key: 'temple', label: 'Temple' }
                    ]}
                    rows={videos}
                    searchPlaceholder="Search videos…"
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Add Video Stream</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleAddVideo} className="space-y-4">
                    <div className="space-y-2">
                      <Label>Video Title *</Label>
                      <Input 
                        placeholder="e.g. Kedarnath Aarti Live" 
                        value={videoTitle}
                        onChange={(e) => setVideoTitle(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>YouTube Embed URL *</Label>
                      <Input 
                        placeholder="https://youtube.com/embed/..." 
                        value={videoUrl}
                        onChange={(e) => setVideoUrl(e.target.value)}
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full bg-orange-600 hover:bg-orange-700">Add Video Link</Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          )}

          {/* TAB 5: EVENTS MANAGER */}
          {activeTab === 'events' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider">Scheduled Temple Events & Festivals</h3>
                <Button asChild variant="outline" size="sm" className="rounded-xl">
                  <Link href="/admin/events">Manage All Events <CalendarDays className="h-4 w-4 ml-1" /></Link>
                </Button>
              </div>

              <DataTableShell
                columns={[
                  { key: 'title', label: 'Event / Festival Title' },
                  { key: 'date', label: 'Event Date', render: (r) => <span>{new Date(r.date).toLocaleDateString('en-IN')}</span> },
                  { key: 'location', label: 'Temple Venue' },
                  { key: 'status', label: 'Status', render: () => <Badge variant="success">Upcoming</Badge> }
                ]}
                rows={events}
                searchPlaceholder="Search scheduled events…"
              />
            </div>
          )}

        </>
      )}
    </div>
  )
}

export default function TemplesPage() {
  return (
    <Suspense fallback={
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
      </div>
    }>
      <TemplesManager />
    </Suspense>
  )
}
