import { prisma } from '@/lib/prisma'
import { ensureDefaultCategoriesAndTemples } from '@/lib/data-defaults'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ShoppingBag, Star, ArrowRight, ShieldCheck } from 'lucide-react'
import { DEFAULT_PLACEHOLDER_IMAGE } from '@/lib/utils'

export const dynamic = 'force-dynamic'

export default async function ProductsPage() {
  await ensureDefaultCategoriesAndTemples()

  // Fetch only published products
  const products = await prisma.product.findMany({
    where: { status: 'ACTIVE' },
    include: { category: true },
    orderBy: { createdAt: 'desc' }
  })

  return (
    <div className="container max-w-7xl mx-auto px-4 py-12 md:py-16 space-y-12">
      {/* Hero Section */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <Badge variant="secondary" className="px-3 py-1 text-xs font-semibold uppercase tracking-wider text-amber-700 bg-amber-50 border-amber-200/60">
          🛍️ Spiritual Store
        </Badge>
        <h1 className="text-4xl md:text-5xl font-black tracking-tight text-foreground">
          Abhimantrit <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 via-orange-600 to-red-600">Spiritual Products</span>
        </h1>
        <p className="text-lg text-muted-foreground leading-relaxed">
          Explore energised, authenticated spiritual items including genuine Himalayan rudrakshas, pure prasad offerings, hand-crafted brass idols, and sacred literature.
        </p>
      </div>

      {/* Grid List */}
      {products.length === 0 ? (
        <Card className="border-dashed bg-muted/20">
          <CardContent className="p-12 text-center space-y-4">
            <p className="text-muted-foreground">No active products listed in the store yet. Please add published products from the Admin Panel.</p>
            <Button asChild size="sm">
              <Link href="/admin/products">Go to Admin Panel</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => {
            const hasSale = !!product.salePrice && parseFloat(product.salePrice.toString()) < parseFloat(product.price.toString())
            const activePrice = hasSale ? product.salePrice : product.price

            return (
              <Card key={product.id} className="group overflow-hidden border border-border/60 hover:shadow-xl hover:border-amber-500/40 transition-all duration-300 flex flex-col justify-between">
                <div className="relative aspect-square overflow-hidden bg-muted">
                  <img 
                    src={product.coverImage || DEFAULT_PLACEHOLDER_IMAGE} 
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1">
                    <Badge className="bg-black/80 text-white border-none text-[9px] font-bold uppercase tracking-wider">
                      {product.category?.name || 'Spiritual'}
                    </Badge>
                    {product.isAbhimantrit && (
                      <Badge className="bg-purple-600 border-none text-white font-extrabold text-[9px] flex items-center gap-0.5">
                        <ShieldCheck className="h-3 w-3" /> Energised
                      </Badge>
                    )}
                  </div>
                  {hasSale && (
                    <div className="absolute top-2.5 right-2.5 bg-red-600 text-white font-bold text-[9px] px-2 py-0.5 rounded-md">
                      SALE
                    </div>
                  )}
                </div>

                <CardContent className="p-4 flex-1 flex flex-col justify-between gap-3">
                  <div className="space-y-1">
                    <h3 className="font-bold text-base text-foreground group-hover:text-amber-600 transition-colors line-clamp-1">
                      {product.name}
                    </h3>
                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                      {product.shortDescription || 'Authentic divine spiritual accessory energised for protection, positivity, and spiritual growth.'}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-border/40 mt-auto">
                    <div className="flex items-baseline gap-2 mb-3">
                      <span className="text-xl font-black text-foreground">
                        ₹{parseFloat(activePrice?.toString() || '0').toLocaleString('en-IN')}
                      </span>
                      {hasSale && (
                        <span className="text-xs text-muted-foreground line-through">
                          ₹{parseFloat(product.price.toString()).toLocaleString('en-IN')}
                        </span>
                      )}
                    </div>
                    <Button asChild className="w-full bg-amber-500 hover:bg-amber-600 text-black font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm h-9">
                      <Link href={`/cart/add?productId=${product.id}`}>
                        <ShoppingBag className="h-4 w-4" /> Add to Bag
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
