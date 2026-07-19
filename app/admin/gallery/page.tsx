'use client'

import { useEffect, useState } from 'react'
import { PageHeader } from '@/components/admin/page-header'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { Loader2, Copy, Trash2, Upload, Link as LinkIcon, Edit2, PlayCircle, Cloud } from 'lucide-react'
import imageCompression from 'browser-image-compression'
import { convertGoogleDriveUrl } from '@/lib/utils'

export default function GalleryPage() {
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [caption, setCaption] = useState('')
  const [driveUrl, setDriveUrl] = useState('')

  async function loadItems() {
    try {
      const res = await fetch('/api/admin/gallery')
      const contentType = res.headers.get('content-type') || ''
      if (contentType.includes('application/json')) {
        const data = await res.json()
        if (data.ok) {
          setItems(data.data || [])
        }
      } else {
        const text = await res.text()
        console.error('Invalid response from gallery API:', text)
      }
    } catch {
      toast.error('Failed to load gallery items')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadItems()
  }, [])

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    let uploadFile = file

    if (file.type.startsWith('image/')) {
      try {
        uploadFile = await imageCompression(file, {
          maxSizeMB: 0.8,
          maxWidthOrHeight: 1920,
          useWebWorker: true,
        })
      } catch (err) {
        console.error('Compression error', err)
      }
    }

    setUploading(true)
    const formData = new FormData()
    formData.append('file', uploadFile)

    try {
      // 1. Upload to /api/upload
      const uploadRes = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      let uploadData: any
      const uploadType = uploadRes.headers.get('content-type') || ''
      if (uploadType.includes('application/json')) {
        uploadData = await uploadRes.json()
      } else {
        const text = await uploadRes.text()
        if (uploadRes.status === 413 || text.toLowerCase().includes('entity too large') || text.toLowerCase().includes('too large')) {
          throw new Error('File size is too large! Please upload images or videos under 4.5MB.')
        }
        throw new Error('Server upload failed with an invalid response.')
      }

      if (!uploadData.ok) throw new Error(uploadData.error || 'Upload failed')

      // 2. Save in gallery database
      const saveRes = await fetch('/api/admin/gallery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: uploadData.url,
          caption: caption || file.name,
          type: file.type.startsWith('video/') ? 'VIDEO' : 'IMAGE',
          galleryTitle: 'General',
        }),
      })

      let saveData: any
      const saveType = saveRes.headers.get('content-type') || ''
      if (saveType.includes('application/json')) {
        saveData = await saveRes.json()
      } else {
        throw new Error('Failed to save to database: invalid server response')
      }

      if (!saveData.ok) throw new Error(saveData.error || 'Failed to save to database')

      toast.success('Media uploaded and saved to gallery!')
      setCaption('')
      loadItems()
    } catch (err: any) {
      toast.error(err?.message || 'Failed to complete upload')
    } finally {
      setUploading(false)
    }
  }

  async function handleDriveAdd() {
    if (!driveUrl) return
    setUploading(true)
    const convertedUrl = convertGoogleDriveUrl(driveUrl)
    
    try {
      const saveRes = await fetch('/api/admin/gallery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: convertedUrl,
          caption: caption || 'Google Drive Asset',
          type: 'IMAGE', // Defaulting to image, could be inferred if possible
          galleryTitle: 'General',
        }),
      })

      const saveData = await saveRes.json()
      if (!saveData.ok) throw new Error(saveData.error || 'Failed to save to database')

      toast.success('Drive link saved to gallery!')
      setCaption('')
      setDriveUrl('')
      loadItems()
    } catch (err: any) {
      toast.error(err?.message || 'Failed to add drive link')
    } finally {
      setUploading(false)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this media?')) return
    try {
      const res = await fetch(`/api/admin/gallery?id=${id}`, {
        method: 'DELETE',
      })
      const data = await res.json()
      if (data.ok) {
        toast.success('Media deleted successfully')
        loadItems()
      } else {
        toast.error(data.error || 'Failed to delete')
      }
    } catch {
      toast.error('Network error deleting media')
    }
  }

  function copyToClipboard(url: string) {
    const fullUrl = `${window.location.origin}${url}`
    navigator.clipboard.writeText(fullUrl)
    toast.success('Media URL copied to clipboard!')
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Sacred Gallery & Media Library"
        description="Upload photos, videos and manage your platform's assets. Copy links to paste them anywhere on the website."
        breadcrumbs={[{ label: 'Admin', href: '/admin' }, { label: 'Gallery' }]}
      />

      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-muted-foreground">Media Caption / Title (Optional)</label>
                <Input
                  placeholder="Enter caption for the uploaded file..."
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-xs font-semibold text-muted-foreground">Google Drive Link (Alternative to Upload)</label>
                <div className="flex gap-2">
                  <Input
                    placeholder="https://drive.google.com/file/d/.../view"
                    value={driveUrl}
                    onChange={(e) => setDriveUrl(e.target.value)}
                  />
                  <Button type="button" onClick={handleDriveAdd} disabled={uploading || !driveUrl} className="bg-blue-600 hover:bg-blue-700">
                    {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Cloud className="h-4 w-4 mr-2" />}
                    Add Drive Link
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="h-px bg-border flex-1" />
              <span className="text-xs text-muted-foreground font-semibold uppercase">OR</span>
              <div className="h-px bg-border flex-1" />
            </div>

            <div className="flex justify-center">
              <label className="cursor-pointer inline-flex items-center justify-center rounded-md border border-dashed border-primary bg-primary/5 px-6 py-4 text-sm font-medium text-primary hover:bg-primary/10 transition-colors gap-2 w-full max-w-md h-auto">
                {uploading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Upload className="h-5 w-5" />
                )}
                {uploading ? 'Uploading and Compressing…' : 'Click to Upload Local File (Image/Video)'}
                {/* <input
                  type="file"
                  accept="image/*,video/*"
                  className="hidden"
                  onChange={handleUpload}
                  disabled={uploading}
                /> - Disabled for Vercel */}
              </label>
            </div>
          </div>
        </CardContent>
      </Card>

      {loading ? (
        <div className="flex h-48 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : items.length === 0 ? (
        <Card className="flex flex-col items-center justify-center p-12 text-center border-dashed">
          <LinkIcon className="h-12 w-12 text-muted-foreground mb-4 opacity-40" />
          <h3 className="font-semibold text-lg">No Media Found</h3>
          <p className="text-sm text-muted-foreground mt-1 max-w-sm">
            Upload your first photo or video using the input card above to start building your gallery.
          </p>
        </Card>
      ) : (
        <div className="grid gap-6 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {items.map((item) => (
            <Card key={item.id} className="overflow-hidden group relative border shadow-sm hover:shadow-md transition-shadow">
              <div className="aspect-video relative bg-slate-100 flex items-center justify-center overflow-hidden">
                {item.type === 'VIDEO' ? (
                  <video
                    src={item.url}
                    className="w-full h-full object-contain bg-black"
                    controls
                    preload="metadata"
                  />
                ) : (
                  <img
                    src={item.url}
                    alt={item.caption}
                    className="w-full h-full object-contain bg-slate-900 transition-transform duration-300 group-hover:scale-105"
                  />
                )}
              </div>
              <div className="p-3 space-y-2">
                <p className="text-xs font-semibold truncate" title={item.caption}>
                  {item.caption || 'Unnamed Asset'}
                </p>
                <div className="flex items-center gap-1.5 justify-between pt-1">
                  <Button
                    size="icon"
                    variant="outline"
                    className="h-8 w-8 text-primary"
                    onClick={() => copyToClipboard(item.url)}
                    title="Copy URL for site use"
                  >
                    <Copy className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    size="icon"
                    variant="destructive"
                    className="h-8 w-8"
                    onClick={() => handleDelete(item.id)}
                    title="Delete Asset"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
