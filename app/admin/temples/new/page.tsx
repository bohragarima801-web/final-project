'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { PageHeader } from '@/components/admin/page-header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { toast } from 'sonner'
import { Loader2, Upload, ImageIcon } from 'lucide-react'

export default function NewTemplePage() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)

  // Form states
  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [deity, setDeity] = useState('')
  const [description, setDescription] = useState('')
  const [address, setAddress] = useState('')
  const [city, setCity] = useState('')
  const [state, setState] = useState('')
  const [pincode, setPincode] = useState('')
  const [coverImage, setCoverImage] = useState('')
  const [isFeatured, setIsFeatured] = useState(false)
  const [isActive, setIsActive] = useState(true)

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    const formData = new FormData()
    formData.append('file', file)

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })
      const data = await res.json()
      if (data.ok) {
        setCoverImage(data.url)
        toast.success('Temple cover image uploaded!')
      } else {
        toast.error(data.error || 'Upload failed')
      }
    } catch {
      toast.error('Network error uploading cover image')
    } finally {
      setUploading(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name) return

    setSaving(true)
    try {
      const res = await fetch('/api/admin/temples', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          slug,
          deity,
          description,
          address,
          city,
          state,
          pincode,
          coverImage,
          isFeatured,
          isActive,
        }),
      })
      const data = await res.json()
      if (data.ok) {
        toast.success('Temple created successfully!')
        router.push('/admin/temples')
      } else {
        toast.error(data.error || 'Failed to save temple')
      }
    } catch {
      toast.error('Network error saving temple')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Add Temple"
        description="Create a new temple entry with location, timings and media."
        breadcrumbs={[{ label: 'Temples', href: '/admin/temples' }, { label: 'New' }]}
      />
      <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="tName">Temple Name *</Label>
                <Input
                  id="tName"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Kashi Vishwanath"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tSlug">Slug</Label>
                <Input
                  id="tSlug"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="kashi-vishwanath"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tDeity">Presiding Deity</Label>
                <Input
                  id="tDeity"
                  value={deity}
                  onChange={(e) => setDeity(e.target.value)}
                  placeholder="e.g. Lord Shiva"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tDesc">Description</Label>
                <Textarea
                  id="tDesc"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={5}
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
                <Label htmlFor="tAddr">Address</Label>
                <Input id="tAddr" value={address} onChange={(e) => setAddress(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tCity">City</Label>
                <Input id="tCity" value={city} onChange={(e) => setCity(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tState">State</Label>
                <Input id="tState" value={state} onChange={(e) => setState(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tPin">Pincode</Label>
                <Input id="tPin" value={pincode} onChange={(e) => setPincode(e.target.value)} />
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
                <Label>Featured</Label>
                <Switch checked={isFeatured} onCheckedChange={setIsFeatured} />
              </div>
              <div className="flex items-center justify-between">
                <Label>Active</Label>
                <Switch checked={isActive} onCheckedChange={setIsActive} />
              </div>
              <Button type="submit" className="w-full" disabled={saving}>
                {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Temple
              </Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Cover Image</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="aspect-[16/9] rounded border bg-slate-100 flex items-center justify-center overflow-hidden">
                {coverImage ? (
                  <img src={coverImage} alt="Cover Preview" className="h-full w-full object-cover" />
                ) : (
                  <ImageIcon className="h-10 w-10 text-muted-foreground opacity-50" />
                )}
              </div>
              <label className="cursor-pointer inline-flex items-center justify-center rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground px-4 py-2 text-sm font-medium gap-2 w-full">
                {uploading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Upload className="h-4 w-4" />
                )}
                {uploading ? 'Uploading…' : 'Upload Cover'}
                {/* <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                  disabled={uploading}
                /> - Disabled for Vercel */}
              </label>
              <Input type="text" value={coverImage} onChange={(e) => setCoverImage(e.target.value)} placeholder="Or paste image URL (e.g. Google Drive)" className="mt-2 text-xs" />
            </CardContent>
          </Card>
        </div>
      </form>
    </div>
  )
}
