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
import { Loader2, Plus, Trash2, Sparkle } from 'lucide-react'

export default function AdminToolsPage() {
  const [tools, setTools] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showAddForm, setShowAddForm] = useState(false)

  // Form states
  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [description, setDescription] = useState('')
  const [isFree, setIsFree] = useState(true)
  const [price, setPrice] = useState('')
  const [trialDays, setTrialDays] = useState('7')
  const [isActive, setIsActive] = useState(true)

  async function loadTools() {
    try {
      const res = await fetch('/api/admin/tools')
      const data = await res.json()
      if (data.ok) {
        setTools(data.data || [])
      }
    } catch {
      toast.error('Failed to load spiritual tools')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadTools()
  }, [])

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    if (!name) return

    setSaving(true)
    try {
      const res = await fetch('/api/admin/tools', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          slug,
          description,
          isFree,
          price: isFree ? 0 : Number(price || 0),
          trialDays: isFree ? 0 : Number(trialDays || 0),
          isActive,
        }),
      })
      const data = await res.json()
      if (data.ok) {
        toast.success('Spiritual Tool registered!')
        setShowAddForm(false)
        setName('')
        setSlug('')
        setDescription('')
        setIsFree(true)
        setPrice('')
        setTrialDays('7')
        setIsActive(true)
        loadTools()
      } else {
        toast.error(data.error || 'Failed to save tool')
      }
    } catch {
      toast.error('Network error saving tool')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this tool?')) return
    try {
      const res = await fetch(`/api/admin/tools?id=${id}`, {
        method: 'DELETE',
      })
      const data = await res.json()
      if (data.ok) {
        toast.success('Tool deleted successfully')
        loadTools()
      } else {
        toast.error(data.error || 'Failed to delete')
      }
    } catch {
      toast.error('Network error deleting tool')
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Spiritual Tools Management"
        description="Configure Kundali, Milan, Muhurat, and AI Pandits. Set up trial systems and payments."
        breadcrumbs={[{ label: 'Admin', href: '/admin' }, { label: 'Tools' }]}
        action={{
          label: showAddForm ? 'Cancel' : 'Add Tool',
          icon: Plus,
          onClick: () => setShowAddForm(!showAddForm),
        }}
      />

      {showAddForm && (
        <Card className="border-2 border-primary/20">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Sparkle className="h-5 w-5 text-primary animate-spin" /> Register New Spiritual Tool
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreate} className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="tName">Tool Name *</Label>
                <Input
                  id="tName"
                  placeholder="e.g. Kundali Generator"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tSlug">Slug (URL Path)</Label>
                <Input
                  id="tSlug"
                  placeholder="e.g. kundali"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                />
              </div>

              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="tDesc">Description</Label>
                <Textarea
                  id="tDesc"
                  placeholder="Provide details about what the tool does..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                />
              </div>

              <div className="flex items-center justify-between sm:col-span-2 p-3 bg-muted/20 rounded-md">
                <div className="space-y-0.5">
                  <Label className="text-sm font-semibold">Free Tool Option</Label>
                  <p className="text-xs text-muted-foreground">Devotees can use this tool completely free.</p>
                </div>
                <Switch checked={isFree} onCheckedChange={setIsFree} />
              </div>

              {!isFree && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="tPrice">One-Time Activation Price (₹)</Label>
                    <Input
                      id="tPrice"
                      type="number"
                      placeholder="e.g. 299"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      required={!isFree}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tTrial">Free Trial Duration (Days)</Label>
                    <Input
                      id="tTrial"
                      type="number"
                      placeholder="e.g. 7"
                      value={trialDays}
                      onChange={(e) => setTrialDays(e.target.value)}
                      required={!isFree}
                    />
                  </div>
                </>
              )}

              <div className="flex items-center justify-between sm:col-span-2 p-3 bg-muted/20 rounded-md">
                <Label className="text-sm font-semibold">Active Status</Label>
                <Switch checked={isActive} onCheckedChange={setIsActive} />
              </div>

              <div className="sm:col-span-2 pt-2">
                <Button type="submit" disabled={saving}>
                  {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Register Tool
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
            { key: 'name', label: 'Tool Name' },
            {
              key: 'slug',
              label: 'Access Slug',
              render: (r) => (
                <code className="text-xs bg-muted px-1.5 py-0.5 rounded border">{r.slug}</code>
              ),
            },
            {
              key: 'isFree',
              label: 'License Type',
              render: (r) => (
                <Badge variant={r.isFree ? 'outline' : 'default'}>
                  {r.isFree ? '🆓 Free Access' : '💳 Paid / Premium'}
                </Badge>
              ),
            },
            {
              key: 'price',
              label: 'Price',
              render: (r) => (
                <span>{r.isFree ? 'N/A' : `₹${Number(r.price)}`}</span>
              ),
            },
            {
              key: 'trialDays',
              label: 'Trial Days',
              render: (r) => (
                <span>{r.isFree ? 'Unlimited' : `${r.trialDays} Days Trial`}</span>
              ),
            },
            {
              key: 'isActive',
              label: 'Status',
              render: (r) => (
                <Badge variant={r.isActive ? 'success' : 'secondary'}>
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
                  title="Delete Tool"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              ),
            },
          ]}
          rows={tools}
        />
      )}
    </div>
  )
}
