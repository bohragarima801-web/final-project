'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { PageHeader } from '@/components/admin/page-header'
import { KpiCard } from '@/components/admin/kpi-card'
import { ShoppingBag, Package, Edit, Trash2, Search, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [activeTab, setActiveTab] = useState('All')

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
  const activeCount = products.filter(p => p.status === 'PUBLISHED').length
  const abhimantritCount = products.filter(p => p.isAbhimantrit).length
  const featuredCount = products.filter(p => p.isFeatured).length

  return (
    <div className="space-y-6">
      <PageHeader
        title="Products"
        description="Prasad, rudraksha, idols, puja samagri & spiritual books."
        breadcrumbs={[{ label: 'Admin', href: '/admin' }, { label: 'Products' }]}
        action={{ label: 'Add Product', href: '/admin/products/new' }}
      />

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
