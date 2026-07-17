'use client'

import { PageHeader } from '@/components/admin/page-header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { toast } from 'sonner'

export default function NewProductPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Add Product" description="Create a new product for the store."
        breadcrumbs={[{ label: 'Products', href: '/admin/products' }, { label: 'New' }]} />
      <form onSubmit={(e) => { e.preventDefault(); toast.success('Product saved (mock)') }} className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader><CardTitle className="text-base">Details</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2"><Label>Name</Label><Input /></div>
              <div className="space-y-2"><Label>SKU</Label><Input /></div>
              <div className="space-y-2"><Label>Description</Label><Textarea rows={5} /></div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2"><Label>Price (₹)</Label><Input type="number" /></div>
                <div className="space-y-2"><Label>Sale Price (₹)</Label><Input type="number" /></div>
                <div className="space-y-2"><Label>Stock</Label><Input type="number" /></div>
                <div className="space-y-2"><Label>Weight (g)</Label><Input type="number" /></div>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="space-y-6">
          <Card>
            <CardHeader><CardTitle className="text-base">Publishing</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between"><Label>Abhimantrit</Label><Switch /></div>
              <div className="flex items-center justify-between"><Label>Featured</Label><Switch /></div>
              <div className="flex items-center justify-between"><Label>Active</Label><Switch defaultChecked /></div>
              <Button type="submit" className="w-full">Save Product</Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="text-base">Images</CardTitle></CardHeader>
            <CardContent><Input type="file" multiple accept="image/*" /></CardContent>
          </Card>
        </div>
      </form>
    </div>
  )
}
