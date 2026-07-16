'use client'

import { useEffect, useState } from 'react'
import { PageHeader } from '@/components/admin/page-header'
import { KpiCard } from '@/components/admin/kpi-card'
import { DataTableShell } from '@/components/admin/data-table-shell'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ShoppingBag, Package, AlertTriangle, FileSpreadsheet, Download, Upload, Trash2, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [importing, setImporting] = useState(false)
  const [showImportForm, setShowImportForm] = useState(false)
  const [csvFile, setCsvFile] = useState<File | null>(null)

  async function loadProducts() {
    try {
      const res = await fetch('/api/admin/products')
      const data = await res.json()
      if (data.ok) {
        setProducts(data.data || [])
      }
    } catch {
      toast.error('Failed to load products list')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProducts()
  }, [])

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) {
      setCsvFile(file)
      toast.success(`CSV selected: ${file.name}`)
    }
  }

  async function handleImport(e: React.FormEvent) {
    e.preventDefault()
    if (!csvFile) return

    setImporting(true)
    const formData = new FormData()
    formData.append('file', csvFile)

    try {
      const res = await fetch('/api/admin/products/csv', {
        method: 'POST',
        body: formData,
      })
      const data = await res.json()
      if (data.ok) {
        toast.success(data.message || 'CSV imported successfully!')
        setShowImportForm(false)
        setCsvFile(null)
        loadProducts()
      } else {
        toast.error(data.error || 'Import failed')
      }
    } catch {
      toast.error('Network error uploading CSV')
    } finally {
      setImporting(false)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this product?')) return
    try {
      const res = await fetch(`/api/admin/products?id=${id}`, {
        method: 'DELETE',
      })
      const data = await res.json()
      if (data.ok) {
        toast.success('Product deleted successfully')
        loadProducts()
      } else {
        toast.error(data.error || 'Failed to delete')
      }
    } catch {
      toast.error('Network error deleting product')
    }
  }

  function downloadTemplateCSV() {
    const csvContent = 'data:text/csv;charset=utf-8,name,slug,category,sku,shortDescription,description,price,salePrice,weight,stock\n5 Mukhi Rudraksha,5-mukhi-rudraksha,Prasad,RUD-5M-001,Pure 5 Mukhi Nepal Rudraksha,Blessed Nepalese 5 Mukhi bead,500,450,2.5,150\nPuja Samagri Kit,puja-samagri-kit,Samagri,KIT-SAM-002,Complete Puja Samagri Pack,Essential pack containing agarbatti matchbox kumkum,1200,999,500,50'
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', 'devyajnam_product_template.csv')
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    toast.success('Product template CSV downloaded!')
  }

  // KPI aggregates
  const activeCount = products.filter(p => p.status === 'ACTIVE').length
  const lowStockCount = products.filter(p => p.stock < 10).length

  return (
    <div className="space-y-6">
      <PageHeader
        title="Products & Inventory"
        description="Prasad, holy rudrakshas, divine samagri, and spiritual accessories."
        breadcrumbs={[{ label: 'Admin', href: '/admin' }, { label: 'Products' }]}
        action={{
          label: showImportForm ? 'Cancel' : 'Bulk CSV Import',
          icon: FileSpreadsheet,
          onClick: () => setShowImportForm(!showImportForm),
        }}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <KpiCard title="Total Products" value={products.length.toString()} icon={ShoppingBag} />
        <KpiCard title="Active Items" value={activeCount.toString()} icon={Package} iconClass="text-green-600" />
        <KpiCard title="Low Stock Alerts" value={lowStockCount.toString()} icon={AlertTriangle} iconClass="text-red-500 animate-pulse" />
      </div>

      {showImportForm && (
        <Card className="border-2 border-primary/20">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <FileSpreadsheet className="h-5 w-5 text-primary" /> Import Products via Spreadsheet
            </CardTitle>
            <CardDescription>
              Upload a CSV file containing your product information. Automatically creates categories and maps inventory stock.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleImport} className="space-y-4 max-w-md">
              <div className="space-y-1">
                <Button type="button" variant="outline" size="sm" onClick={downloadTemplateCSV} className="gap-1.5">
                  <Download className="h-4 w-4" /> Download Template CSV
                </Button>
              </div>

              <div className="space-y-2">
                <Label htmlFor="csvFileInput">Choose CSV File</Label>
                <Input
                  id="csvFileInput"
                  type="file"
                  accept=".csv"
                  onChange={handleFileChange}
                  className="cursor-pointer"
                  required
                />
                <p className="text-[10px] text-muted-foreground">Headers: name, slug, category, sku, shortDescription, description, price, salePrice, weight, stock</p>
              </div>

              <Button type="submit" disabled={importing}>
                {importing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Importing products…
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" /> Start Import
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {loading ? (
        <div className="flex h-48 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <DataTableShell
          columns={[
            { key: 'name', label: 'Product Name' },
            { key: 'sku', label: 'SKU' },
            { key: 'category', label: 'Category' },
            { key: 'price', label: 'Price' },
            {
              key: 'stock',
              label: 'In Stock',
              render: (r) => (
                <Badge variant={r.stock < 10 ? 'destructive' : 'secondary'}>
                  {r.stock} left
                </Badge>
              ),
            },
            {
              key: 'status',
              label: 'Status',
              render: (r) => (
                <Badge
                  variant={r.status === 'ACTIVE' ? 'success' : 'secondary'}
                  className={r.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : ''}
                >
                  {r.status}
                </Badge>
              ),
            },
            {
              key: 'actions',
              label: 'Actions',
              render: (r) => (
                <Button
                  size="icon"
                  variant="destructive"
                  className="h-8 w-8"
                  onClick={() => handleDelete(r.id)}
                  title="Delete Product"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              ),
            },
          ]}
          rows={products}
        />
      )}
    </div>
  )
}
