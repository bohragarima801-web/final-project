import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Sparkles, ShoppingCart } from 'lucide-react'
import { prisma } from '@/lib/prisma'

export const revalidate = 60

export default async function ProductsPage() {
  const products = await prisma.product.findMany({
    where: {
      OR: [
        { status: 'ACTIVE' },
        { status: 'OUT_OF_STOCK' }
      ]
    },
    include: { category: true, inventory: true },
    orderBy: { createdAt: 'desc' }
  }).catch(() => [])

  return (
    <div className="container py-14 space-y-10">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <Badge variant="secondary" className="mb-3">🛍️ Store</Badge>
        <h1 className="text-4xl md:text-5xl font-black text-om-gradient">Abhimantrit Prasad & Store</h1>
        <p className="text-lg text-muted-foreground leading-relaxed">
          गंगाजल से अभिमंत्रित सिद्ध रुद्राक्ष माला, धूप-दीप, पूजन सामग्री और सिद्ध यंत्र।
        </p>
      </div>

      {products.length === 0 ? (
        <Card className="border-dashed max-w-md mx-auto">
          <CardContent className="p-8 text-center space-y-4">
            <Sparkles className="h-12 w-12 text-muted-foreground/60 mx-auto" />
            <h3 className="text-lg font-semibold">Store Coming Soon</h3>
            <p className="text-sm text-muted-foreground">We are preparing our sacred inventory. Please check back shortly or ask AI Pandit.</p>
            <Button asChild size="sm">
              <Link href="/ask-a-pandit">Ask AI Pandit ✨</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((p) => {
            const hasStock = (p.inventory?.quantity ?? 0) > 0
            return (
              <Card key={p.id} className="overflow-hidden group hover:shadow-xl transition-all border border-primary/10 flex flex-col justify-between">
                <div className="relative aspect-square bg-slate-100 overflow-hidden">
                  {p.coverImage ? (
                    <img
                      src={p.coverImage}
                      alt={p.name}
                      className="h-full w-full object-cover transition-transform group-hover:scale-105"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-primary bg-orange-50/50">
                      <Sparkles className="h-12 w-12 opacity-40" />
                    </div>
                  )}
                  {p.isAbhimantrit && (
                    <Badge className="absolute top-3 left-3 bg-orange-600 text-white font-bold border-none text-[10px]">
                      🔥 अभिमंत्रित
                    </Badge>
                  )}
                  {!hasStock && (
                    <Badge className="absolute top-3 right-3 bg-slate-600 text-white font-bold border-none text-[10px]">
                      OUT OF STOCK
                    </Badge>
                  )}
                </div>
                <CardContent className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
                      {p.category?.name || 'Spiritual'}
                    </span>
                    <h3 className="font-bold text-base text-slate-800 line-clamp-2 leading-tight group-hover:text-orange-600 transition-colors">
                      {p.name}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-2 mt-1 leading-snug">
                      {p.shortDescription || 'Blessed spiritual item prepared with Vedic rituals.'}
                    </p>
                  </div>
                  <div className="pt-2 border-t flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-[10px] text-muted-foreground">मूल्य</span>
                      <span className="text-base font-black text-orange-600">₹{Number(p.price)}</span>
                    </div>
                    <Button size="sm" variant={hasStock ? 'default' : 'secondary'} disabled={!hasStock} className="bg-orange-600 hover:bg-orange-700 text-white font-bold h-8 px-3 text-xs gap-1">
                      <ShoppingCart className="h-3.5 w-3.5" /> खरीदे (Buy)
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
