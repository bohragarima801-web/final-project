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
import { Loader2, Image as ImageIcon } from 'lucide-react'
import imageCompression from 'browser-image-compression'

export default function NewBlogPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)

  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [excerpt, setExcerpt] = useState('')
  const [content, setContent] = useState('')
  const [seoTitle, setSeoTitle] = useState('')
  const [seoDescription, setSeoDescription] = useState('')
  const [isPublished, setIsPublished] = useState(true)
  const [coverImage, setCoverImage] = useState('')

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadingImage(true)
    try {
      const compressedFile = await imageCompression(file, {
        maxSizeMB: 0.5,
        maxWidthOrHeight: 1200,
        useWebWorker: true,
      })

      const formData = new FormData()
      formData.append('file', compressedFile)

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
    } catch (error) {
      toast.error('Network error uploading image')
    } finally {
      setUploadingImage(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title || !slug || !content) {
      toast.error('Title, Slug, and Content are required')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/admin/blog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          slug,
          excerpt,
          content,
          seoTitle,
          seoDescription,
          coverImage,
          status: isPublished ? 'PUBLISHED' : 'DRAFT'
        })
      })

      const data = await res.json()
      if (data.ok) {
        toast.success('Blog post saved successfully!')
        router.push('/admin/blog')
      } else {
        toast.error(data.error || 'Failed to save blog post')
      }
    } catch (err) {
      toast.error('Network error saving post')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader title="New Blog Post" description="Compose a new article."
        breadcrumbs={[{ label: 'Blog', href: '/admin/blog' }, { label: 'New' }]} />
        
      <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardContent className="p-6 space-y-4">
              <div className="space-y-2">
                <Label>Title</Label>
                <Input 
                  placeholder="Post title…" 
                  value={title} 
                  onChange={(e) => {
                    setTitle(e.target.value)
                    if (!slug) setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''))
                  }} 
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label>Slug</Label>
                <Input placeholder="post-slug" value={slug} onChange={(e) => setSlug(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label>Excerpt</Label>
                <Textarea rows={2} value={excerpt} onChange={(e) => setExcerpt(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Content (Markdown)</Label>
                <Textarea rows={14} placeholder="# Heading\n\nWrite your post here…" value={content} onChange={(e) => setContent(e.target.value)} required />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader><CardTitle className="text-base">SEO</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2"><Label>SEO Title</Label><Input value={seoTitle} onChange={(e) => setSeoTitle(e.target.value)} /></div>
              <div className="space-y-2"><Label>SEO Description</Label><Textarea rows={2} value={seoDescription} onChange={(e) => setSeoDescription(e.target.value)} /></div>
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-6">
          <Card>
            <CardHeader><CardTitle className="text-base">Publishing</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Publish (Live)</Label>
                <Switch checked={isPublished} onCheckedChange={setIsPublished} />
              </div>
              <Button className="w-full" type="submit" disabled={loading || uploadingImage}>
                {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                {isPublished ? 'Publish Now' : 'Save Draft'}
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader><CardTitle className="text-base">Cover Image</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              {coverImage && (
                <div className="aspect-video relative rounded-md overflow-hidden border bg-slate-100 flex items-center justify-center">
                  <img src={coverImage} alt="Cover Preview" className="object-cover w-full h-full" />
                </div>
              )}
              <div className="flex items-center gap-2">
                <Input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploadingImage} />
                {uploadingImage && <Loader2 className="h-5 w-5 animate-spin text-orange-600 shrink-0" />}
              </div>
            </CardContent>
          </Card>
        </div>
      </form>
    </div>
  )
}
