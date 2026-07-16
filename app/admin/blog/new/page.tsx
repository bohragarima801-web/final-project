'use client'

import { PageHeader } from '@/components/admin/page-header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { toast } from 'sonner'

export default function NewBlogPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="New Blog Post" description="Compose a new article."
        breadcrumbs={[{ label: 'Blog', href: '/admin/blog' }, { label: 'New' }]} />
      <form onSubmit={(e) => { e.preventDefault(); toast.success('Draft saved (mock)') }} className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardContent className="p-6 space-y-4">
              <div className="space-y-2"><Label>Title</Label><Input placeholder="Post title…" /></div>
              <div className="space-y-2"><Label>Slug</Label><Input placeholder="post-slug" /></div>
              <div className="space-y-2"><Label>Excerpt</Label><Textarea rows={2} /></div>
              <div className="space-y-2"><Label>Content (Markdown)</Label><Textarea rows={14} placeholder="# Heading\n\nWrite your post here…" /></div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="text-base">SEO</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2"><Label>SEO Title</Label><Input /></div>
              <div className="space-y-2"><Label>SEO Description</Label><Textarea rows={2} /></div>
            </CardContent>
          </Card>
        </div>
        <div className="space-y-6">
          <Card>
            <CardHeader><CardTitle className="text-base">Publishing</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between"><Label>Publish</Label><Switch /></div>
              <Button className="w-full" type="submit">Save Draft</Button>
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
