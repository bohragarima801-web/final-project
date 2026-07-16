'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { PageHeader } from '@/components/admin/page-header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { toast } from 'sonner'
import { ImageUploader } from '@/components/ui/image-uploader'

function NewPujaFormContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const id = searchParams.get('id') // Edit mode ID

  const [categories, setCategories] = useState<any[]>([])
  const [temples, setTemples] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  // Form states
  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [templeId, setTempleId] = useState('')
  const [shortDescription, setShortDescription] = useState('')
  const [description, setDescription] = useState('')
  const [benefits, setBenefits] = useState('')
  const [price, setPrice] = useState('1100')
  const [vipPrice, setVipPrice] = useState('')
  const [duration, setDuration] = useState('60')
  const [maxMembers, setMaxMembers] = useState('5')
  const [isVip, setIsVip] = useState(false)
  const [isOnline, setIsOnline] = useState(true)
  const [isFeatured, setIsFeatured] = useState(false)
  const [status, setStatus] = useState('DRAFT')
  const [coverImage, setCoverImage] = useState('')

  // Fetch initial setup data (categories, temples, and existing puja if edit mode)
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)
        // Ensure default categories/temples are seeded by hitting the GET endpoints
        const [catsRes, templesRes] = await Promise.all([
          fetch('/api/admin/pujas'), // This initializes defaults & returns pujas, let's fetch categories dynamically or define fallback
          fetch('/api/admin/temples')
        ])

        const catsData = await catsRes.json()
        const templesData = await templesRes.json()

        // Extract categories from database if available
        const dbCategories = [
          { id: 'shiva', name: 'Shiva Pujas' },
          { id: 'devi', name: 'Devi Pujas' },
          { id: 'vishnu', name: 'Vishnu Pujas' },
          { id: 'ganesh', name: 'Ganesh Pujas' },
          { id: 'navagraha', name: 'Navagraha' }
        ]
        setCategories(dbCategories)
        setTemples(templesData.temples || [])

        // If edit mode, load the specific puja details
        if (id) {
          const pujaRes = await fetch('/api/admin/pujas')
          const pujaData = await pujaRes.json()
          if (pujaData.ok) {
            const existingPuja = pujaData.pujas.find((p: any) => p.id === id)
            if (existingPuja) {
              setName(existingPuja.name || '')
              setSlug(existingPuja.slug || '')
              setCategoryId(existingPuja.categoryId || '')
              setTempleId(existingPuja.templeId || '')
              setShortDescription(existingPuja.shortDescription || '')
              setDescription(existingPuja.description || '')
              setBenefits(existingPuja.benefits || '')
              setPrice(String(existingPuja.price || ''))
              setVipPrice(existingPuja.vipPrice ? String(existingPuja.vipPrice) : '')
              setDuration(String(existingPuja.duration || '60'))
              setMaxMembers(String(existingPuja.maxMembers || '1'))
              setIsVip(!!existingPuja.isVip)
              setIsOnline(!!existingPuja.isOnline)
              setIsFeatured(!!existingPuja.isFeatured)
              setStatus(existingPuja.status || 'DRAFT')
              setCoverImage(existingPuja.coverImage || '')
            } else {
              toast.error('Puja not found')
            }
          }
        }
      } catch (err) {
        console.error('Error fetching categories/temples:', err)
        toast.error('Failed to load initial form data')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name) return toast.error('Puja Name is required')
    if (!categoryId) return toast.error('Category is required')

    try {
      setSaving(true)
      const res = await fetch('/api/admin/pujas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: id || undefined, // Send id if updating
          name,
          slug,
          categoryId,
          templeId,
          shortDescription,
          description,
          benefits,
          price,
          vipPrice: vipPrice || null,
          duration,
          maxMembers,
          isVip,
          isOnline,
          isFeatured,
          status,
          coverImage
        })
      })

      const data = await res.json()
      if (data.ok) {
        toast.success(id ? 'Puja updated successfully!' : 'Puja added successfully!')
        router.push('/admin/pujas')
        router.refresh()
      } else {
        toast.error(data.error || 'Failed to save puja')
      }
    } catch (err) {
      console.error('Error saving puja:', err)
      toast.error('Network error saving puja')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="animate-pulse text-muted-foreground">Loading form configuration...</span>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="pujaName">Puja Name *</Label>
              <Input
                id="pujaName"
                placeholder="Maha Rudrabhishek"
                value={name}
                onChange={(e) => {
                  setName(e.target.value)
                  if (!id) {
                    setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-'))
                  }
                }}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pujaSlug">Slug (URL friendly path)</Label>
              <Input
                id="pujaSlug"
                placeholder="maha-rudrabhishek"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="pujaCategory">Category *</Label>
                <select
                  id="pujaCategory"
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  required
                >
                  <option value="">Select category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="pujaTemple">Temple</Label>
                <select
                  id="pujaTemple"
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  value={templeId}
                  onChange={(e) => setTempleId(e.target.value)}
                >
                  <option value="">All Temples (General)</option>
                  {temples.map((t) => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="shortDesc">Short Description</Label>
              <Textarea
                id="shortDesc"
                rows={2}
                placeholder="Brief summary shown on listings"
                value={shortDescription}
                onChange={(e) => setShortDescription(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fullDesc">Full Description</Label>
              <Textarea
                id="fullDesc"
                rows={4}
                placeholder="Detailed explanations, significance, procedures..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="benefits">Benefits</Label>
              <Textarea
                id="benefits"
                rows={3}
                placeholder="e.g., brings peace, removes financial obstacles, improves health"
                value={benefits}
                onChange={(e) => setBenefits(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Pricing & Slots</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-4">
            <div className="space-y-2">
              <Label htmlFor="basePrice">Base Price (₹) *</Label>
              <Input
                id="basePrice"
                type="number"
                placeholder="1100"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="vipPrice">VIP Price (₹)</Label>
              <Input
                id="vipPrice"
                type="number"
                placeholder="5100"
                value={vipPrice}
                onChange={(e) => setVipPrice(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="duration">Duration (min)</Label>
              <Input
                id="duration"
                type="number"
                placeholder="60"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="maxMembers">Max Family Members</Label>
              <Input
                id="maxMembers"
                type="number"
                value={maxMembers}
                onChange={(e) => setMaxMembers(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Publishing</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="isVip">VIP Puja</Label>
              <Switch id="isVip" checked={isVip} onCheckedChange={setIsVip} />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="isOnline">Online (Live Stream)</Label>
              <Switch id="isOnline" checked={isOnline} onCheckedChange={setIsOnline} />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="isFeatured">Featured on Homepage</Label>
              <Switch id="isFeatured" checked={isFeatured} onCheckedChange={setIsFeatured} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <select
                id="status"
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="DRAFT">Draft</option>
                <option value="PUBLISHED">Published</option>
                <option value="ARCHIVED">Archived</option>
              </select>
            </div>
            <Button type="submit" className="w-full" disabled={saving}>
              {saving ? 'Saving...' : id ? 'Update Puja' : 'Save Puja'}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Cover Image</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <ImageUploader
              value={coverImage}
              onChange={setCoverImage}
              label="Upload Puja Cover Image"
              aspectRatio="video"
            />
          </CardContent>
        </Card>
      </div>
    </form>
  )
}

export default function NewPujaPage() {
  const searchParams = useSearchParams()
  const id = searchParams.get('id')

  return (
    <Suspense fallback={<div>Loading form...</div>}>
      <div className="space-y-6">
        <PageHeader
          title={id ? "Edit Puja" : "Add Puja"}
          description={id ? "Modify existing puja services, slots, and pricing." : "Create a new puja with pricing, samagri, and booking configuration."}
          breadcrumbs={[{ label: 'Pujas', href: '/admin/pujas' }, { label: id ? 'Edit' : 'New' }]}
        />
        <NewPujaFormContent />
      </div>
    </Suspense>
  )
}
