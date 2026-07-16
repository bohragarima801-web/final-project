'use client'

import { useState } from 'react'
import { PageHeader } from '@/components/admin/page-header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { toast } from 'sonner'

export default function NewTemplePage() {
  const [name, setName] = useState('')
  return (
    <div className="space-y-6">
      <PageHeader
        title="Add Temple"
        description="Create a new temple entry with location, timings and media."
        breadcrumbs={[{ label: 'Temples', href: '/admin/temples' }, { label: 'New' }]}
      />
      <form onSubmit={(e) => { e.preventDefault(); toast.success('Temple saved (mock)') }} className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader><CardTitle className="text-base">Basic Information</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2"><Label>Temple Name</Label><Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Kashi Vishwanath" /></div>
              <div className="space-y-2"><Label>Slug</Label><Input placeholder="kashi-vishwanath" /></div>
              <div className="space-y-2"><Label>Presiding Deity</Label><Input placeholder="Lord Shiva" /></div>
              <div className="space-y-2"><Label>Description</Label><Textarea rows={5} placeholder="About the temple, history & significance…" /></div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="text-base">Location</CardTitle></CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2 sm:col-span-2"><Label>Address</Label><Input /></div>
              <div className="space-y-2"><Label>City</Label><Input /></div>
              <div className="space-y-2"><Label>State</Label><Input /></div>
              <div className="space-y-2"><Label>Pincode</Label><Input /></div>
              <div className="space-y-2"><Label>Country</Label><Input defaultValue="India" /></div>
              <div className="space-y-2"><Label>Latitude</Label><Input type="number" step="0.000001" /></div>
              <div className="space-y-2"><Label>Longitude</Label><Input type="number" step="0.000001" /></div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader><CardTitle className="text-base">Publishing</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between"><Label>Featured</Label><Switch /></div>
              <div className="flex items-center justify-between"><Label>Active</Label><Switch defaultChecked /></div>
              <Button type="submit" className="w-full">Save Temple</Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="text-base">Cover Image</CardTitle></CardHeader>
            <CardContent>
              <Input type="file" accept="image/*" />
              <p className="text-xs text-muted-foreground mt-2">Recommended 1600x900 — hero banner.</p>
            </CardContent>
          </Card>
        </div>
      </form>
    </div>
  )
}
