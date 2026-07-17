'use client'

import { useEffect, useState } from 'react'
import { PageHeader } from '@/components/admin/page-header'
import { DataTableShell } from '@/components/admin/data-table-shell'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'
import { Loader2, Plus, Trash2, Star, Upload, User, Sparkles } from 'lucide-react'

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState<any[]>([])
  const [devotees, setDevotees] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [showAddForm, setShowAddForm] = useState(false)

  // Form states
  const [name, setName] = useState('')
  const [location, setLocation] = useState('')
  const [rating, setRating] = useState('5')
  const [message, setMessage] = useState('')
  const [avatar, setAvatar] = useState('')
  const [selectedDevoteeId, setSelectedDevoteeId] = useState('')

  async function loadData() {
    try {
      const res = await fetch('/api/admin/testimonials')
      const data = await res.json()
      if (data.ok) {
        setTestimonials(data.data || [])
      }

      // Fetch devotees list
      const devoteesRes = await fetch('/api/admin/testimonials?mode=devotees')
      const devoteesData = await devoteesRes.json()
      if (devoteesData.ok) {
        setDevotees(devoteesData.data || [])
      }
    } catch {
      toast.error('Failed to load testimonials data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  function handleDevoteeSelect(val: string) {
    setSelectedDevoteeId(val)
    if (val === 'custom') {
      setName('')
      setAvatar('')
      return
    }
    const devotee = devotees.find((d) => d.id === val)
    if (devotee) {
      setName(devotee.fullName || '')
      setAvatar(devotee.avatar || '')
      toast.success(`Selected ${devotee.fullName || 'Devotee'}'s profile info!`)
    }
  }

  async function handleAvatarUpload(e: React.ChangeEvent<HTMLInputElement>) {
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
        setAvatar(data.url)
        toast.success('Devotee photo uploaded!')
      } else {
        toast.error(data.error || 'Upload failed')
      }
    } catch {
      toast.error('Network error uploading avatar')
    } finally {
      setUploading(false)
    }
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    if (!name || !message) return

    setSaving(true)
    try {
      const res = await fetch('/api/admin/testimonials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          location,
          rating: Number(rating),
          message,
          avatar,
        }),
      })
      const data = await res.json()
      if (data.ok) {
        toast.success('Testimonial added successfully!')
        setShowAddForm(false)
        setName('')
        setLocation('')
        setMessage('')
        setAvatar('')
        setSelectedDevoteeId('')
        loadData()
      } else {
        toast.error(data.error || 'Failed to save testimonial')
      }
    } catch {
      toast.error('Network error adding testimonial')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this testimonial?')) return
    try {
      const res = await fetch(`/api/admin/testimonials?id=${id}`, {
        method: 'DELETE',
      })
      const data = await res.json()
      if (data.ok) {
        toast.success('Testimonial deleted successfully')
        loadData()
      } else {
        toast.error(data.error || 'Failed to delete testimonial')
      }
    } catch {
      toast.error('Network error deleting testimonial')
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Testimonials & Devotee Reviews"
        description="Showcase testimonials and reviews on your site. Fetch profile pictures automatically from registered devotees."
        breadcrumbs={[{ label: 'Admin', href: '/admin' }, { label: 'Testimonials' }]}
        action={{
          label: showAddForm ? 'Cancel' : 'Add Testimonial',
          icon: Plus,
          onClick: () => setShowAddForm(!showAddForm),
        }}
      />

      {showAddForm && (
        <Card className="border-2 border-primary/20">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" /> Add New Testimonial
            </CardTitle>
            <CardDescription>
              Select an existing devotee to auto-fetch their name and photo, or type manually.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreate} className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Sync Devotee Profile</Label>
                <Select value={selectedDevoteeId} onValueChange={handleDevoteeSelect}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select devotee (Optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="custom">Custom Devotee (Type manually)</SelectItem>
                    {devotees.map((d) => (
                      <SelectItem key={d.id} value={d.id}>
                        {d.fullName || 'Unnamed'} ({d.email})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">Devotee Name</Label>
                <Input
                  id="name"
                  placeholder="e.g. Ramesh Kumar"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  placeholder="e.g. Haridwar, Uttarakhand"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Rating stars</Label>
                <Select value={rating} onValueChange={setRating}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">⭐⭐⭐⭐⭐ (5 Stars)</SelectItem>
                    <SelectItem value="4">⭐⭐⭐⭐ (4 Stars)</SelectItem>
                    <SelectItem value="3">⭐⭐⭐ (3 Stars)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="message">Message / Review Content</Label>
                <Textarea
                  id="message"
                  placeholder="Type the review content here..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  rows={4}
                />
              </div>

              <div className="space-y-2 sm:col-span-2">
                <Label>Devotee Photo</Label>
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 rounded-full border bg-slate-100 flex items-center justify-center overflow-hidden shrink-0">
                    {avatar ? (
                      <img src={avatar} alt="Avatar Preview" className="h-full w-full object-cover" />
                    ) : (
                      <User className="h-8 w-8 text-muted-foreground opacity-50" />
                    )}
                  </div>
                  <div className="flex-1 space-y-2">
                    <label className="cursor-pointer inline-flex items-center justify-center rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground px-4 py-2 text-sm font-medium gap-2">
                      {uploading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Upload className="h-4 w-4" />
                      )}
                      {uploading ? 'Uploading…' : 'Upload Avatar'}
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleAvatarUpload}
                        disabled={uploading}
                      />
                    </label>
                    <p className="text-[10px] text-muted-foreground">Supported formats: JPG, PNG. Max size 2MB.</p>
                  </div>
                </div>
              </div>

              <div className="sm:col-span-2 pt-2">
                <Button type="submit" disabled={saving}>
                  {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Save Testimonial
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {loading ? (
        <div className="flex h-48 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <DataTableShell
          columns={[
            {
              key: 'avatar',
              label: 'Photo',
              render: (r) => (
                <div className="h-8 w-8 rounded-full bg-slate-100 border overflow-hidden">
                  {r.avatar ? (
                    <img src={r.avatar} alt={r.name} className="h-full w-full object-cover" />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-xs bg-primary/10 text-primary font-bold">
                      {r.name.charAt(0)}
                    </div>
                  )}
                </div>
              ),
            },
            { key: 'name', label: 'Name' },
            { key: 'location', label: 'Location' },
            {
              key: 'rating',
              label: 'Rating',
              render: (r) => (
                <div className="flex gap-0.5">
                  {Array.from({ length: Number(r.rating) }).map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-primary text-primary" />
                  ))}
                </div>
              ),
            },
            {
              key: 'message',
              label: 'Review message',
              render: (r) => <span className="line-clamp-2 max-w-sm text-xs">{r.message}</span>,
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
                  title="Delete Testimonial"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              ),
            },
          ]}
          rows={testimonials}
        />
      )}
    </div>
  )
}
