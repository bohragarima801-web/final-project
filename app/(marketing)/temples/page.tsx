import { prisma } from '@/lib/prisma'
import { ensureDefaultCategoriesAndTemples } from '@/lib/data-defaults'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Building2, MapPin, Landmark, ArrowRight, Star } from 'lucide-react'
import { DEFAULT_PLACEHOLDER_IMAGE } from '@/lib/utils'

export const dynamic = 'force-dynamic'

export default async function TemplesPage() {
  await ensureDefaultCategoriesAndTemples()

  // Fetch only active temples
  const temples = await prisma.temple.findMany({
    where: { isActive: true },
    orderBy: { isFeatured: 'desc' }
  })

  return (
    <div className="container max-w-7xl mx-auto px-4 py-12 md:py-16 space-y-12">
      {/* Hero Section */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <Badge variant="secondary" className="px-3 py-1 text-xs font-semibold uppercase tracking-wider text-amber-700 bg-amber-50 border-amber-200/60">
          🗺️ Sacred Map
        </Badge>
        <h1 className="text-4xl md:text-5xl font-black tracking-tight text-foreground">
          Sacred <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 via-orange-600 to-red-600">Temples of India</span>
        </h1>
        <p className="text-lg text-muted-foreground leading-relaxed">
          Explore historic, spiritually vibrant temples enrolled with our network. Choose your temple to orchestrate direct bookings, archanas, and authentic rituals.
        </p>
      </div>

      {/* Grid List */}
      {temples.length === 0 ? (
        <Card className="border-dashed bg-muted/20">
          <CardContent className="p-12 text-center space-y-4">
            <p className="text-muted-foreground">No active temples registered yet. Please add published temples from the Admin Panel.</p>
            <Button asChild size="sm">
              <Link href="/admin/temples">Go to Admin Panel</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {temples.map((temple) => (
            <Card key={temple.id} className="group overflow-hidden border border-border/60 hover:shadow-xl hover:border-amber-500/40 transition-all duration-300 flex flex-col justify-between">
              <div className="relative aspect-video overflow-hidden">
                <img 
                  src={temple.coverImage || DEFAULT_PLACEHOLDER_IMAGE} 
                  alt={temple.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                  <Badge className="bg-black/80 text-white border-none text-[10px] font-bold uppercase tracking-wider">
                    🕉️ {temple.deity || 'Shiva'}
                  </Badge>
                  {temple.isFeatured && (
                    <Badge className="bg-amber-500 hover:bg-amber-600 border-none text-black font-extrabold text-[10px] flex items-center gap-1">
                      <Star className="h-3 w-3 fill-black" /> Featured
                    </Badge>
                  )}
                </div>
              </div>

              <CardContent className="p-5 flex-1 flex flex-col justify-between gap-4">
                <div className="space-y-2">
                  <h3 className="font-bold text-xl text-foreground group-hover:text-amber-600 transition-colors line-clamp-1">
                    {temple.name}
                  </h3>
                  
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
                    <MapPin className="h-3.5 w-3.5 text-orange-500" />
                    <span>{temple.city}, {temple.state}</span>
                  </div>

                  {temple.address && (
                    <p className="text-[11px] text-muted-foreground font-mono leading-relaxed line-clamp-1">
                      {temple.address}
                    </p>
                  )}

                  <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                    {temple.description || 'A spiritually historic temple holding sacred shrines and highly powerful celestial energies.'}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-border/40 mt-auto">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-600">
                    <Landmark className="h-4 w-4" /> Enrolled Center
                  </div>
                  <Button asChild size="sm" variant="outline" className="font-semibold flex items-center gap-1.5 group-hover:bg-amber-500 group-hover:text-black group-hover:border-amber-500 transition-colors">
                    <Link href={`/pujas?templeId=${temple.id}`}>
                      View Pujas <ArrowRight className="h-4 w-4" />
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
