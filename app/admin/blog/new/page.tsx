'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { PageHeader } from '@/components/admin/page-header'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { toast } from 'sonner'
import { Loader2, Video, Search, Cloud } from 'lucide-react'
import imageCompression from 'browser-image-compression'
import { convertGoogleDriveUrl } from '@/lib/utils'

function BlogForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const editId = searchParams.get('id')

  const [loadingData, setLoadingData] = useState(false)
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
  const [videoUrl, setVideoUrl] = useState('')
  const [driveUrl, setDriveUrl] = useState('')

  useEffect(() => {
    if (editId) {
      setLoadingData(true)
      fetch(`/api/admin/blog?id=${editId}`)
        .then(res => res.json())
        .then(data => {
          if (data.ok && data.data) {
            const post = data.data
            setTitle(post.title)
            setSlug(post.slug)
            setExcerpt(post.excerpt || '')
            setContent(post.content || '')
            setSeoTitle(post.seoTitle || '')
            setSeoDescription(post.seoDescription || '')
            setIsPublished(post.status === 'PUBLISHED')
            setCoverImage(post.coverImage || '')
            setVideoUrl(post.videoUrl || '')
          } else {
            toast.error('Could not load blog post')
          }
        })
        .catch(() => toast.error('Network error loading post'))
        .finally(() => setLoadingData(false))
    }
  }, [editId])

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

  function handleDriveAdd() {
    if (!driveUrl) return
    const convertedUrl = convertGoogleDriveUrl(driveUrl)
    setCoverImage(convertedUrl)
    setDriveUrl('')
    toast.success('Drive link applied as cover!')
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
          id: editId || undefined,
          title,
          slug,
          excerpt,
          content,
          seoTitle,
          seoDescription,
          coverImage,
          videoUrl,
          status: isPublished ? 'PUBLISHED' : 'DRAFT'
        })
      })

      const data = await res.json()
      if (data.ok) {
        toast.success(editId ? 'Blog post updated successfully!' : 'Blog post saved successfully!')
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

  if (loadingData) {
    return <div className="flex h-48 items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-orange-500" /></div>
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2 space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>{editId ? 'Edit Blog Post' : 'New Blog Post'}</CardTitle>
            <CardDescription>Write your content using Markdown</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Title</Label>
              <Input 
                placeholder="Post title…" 
                value={title} 
                onChange={(e) => {
                  setTitle(e.target.value)
                  if (!editId && !slug) {
                    setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''))
                  }
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
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Search className="h-5 w-5 text-blue-500" /> SEO Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2"><Label>SEO Meta Title</Label><Input value={seoTitle} onChange={(e) => setSeoTitle(e.target.value)} placeholder="Title for Search Engines" /></div>
            <div className="space-y-2"><Label>SEO Meta Description</Label><Textarea rows={2} value={seoDescription} onChange={(e) => setSeoDescription(e.target.value)} placeholder="Description for Search Engines" /></div>
          </CardContent>
        </Card>
      </div>
      
      <div className="space-y-6">
        <Card>
          <CardHeader><CardTitle className="text-base">Publishing</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-muted/20 rounded-md">
              <Label>Publish (Live)</Label>
              <Switch checked={isPublished} onCheckedChange={setIsPublished} />
            </div>
            <Button className="w-full" type="submit" disabled={loading || uploadingImage}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              {editId ? 'Update Post' : isPublished ? 'Publish Now' : 'Save Draft'}
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader><CardTitle className="text-base">Media</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Cover Image</Label>
              {coverImage && (
                <div className="aspect-video relative rounded-md overflow-hidden border bg-slate-100 flex items-center justify-center">
                  <img src={coverImage} alt="Cover Preview" className="object-cover w-full h-full" />
                </div>
              )}
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  {/* <Input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploadingImage} /> - Replaced by Image URL input to prevent Vercel upload errors */}
                  {uploadingImage && <Loader2 className="h-5 w-5 animate-spin text-orange-600 shrink-0" />}
                </div>
                <div className="flex items-center gap-2">
                  <Input
                    placeholder="Or paste Google Drive link"
                    value={driveUrl}
                    onChange={(e) => setDriveUrl(e.target.value)}
                    className="text-xs"
                  />
                  <Button type="button" size="sm" onClick={handleDriveAdd} disabled={!driveUrl} className="bg-blue-600 hover:bg-blue-700">
                    <Cloud className="h-4 w-4 mr-1" /> Use
                  </Button>
                </div>
              </div>
            </div>

            <div className="space-y-2 pt-4 border-t">
              <Label className="flex items-center gap-2">
                <Video className="h-4 w-4" /> YouTube Video URL
              </Label>
              <Input 
                placeholder="https://youtube.com/watch?v=..." 
                value={videoUrl} 
                onChange={(e) => setVideoUrl(e.target.value)} 
              />
              <p className="text-[10px] text-muted-foreground">If provided, this video will be embedded at the top of the blog post.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </form>
  )
}

export default function NewBlogPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Blog Editor" description="Write and publish SEO optimized articles."
        breadcrumbs={[{ label: 'Blog', href: '/admin/blog' }, { label: 'Editor' }]} />
      <Suspense fallback={<div className="flex h-48 items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-orange-500" /></div>}>
        <BlogForm />
      </Suspense>
    </div>
  )
}
