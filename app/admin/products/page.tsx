'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { PageHeader } from '@/components/admin/page-header'
import { KpiCard } from '@/components/admin/kpi-card'
import { ShoppingBag, Package, Edit, Trash2, Search, Star, Upload, FileDown, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [activeTab, setActiveTab] = useState('All')

  // CSV upload states
  const [csvFile, setCsvFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [showCsvBox, setShowCsvBox] = useState(false)

  const loadProducts = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/admin/products')
      const data = await res.json()
      if (data.ok) {
        setProducts(data.products || [])
      } else {
        toast.error(data.error || 'Failed to load products')
      }
    } catch (err) {
      console.error('Error fetching products:', err)
      toast.error('Network error loading products')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProducts()
  }, [])

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return

    try {
      const res = await fetch(`/api/admin/products?id=${id}`, {
        method: 'DELETE'
      })
      const data = await res.json()
      if (data.ok) {
        toast.success(`"${name}" deleted successfully`)
        setProducts(products.filter(p => p.id !== id))
      } else {
        toast.error(data.error || 'Failed to delete product')
      }
    } catch (err) {
      console.error('Error deleting product:', err)
      toast.error('Network error deleting product')
    }
  }

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
                          (p.sku && p.sku.toLowerCase().includes(search.toLowerCase())) ||
                          (p.category?.name && p.category.name.toLowerCase().includes(search.toLowerCase()))

    if (activeTab === 'All') return matchesSearch
    if (activeTab === 'Active') return matchesSearch && p.status === 'PUBLISHED'
    if (activeTab === 'Draft') return matchesSearch && p.status === 'DRAFT'
    if (activeTab === 'Abhimantrit') return matchesSearch && p.isAbhimantrit
    return matchesSearch
  })

  const totalCount = products.length
  const activeCount = products.filter(p => p.status === 'ACTIVE' || p.status === 'PUBLISHED').length
  const abhimantritCount = products.filter(p => p.isAbhimantrit).length
  const featuredCount = products.filter(p => p.isFeatured).length

  const handleCsvUpload = async () => {
    if (!csvFile) {
      toast.error('Please select a CSV file first')
      return
    }

    try {
      setUploading(true)
      const reader = new FileReader()
      reader.onload = async (e) => {
        const text = e.target?.result as string
        const res = await fetch('/api/admin/products/import', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ csvText: text })
        })
        const json = await res.json()
        if (json.ok) {
          toast.success(json.message || 'Import complete!')
          setCsvFile(null)
          setShowCsvBox(false)
          loadProducts()
        } else {
          toast.error(json.error || 'Failed to import CSV')
        }
      }
      reader.readAsText(csvFile)
    } catch (err: any) {
      toast.error(err?.message || 'Failed to read file')
    } finally {
      setUploading(false)
    }
  }

  const triggerDownloadTemplate = () => {
    const headers = 'name,category,price,saleprice,sku,shortdescription,description,isabhimantrit,isfeatured,coverimage,weight,status\n'
    const sample = 'Premium Brass Diya,Spiritual,1250,999,BD-01,Handcrafted premium brass diya,Made with 100% pure heavy brass for daily pooja ceremonies,true,true,https://picsum.photos/seed/diya/400/300,0.45,ACTIVE\nPure Gangajal,Pooja Samagri,150,,GJ-01,Holy Gangajal from Gangotri,Untouched and authentic pure water sourced directly from Gangotri Himalayas,false,false,https://picsum.photos/seed/gangajal/400/300,0.5,ACTIVE\n'
    const blob = new Blob([headers + sample], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.setAttribute('href', url)
    a.setAttribute('download', 'products_template.csv')
    a.click()
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <PageHeader
          title="Products"
          description="Prasad, rudraksha, idols, puja samagri & spiritual books."
          breadcrumbs={[{ label: 'Admin', href: '/admin' }, { label: 'Products' }]}
        />
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            className="flex items-center gap-2 bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100"
            onClick={() => setShowCsvBox(!showCsvBox)}
          >
            <Upload className="h-4 w-4" /> Bulk CSV Import
          </Button>
          <Link href="/admin/products/new">
            <Button className="bg-primary hover:bg-primary/95 text-white">Add Product</Button>
          </Link>
        </div>
      </div>

      {showCsvBox && (
        <Card className="border-amber-200 bg-amber-50/20">
          <CardContent className="p-6 space-y-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-bold text-sm text-amber-950">Bulk CSV Product Update</h4>
                <p className="text-xs text-amber-800 mt-1">
                  Upload a CSV file containing your product catalog. Existing products matching by SKU, Name, or Slug will be updated in place, while new ones and missing categories will be created automatically in your category list!
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4 pt-2">
              <div className="border border-dashed border-muted-foreground/30 rounded-lg p-6 bg-background flex flex-col items-center justify-center text-center gap-2">
                <Upload className="h-8 w-8 text-muted-foreground/80" />
                <span className="text-xs text-muted-foreground font-medium">Drag and drop your file here, or click to browse</span>
                <input 
                  type="file" 
                  accept=".csv"
                  className="hidden" 
                  id="csv-file-input"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) setCsvFile(file)
                  }}
                />
                <Button 
                  size="sm" 
                  variant="secondary" 
                  className="mt-1"
                  onClick={() => document.getElementById('csv-file-input')?.click()}
                >
                  Choose File
                </Button>
                {csvFile && (
                  <div className="text-xs font-semibold text-emerald-600 mt-2 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-100">
                    Selected: {csvFile.name} ({(csvFile.size / 1024).toFixed(1)} KB)
                  </div>
                )}
              </div>

              <div className="space-y-3 flex flex-col justify-between">
                <div className="space-y-1.5">
                  <p className="text-xs font-bold text-foreground">Supported CSV Columns:</p>
                  <code className="text-[10px] block bg-background p-2 rounded border font-mono whitespace-nowrap overflow-x-auto text-muted-foreground">
                    name, category, price, saleprice, sku, shortdescription, description, isabhimantrit, isfeatured, coverimage, weight, status
                  </code>
                </div>
                <div className="flex items-center gap-2 pt-2">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="flex items-center gap-1.5"
                    onClick={triggerDownloadTemplate}
                  >
                    <FileDown className="h-3.5 w-3.5" /> Template
                  </Button>
                  <Button 
                    size="sm" 
                    className="flex-1 bg-amber-500 hover:bg-amber-600 text-black font-bold"
                    disabled={!csvFile || uploading}
                    onClick={handleCsvUpload}
                  >
                    {uploading ? 'Importing...' : 'Upload & Import Now'}
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard title="Total Products" value={String(totalCount)} icon={ShoppingBag} />
        <KpiCard title="Active Enrolled" value={String(activeCount)} icon={Package} iconClass="text-emerald-500" />
        <KpiCard title="Abhimantrit" value={String(abhimantritCount)} icon={Star} iconClass="text-purple-500" />
        <KpiCard title="Featured" value={String(featuredCount)} icon={Star} iconClass="text-amber-500" />
      </div>

      <div className="flex items-center justify-between border-b pb-1">
        <div className="flex items-center gap-1.5 bg-muted p-1 rounded-lg">
          {['All', 'Active', 'Draft', 'Abhimantrit'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                activeTab === tab
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <Card className="overflow-hidden">
        <div className="p-3 flex flex-col sm:flex-row items-stretch sm:items-center gap-2 border-b">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search products by name, category, or SKU…" 
              className="pl-9 h-9" 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr className="text-left font-medium text-muted-foreground text-xs">
                <th className="px-4 py-3">Product Name</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">SKU</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Sale Price</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-4 py-16 text-center text-muted-foreground">
                    <span className="animate-pulse">Loading products...</span>
                  </td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-16 text-center text-muted-foreground">
                    No products found. Click "Add Product" to create one.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-muted/10 transition-colors">
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-3">
                        {p.coverImage && (
                          <img src={p.coverImage} alt="" className="h-10 w-10 rounded-md object-cover border" />
                        )}
                        <div>
                          <p className="font-semibold text-foreground flex items-center gap-1.5">
                            {p.name}
                            {p.isAbhimantrit && (
                              <span className="bg-purple-100 text-purple-800 text-[9px] font-bold px-1.5 py-0.2 rounded">
                                Abhimantrit
                              </span>
                            )}
                          </p>
                          <p className="text-[10px] text-muted-foreground font-mono">{p.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground capitalize">
                      {p.category?.name || 'Uncategorized'}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground font-mono text-xs">
                      {p.sku || '—'}
                    </td>
                    <td className="px-4 py-3 font-semibold text-foreground">
                      ₹{parseFloat(p.price || '0').toLocaleString('en-IN')}
                    </td>
                    <td className="px-4 py-3 text-emerald-600 font-semibold">
                      {p.salePrice ? `₹${parseFloat(p.salePrice).toLocaleString('en-IN')}` : '—'}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${
                        p.status === 'PUBLISHED' 
                          ? 'bg-emerald-100 text-emerald-800' 
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link href={`/admin/products/new?id=${p.id}`}>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600 hover:text-blue-700">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-red-600 hover:text-red-700"
                          onClick={() => handleDelete(p.id, p.name)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
