'use client'

import { useEffect, useState } from 'react'
import { PageHeader } from '@/components/admin/page-header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'

interface RefCategory {
  id: string
  name: string
}

export default function NewProductPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const editId = searchParams.get('id')

  const [categories, setCategories] = useState<RefCategory[]>([])
  const [loadingRefs, setLoadingRefs] = useState(true)

  // Form states
  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [sku, setSku] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [shortDescription, setShortDescription] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('500')
  const [salePrice, setSalePrice] = useState('')
  const [stock, setStock] = useState('50')
  const [weight, setWeight] = useState('100')
  const [isAbhimantrit, setIsAbhimantrit] = useState(false)
  const [isFeatured, setIsFeatured] = useState(false)
  const [status, setStatus] = useState('DRAFT')
  const [coverImage, setCoverImage] = useState('')
  const [saving, setSaving] = useState(false)
  const [loadingDetails, setLoadingDetails] = useState(false)

  // Fetch product categories
  useEffect(() => {
    const fetchCats = async () => {
      try {
        setLoadingRefs(true)
        const res = await fetch('/api/admin/product-categories')
        const data = await res.json()
        if (data.ok) {
          setCategories(data.data || [])
        }
      } catch {
        toast.error('Failed to load product categories')
      } finally {
        setLoadingRefs(false)
      }
    }
    fetchCats()
  }, [])

  // Auto-slugify
  useEffect(() => {
    if (!editId) {
      setSlug(name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, ''))
    }
  }, [name, editId])

  // Fetch details if editing
  useEffect(() => {
    if (!editId) return
    const fetchProduct = async () => {
      try {
        setLoadingDetails(true)
        const res = await fetch(`/api/admin/products?id=${editId}`)
        const data = await res.json()
        if (data.ok && data.product) {
          const p = data.product
          setName(p.name || '')
          setSlug(p.slug || '')
          setSku(p.sku || '')
          setCategoryId(p.categoryId || '')
          setShortDescription(p.shortDescription || '')
          setDescription(p.description || '')
          setPrice(String(p.price || '0'))
          setSalePrice(String(p.salePrice || ''))
          setStock(String(p.inventory?.quantity || '0'))
          setWeight(String(p.weight || ''))
          setIsAbhimantrit(!!p.isAbhimantrit)
          setIsFeatured(!!p.isFeatured)
          setStatus(p.status || 'DRAFT')
          setCoverImage(p.coverImage || '')
        }
      } catch {
        toast.error('Error fetching product details')
      } finally {
        setLoadingDetails(false)
      }
    }
    fetchProduct()
  }, [editId])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onloadend = () => {
      setCoverImage(reader.result as string)
      toast.success('Product image parsed successfully!')
    }
    reader.readAsDataURL(file)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) {
      toast.error('Product Name is required')
      return
    }
    if (!categoryId) {
      toast.error('Please select a Product Category')
      return
    }

    try {
      setSaving(true)
      const payload = {
        id: editId || undefined,
        name,
        slug,
        sku,
        categoryId,
        shortDescription,
        description,
        price: Number(price) || 0,
        salePrice: salePrice ? Number(salePrice) : null,
        isAbhimantrit,
        isFeatured,
        status,
        coverImage,
        weight: weight ? Number(weight) : null,
        stock: Number(stock) || 0
      }

      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      const data = await res.json()
      if (data.ok) {
        toast.success(editId ? 'Product updated successfully!' : 'Product created successfully!')
        router.push('/admin/products')
      } else {
        toast.error(data.error || 'Failed to save product')
      }
    } catch {
      toast.error('Network error saving product')
    } finally {
      setSaving(false)
    }
  }

  if (loadingDetails) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-10 w-10 animate-spin text-orange-600" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={editId ? 'Edit Product' : 'Add Product'}
        description="Create or edit a product for the store with price and inventory details."
        breadcrumbs={[{ label: 'Products', href: '/admin/products' }, { label: editId ? 'Edit' : 'New' }]}
      />
      <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader><CardTitle className="text-base">Details (विवरण)</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Product Name (सामग्री का नाम)</Label>
                <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Energized Rudraksha Mala" />
              </div>
              <div className="space-y-2">
                <Label>Slug (यूआरएल स्लॉग)</Label>
                <Input value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="e.g. energized-rudraksha-mala" />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Category (श्रेणी)</Label>
                  {loadingRefs ? (
                    <div className="text-xs text-muted-foreground animate-pulse">Loading categories...</div>
                  ) : (
                    <Select value={categoryId} onValueChange={setCategoryId}>
                      <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>
                <div className="space-y-2">
                  <Label>SKU (कोड)</Label>
                  <Input value={sku} onChange={(e) => setSku(e.target.value)} placeholder="e.g. RUD-MALA-108" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Short Description (संक्षिप्त विवरण)</Label>
                <Textarea value={shortDescription} onChange={(e) => setShortDescription(e.target.value)} rows={2} />
              </div>
              <div className="space-y-2">
                <Label>Full Description (विस्तृत विवरण)</Label>
                <Textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={4} />
              </div>
              <div className="grid gap-4 sm:grid-cols-4">
                <div className="space-y-2">
                  <Label>Price (₹)</Label>
                  <Input type="number" value={price} onChange={(e) => setPrice(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Sale Price (₹)</Label>
                  <Input type="number" value={salePrice} onChange={(e) => setSalePrice(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Stock Qty</Label>
                  <Input type="number" value={stock} onChange={(e) => setStock(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Weight (g)</Label>
                  <Input type="number" value={weight} onChange={(e) => setWeight(e.target.value)} />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader><CardTitle className="text-base">Publishing (प्रकाशन)</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Abhimantrit (अभिमंत्रित)</Label>
                <Switch checked={isAbhimantrit} onCheckedChange={setIsAbhimantrit} />
              </div>
              <div className="flex items-center justify-between">
                <Label>Featured (मुख्य)</Label>
                <Switch checked={isFeatured} onCheckedChange={setIsFeatured} />
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DRAFT">Draft</SelectItem>
                    <SelectItem value="PUBLISHED">Published</SelectItem>
                    <SelectItem value="ARCHIVED">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit" disabled={saving} className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold">
                {saving ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : 'Save Product'}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-base">Product Image (उत्पाद छवि)</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {coverImage && (
                <div className="aspect-[4/3] rounded-lg overflow-hidden border">
                  <img src={coverImage} className="h-full w-full object-cover" alt="Preview" />
                </div>
              )}
              <Input type="file" accept="image/*" onChange={handleImageChange} />
              <Input type="text" value={coverImage} onChange={(e) => setCoverImage(e.target.value)} placeholder="Or paste image URL" className="text-xs" />
            </CardContent>
          </Card>
        </div>
      </form>
    </div>
  )
}
