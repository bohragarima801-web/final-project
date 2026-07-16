'use client'

import { PageHeader } from '@/components/admin/page-header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'

export default function NewPujaPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Add Puja"
        description="Create a new puja with pricing, samagri, and booking configuration."
        breadcrumbs={[{ label: 'Pujas', href: '/admin/pujas' }, { label: 'New' }]}
      />
      <form onSubmit={(e) => { e.preventDefault(); toast.success('Puja saved (mock)') }} className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader><CardTitle className="text-base">Details</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2"><Label>Puja Name</Label><Input placeholder="Maha Rudrabhishek" /></div>
              <div className="space-y-2"><Label>Slug</Label><Input placeholder="maha-rudrabhishek" /></div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select><SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="shiva">Shiva Pujas</SelectItem>
                      <SelectItem value="devi">Devi Pujas</SelectItem>
                      <SelectItem value="vishnu">Vishnu Pujas</SelectItem>
                      <SelectItem value="ganesh">Ganesh Pujas</SelectItem>
                      <SelectItem value="navagraha">Navagraha</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Temple</Label>
                  <Select><SelectTrigger><SelectValue placeholder="Select temple" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="kashi">Kashi Vishwanath</SelectItem>
                      <SelectItem value="somnath">Somnath</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2"><Label>Short Description</Label><Textarea rows={2} /></div>
              <div className="space-y-2"><Label>Full Description</Label><Textarea rows={5} /></div>
              <div className="space-y-2"><Label>Benefits</Label><Textarea rows={3} placeholder="e.g. removes obstacles, brings prosperity…" /></div>
              <div className="space-y-2"><Label>Samagri Included</Label><Textarea rows={3} /></div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-base">Pricing & Slots</CardTitle></CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2"><Label>Base Price (₹)</Label><Input type="number" placeholder="1100" /></div>
              <div className="space-y-2"><Label>VIP Price (₹)</Label><Input type="number" placeholder="5100" /></div>
              <div className="space-y-2"><Label>Duration (min)</Label><Input type="number" placeholder="60" /></div>
              <div className="space-y-2"><Label>Max Members</Label><Input type="number" defaultValue={5} /></div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader><CardTitle className="text-base">Publishing</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between"><Label>VIP Puja</Label><Switch /></div>
              <div className="flex items-center justify-between"><Label>Online (Live Stream)</Label><Switch defaultChecked /></div>
              <div className="flex items-center justify-between"><Label>Featured</Label><Switch /></div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select defaultValue="draft"><SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit" className="w-full">Save Puja</Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="text-base">Cover Image</CardTitle></CardHeader>
            <CardContent><Input type="file" accept="image/*" /></CardContent>
          </Card>
        </div>
      </form>
    </div>
  )
}
