'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { PageHeader } from '@/components/admin/page-header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { toast } from 'sonner'
import { ImageUploader } from '@/components/ui/image-uploader'

function ProductFormContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const id = searchParams.get('id') // Edit mode ID

  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  // Form states
  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [sku, setSku] = useState('')
  const [shortDescription, setShortDescription] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('500')
  const [salePrice, setSalePrice] = useState('')
  const [weight, setWeight] = useState('')
  const [isAbhimantrit, setIsAbhimantrit] = useState(false)
  const [isFeatured, setIsFeatured] = useState(false)
  const [status, setStatus] = useState('DRAFT')
  const [coverImage, setCoverImage] = useState('')

  // Load ProductCategory dropdown options and existing product data
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)
        // Hit product API to trigger defaults seeding and fetch categories if needed
        await fetch('/api/admin/products')

        // Set local category options that align with DB categories
        const dbProductCategories = [
          { id: 'prasad', name: 'Prasad' },
          { id: 'rudraksha', name: 'Rudraksha' },
          { id: 'idols', name: 'Idols' },
          { id: 'books', name: 'Spiritual Books' }
        ]
        setCategories(dbProductCategories)

        if (id) {
          const res = await fetch('/api/admin/products')
          const data = await res.json()
          if (data.ok) {
            const existing = data.products.find((p: any) => p.id === id)
            if (existing) {
              setName(existing.name || '')
              setSlug(existing.slug || '')
              setCategoryId(existing.categoryId || '')
              setSku(existing.sku || '')
              setShortDescription(existing.shortDescription || '')
              setDescription(existing.description || '')
              setPrice(String(existing.price || ''))
              setSalePrice(existing.salePrice ? String(existing.salePrice) : '')
              setWeight(existing.weight ? String(existing.weight) : '')
              setIsAbhimantrit(!!existing.isAbhimantrit)
              setIsFeatured(!!existing.isFeatured)
              setStatus(existing.status || 'DRAFT')
              setCoverImage(existing.coverImage || '')
            } else {
              toast.error('Product not found')
            }
          }
        }
      } catch (err) {
        console.error('Error loading product form configurations:', err)
        toast.error('Failed to initialize product form')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name) return toast.error('Product Name is required')
    if (!categoryId) return toast.error('Category is required')

    try {
      setSaving(true)
      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: id || undefined,
          name,
          slug,
          categoryId,
          sku,
          shortDescription,
          description,
          price,
          salePrice: salePrice || null,
          weight: weight || null,
          isAbhimantrit,
          isFeatured,
          status,
          coverImage
        })
      })

      const data = await res.json()
      if (data.ok) {
        toast.success(id ? 'Product updated successfully!' : 'Product added successfully!')
        router.push('/admin/products')
        router.refresh()
      } else {
        toast.error(data.error || 'Failed to save product')
      }
    } catch (err) {
      console.error('Error saving product:', err)
      toast.error('Network error saving product')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="animate-pulse text-muted-foreground">Loading product configuration...</span>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="productName">Product Name *</Label>
              <Input
                id="productName"
                value={name}
                onChange={(e) => {
                  setName(e.target.value)
                  if (!id) {
                    setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-'))
                  }
                }}
                placeholder="e.g. Authentic Nepal 5 Mukhi Rudraksha"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="productSlug">Slug (URL Path)</Label>
              <Input
                id="productSlug"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="nepal-5-mukhi-rudraksha"
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="productCategory">Category *</Label>
                <select
                  id="productCategory"
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  required
                >
                  <option value="">Select category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="sku">SKU (Stock Keeping Unit)</Label>
                <Input
                  id="sku"
                  value={sku}
                  onChange={(e) => setSku(e.target.value)}
                  placeholder="e.g., RUD-5M-001"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="shortDesc">Short Description</Label>
              <Input
                id="shortDesc"
                value={shortDescription}
                onChange={(e) => setShortDescription(e.target.value)}
                placeholder="Brief summary for display cards"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Full Description</Label>
              <Textarea
                id="description"
                rows={5}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="About this holy item, its materials, how to wear/place it..."
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="price">Base Price (₹) *</Label>
                <Input
                  id="price"
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="salePrice">Sale Price (₹)</Label>
                <Input
                  id="salePrice"
                  type="number"
                  value={salePrice}
                  onChange={(e) => setSalePrice(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="weight">Weight (grams)</Label>
                <Input
                  id="weight"
                  type="number"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Publishing</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="isAbhimantrit">Abhimantrit (Energized)</Label>
              <Switch id="isAbhimantrit" checked={isAbhimantrit} onCheckedChange={setIsAbhimantrit} />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="isFeatured">Featured</Label>
              <Switch id="isFeatured" checked={isFeatured} onCheckedChange={setIsFeatured} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <select
                id="status"
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="DRAFT">Draft</option>
                <option value="PUBLISHED">Published</option>
                <option value="ARCHIVED">Archived</option>
              </select>
            </div>
            <Button type="submit" className="w-full" disabled={saving}>
              {saving ? 'Saving...' : id ? 'Update Product' : 'Save Product'}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Product Image</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <ImageUploader
              value={coverImage}
              onChange={setCoverImage}
              label="Upload Product Image"
              aspectRatio="square"
            />
          </CardContent>
        </Card>
      </div>
    </form>
  )
}

export default function NewProductPage() {
  const searchParams = useSearchParams()
  const id = searchParams.get('id')

  return (
    <Suspense fallback={<div>Loading form...</div>}>
      <div className="space-y-6">
        <PageHeader
          title={id ? "Edit Product" : "Add Product"}
          description={id ? "Modify store product information, pricing and stock status." : "Create a new product entry for the store catalog."}
          breadcrumbs={[{ label: 'Products', href: '/admin/products' }, { label: id ? 'Edit' : 'New' }]}
        />
        <ProductFormContent />
      </div>
    </Suspense>
  )
}
