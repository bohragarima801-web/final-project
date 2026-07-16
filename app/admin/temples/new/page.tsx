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

function TempleFormContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const id = searchParams.get('id') // Edit mode ID

  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)

  // Form states
  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [deity, setDeity] = useState('')
  const [description, setDescription] = useState('')
  const [address, setAddress] = useState('')
  const [city, setCity] = useState('')
  const [state, setState] = useState('')
  const [pincode, setPincode] = useState('')
  const [isFeatured, setIsFeatured] = useState(false)
  const [isActive, setIsActive] = useState(true)
  const [coverImage, setCoverImage] = useState('')

  // Load existing temple if edit mode
  useEffect(() => {
    async function loadTemple() {
      if (!id) return
      try {
        setLoading(true)
        const res = await fetch('/api/admin/temples')
        const data = await res.json()
        if (data.ok) {
          const existing = data.temples.find((t: any) => t.id === id)
          if (existing) {
            setName(existing.name || '')
            setSlug(existing.slug || '')
            setDeity(existing.deity || '')
            setDescription(existing.description || '')
            setAddress(existing.address || '')
            setCity(existing.city || '')
            setState(existing.state || '')
            setPincode(existing.pincode || '')
            setIsFeatured(!!existing.isFeatured)
            setIsActive(!!existing.isActive)
            setCoverImage(existing.coverImage || '')
          } else {
            toast.error('Temple not found')
          }
        }
      } catch (err) {
        console.error('Error loading temple details:', err)
        toast.error('Failed to load temple data')
      } finally {
        setLoading(false)
      }
    }

    loadTemple()
  }, [id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name) return toast.error('Temple name is required')

    try {
      setSaving(true)
      const res = await fetch('/api/admin/temples', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: id || undefined,
          name,
          slug,
          deity,
          description,
          address,
          city,
          state,
          pincode,
          isFeatured,
          isActive,
          coverImage
        })
      })

      const data = await res.json()
      if (data.ok) {
        toast.success(id ? 'Temple updated successfully!' : 'Temple added successfully!')
        router.push('/admin/temples')
        router.refresh()
      } else {
        toast.error(data.error || 'Failed to save temple')
      }
    } catch (err) {
      console.error('Error saving temple:', err)
      toast.error('Network error saving temple')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="animate-pulse text-muted-foreground">Loading temple details...</span>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="templeName">Temple Name *</Label>
              <Input
                id="templeName"
                value={name}
                onChange={(e) => {
                  setName(e.target.value)
                  if (!id) {
                    setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-'))
                  }
                }}
                placeholder="e.g. Kashi Vishwanath"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="templeSlug">Slug (URL Path)</Label>
              <Input
                id="templeSlug"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="kashi-vishwanath"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="deity">Presiding Deity</Label>
              <Input
                id="deity"
                value={deity}
                onChange={(e) => setDeity(e.target.value)}
                placeholder="Lord Shiva"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                rows={5}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="About the temple, history & significance…"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Location</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Detailed location"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Varanasi"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="state">State</Label>
              <Input
                id="state"
                value={state}
                onChange={(e) => setState(e.target.value)}
                placeholder="Uttar Pradesh"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pincode">Pincode</Label>
              <Input
                id="pincode"
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                placeholder="221001"
              />
            </div>
            <div className="space-y-2">
              <Label>Country</Label>
              <Input value="India" disabled />
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
              <Label htmlFor="isFeatured">Featured</Label>
              <Switch id="isFeatured" checked={isFeatured} onCheckedChange={setIsFeatured} />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="isActive">Active</Label>
              <Switch id="isActive" checked={isActive} onCheckedChange={setIsActive} />
            </div>
            <Button type="submit" className="w-full" disabled={saving}>
              {saving ? 'Saving...' : id ? 'Update Temple' : 'Save Temple'}
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
              label="Upload Cover Image"
              aspectRatio="video"
            />
            <p className="text-xs text-muted-foreground">Recommended high-quality landscape image.</p>
          </CardContent>
        </Card>
      </div>
    </form>
  )
}

export default function NewTemplePage() {
  const searchParams = useSearchParams()
  const id = searchParams.get('id')

  return (
    <Suspense fallback={<div>Loading form...</div>}>
      <div className="space-y-6">
        <PageHeader
          title={id ? "Edit Temple" : "Add Temple"}
          description={id ? "Modify temple information, deity, and cover banners." : "Create a new temple entry with location, timings and media."}
          breadcrumbs={[{ label: 'Temples', href: '/admin/temples' }, { label: id ? 'Edit' : 'New' }]}
        />
        <TempleFormContent />
      </div>
    </Suspense>
  )
}
