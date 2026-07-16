import { prisma } from '@/lib/prisma'
import { ensureDefaultCategoriesAndTemples } from '@/lib/data-defaults'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Flame, Star, Calendar, ArrowRight, MapPin } from 'lucide-react'
import { DEFAULT_PLACEHOLDER_IMAGE } from '@/lib/utils'

export const dynamic = 'force-dynamic'

export default async function PujasPage() {
  await ensureDefaultCategoriesAndTemples()

  // Fetch only published pujas
  const pujas = await prisma.puja.findMany({
    where: { status: 'PUBLISHED' },
    include: { category: true, temple: true },
    orderBy: { createdAt: 'desc' }
  })

  return (
    <div className="container max-w-7xl mx-auto px-4 py-12 md:py-16 space-y-12">
      {/* Hero Section */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <Badge variant="secondary" className="px-3 py-1 text-xs font-semibold uppercase tracking-wider text-amber-700 bg-amber-50 border-amber-200/60">
          🔥 Live Pujas
        </Badge>
        <h1 className="text-4xl md:text-5xl font-black tracking-tight text-foreground">
          Sacred Online <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 via-orange-600 to-red-600">Puja Services</span>
        </h1>
        <p className="text-lg text-muted-foreground leading-relaxed">
          Book personalized, authenticated vedic pujas performed in historic Indian temples. Receive Prasad and divine blessings delivered directly to your doorstep.
        </p>
      </div>

      {/* Grid List */}
      {pujas.length === 0 ? (
        <Card className="border-dashed bg-muted/20">
          <CardContent className="p-12 text-center space-y-4">
            <p className="text-muted-foreground">No active pujas listed yet. Please add published pujas from the Admin Panel.</p>
            <Button asChild size="sm">
              <Link href="/admin/pujas">Go to Admin Panel</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {pujas.map((puja) => (
            <Card key={puja.id} className="group overflow-hidden border border-border/60 hover:shadow-xl hover:border-amber-500/40 transition-all duration-300 flex flex-col justify-between">
              <div className="relative aspect-video overflow-hidden">
                <img 
                  src={puja.coverImage || DEFAULT_PLACEHOLDER_IMAGE} 
                  alt={puja.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                  <Badge className="bg-black/80 text-white border-none text-[10px] font-bold">
                    {puja.category?.name || 'Vedic Ritual'}
                  </Badge>
                  {puja.isVip && (
                    <Badge className="bg-amber-500 hover:bg-amber-600 border-none text-black font-extrabold text-[10px] flex items-center gap-1">
                      <Star className="h-3 w-3 fill-black" /> VIP
                    </Badge>
                  )}
                </div>
                {puja.isOnline && (
                  <div className="absolute bottom-3 right-3 bg-red-600 text-white font-bold text-[9px] px-2 py-0.5 rounded-md flex items-center gap-1 uppercase tracking-wider animate-pulse">
                    ● Live Stream
                  </div>
                )}
              </div>

              <CardContent className="p-5 flex-1 flex flex-col justify-between gap-4">
                <div className="space-y-2">
                  <h3 className="font-bold text-xl text-foreground group-hover:text-amber-600 transition-colors line-clamp-1">
                    {puja.name}
                  </h3>
                  
                  {puja.temple && (
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
                      <MapPin className="h-3.5 w-3.5 text-orange-500" />
                      <span className="line-clamp-1">{puja.temple.name} ({puja.temple.city})</span>
                    </div>
                  )}

                  <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                    {puja.shortDescription || 'Participate in this divine ritual to bring peace, prosperity, and blessings to your family.'}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-border/40 mt-auto">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Starting Price</span>
                    <span className="text-2xl font-black text-foreground">
                      ₹{parseFloat(puja.price?.toString() || '1100').toLocaleString('en-IN')}
                    </span>
                  </div>
                  <Button asChild size="sm" className="bg-amber-500 hover:bg-amber-600 text-black font-bold flex items-center gap-1.5 shadow-sm">
                    <Link href={`/bookings/new?pujaId=${puja.id}`}>
                      Book Now <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
