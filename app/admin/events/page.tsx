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
import { Switch } from '@/components/ui/switch'
import { toast } from 'sonner'
import { Loader2, Plus, Trash2, Calendar, Video, MapPin, Upload } from 'lucide-react'

export default function EventsPage() {
  const [events, setEvents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [showAddForm, setShowAddForm] = useState(false)

  // Form states
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [coverImage, setCoverImage] = useState('')
  const [location, setLocation] = useState('')
  const [startsAt, setStartsAt] = useState('')
  const [endsAt, setEndsAt] = useState('')
  const [isLive, setIsLive] = useState(false)
  const [streamUrl, setStreamUrl] = useState('')

  async function loadEvents() {
    try {
      const res = await fetch('/api/admin/events')
      const data = await res.json()
      if (data.ok) {
        setEvents(data.data || [])
      }
    } catch {
      toast.error('Failed to load events list')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadEvents()
  }, [])

  async function handleCoverUpload(e: React.ChangeEvent<HTMLInputElement>) {
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
        toast.success('Cover image uploaded!')
      } else {
        toast.error(data.error || 'Upload failed')
      }
    } catch {
      toast.error('Network error uploading image')
    } finally {
      setUploading(false)
    }
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    if (!title || !startsAt) return

    setSaving(true)
    try {
      const res = await fetch('/api/admin/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description,
          coverImage,
          location,
          startsAt: new Date(startsAt).toISOString(),
          endsAt: endsAt ? new Date(endsAt).toISOString() : null,
          isLive,
          streamUrl,
        }),
      })
      const data = await res.json()
      if (data.ok) {
        toast.success('Event created and scheduled successfully!')
        setShowAddForm(false)
        setTitle('')
        setDescription('')
        setCoverImage('')
        setLocation('')
        setStartsAt('')
        setEndsAt('')
        setIsLive(false)
        setStreamUrl('')
        loadEvents()
      } else {
        toast.error(data.error || 'Failed to create event')
      }
    } catch {
      toast.error('Network error creating event')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this event?')) return
    try {
      const res = await fetch(`/api/admin/events?id=${id}`, {
        method: 'DELETE',
      })
      const data = await res.json()
      if (data.ok) {
        toast.success('Event deleted successfully')
        loadEvents()
      } else {
        toast.error(data.error || 'Failed to delete event')
      }
    } catch {
      toast.error('Network error deleting event')
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Spiritual Events & Live Streams"
        description="Schedule live aarti broadcasts, virtual festivals, and dynamic temple programs."
        breadcrumbs={[{ label: 'Admin', href: '/admin' }, { label: 'Events' }]}
        action={{
          label: showAddForm ? 'Cancel' : 'Add Event',
          icon: Plus,
          onClick: () => setShowAddForm(!showAddForm),
        }}
      />

      {showAddForm && (
        <Card className="border-2 border-primary/20">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" /> Schedule New Event
            </CardTitle>
            <CardDescription>Configure festival timings, livestream urls and location details.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreate} className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="title">Event Title</Label>
                <Input
                  id="title"
                  placeholder="e.g. Sawan Somwar Maha Aarti"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location / Temple</Label>
                <Input
                  id="location"
                  placeholder="e.g. Somnath Temple, Gujarat"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="startsAt">Starts At (Date & Time)</Label>
                <Input
                  id="startsAt"
                  type="datetime-local"
                  value={startsAt}
                  onChange={(e) => setStartsAt(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="endsAt">Ends At (Optional)</Label>
                <Input
                  id="endsAt"
                  type="datetime-local"
                  value={endsAt}
                  onChange={(e) => setEndsAt(e.target.value)}
                />
              </div>

              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="description">Event Description</Label>
                <Textarea
                  id="description"
                  placeholder="Provide an overview of the event..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                />
              </div>

              <div className="flex items-center justify-between sm:col-span-2 p-3 bg-muted/20 rounded-md">
                <div className="space-y-0.5">
                  <Label className="text-sm font-semibold flex items-center gap-1.5">
                    <Video className="h-4 w-4 text-primary" /> Live Stream Broadcast
                  </Label>
                  <p className="text-xs text-muted-foreground">Make this event watchable in real-time by devotees.</p>
                </div>
                <Switch checked={isLive} onCheckedChange={setIsLive} />
              </div>

              {isLive && (
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="streamUrl">YouTube Embed Stream URL</Label>
                  <Input
                    id="streamUrl"
                    placeholder="e.g. https://www.youtube.com/embed/LIVE_VIDEO_ID"
                    value={streamUrl}
                    onChange={(e) => setStreamUrl(e.target.value)}
                    required={isLive}
                  />
                </div>
              )}

              <div className="space-y-2 sm:col-span-2">
                <Label>Event Cover Image</Label>
                <div className="flex items-center gap-4">
                  <div className="h-16 w-24 rounded border bg-slate-100 flex items-center justify-center overflow-hidden shrink-0">
                    {coverImage ? (
                      <img src={coverImage} alt="Cover Preview" className="h-full w-full object-cover" />
                    ) : (
                      <MapPin className="h-6 w-6 text-muted-foreground opacity-50" />
                    )}
                  </div>
                  <div className="flex-1 space-y-2">
                    <label className="cursor-pointer inline-flex items-center justify-center rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground px-4 py-2 text-sm font-medium gap-2">
                      {uploading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Upload className="h-4 w-4" />
                      )}
                      {uploading ? 'Uploading…' : 'Upload Cover'}
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleCoverUpload}
                        disabled={uploading}
                      />
                    </label>
                  </div>
                </div>
              </div>

              <div className="sm:col-span-2 pt-2">
                <Button type="submit" disabled={saving}>
                  {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Schedule Event
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
              key: 'coverImage',
              label: 'Cover',
              render: (r) => (
                <div className="h-10 w-16 rounded bg-slate-100 border overflow-hidden">
                  {r.coverImage ? (
                    <img src={r.coverImage} alt={r.title} className="h-full w-full object-cover" />
                  ) : (
                    <div className="h-full w-full bg-slate-200" />
                  )}
                </div>
              ),
            },
            { key: 'title', label: 'Event Title' },
            { key: 'location', label: 'Location' },
            {
              key: 'startsAt',
              label: 'Starts',
              render: (r) => new Date(r.startsAt).toLocaleString('en-IN', {
                day: 'numeric',
                month: 'short',
                hour: '2-digit',
                minute: '2-digit',
              }),
            },
            {
              key: 'isLive',
              label: 'Stream Status',
              render: (r) => (
                <Badge
                  variant={r.isLive ? 'destructive' : 'outline'}
                  className={r.isLive ? 'animate-pulse' : ''}
                >
                  {r.isLive ? '🔴 Live Stream' : 'Upcoming'}
                </Badge>
              ),
            },
            {
              key: 'registrations',
              label: 'Booked Devotees',
              render: (r) => (
                <Badge variant="secondary">
                  {r.registrations} registered
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
                  title="Delete Event"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              ),
            },
          ]}
          rows={events}
        />
      )}
    </div>
  )
}
