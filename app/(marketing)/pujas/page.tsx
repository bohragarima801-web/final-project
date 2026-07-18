import Link from 'next/link'
import prisma from '@/lib/prisma'
import { PublicPageShell } from '@/components/public-page-shell'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { MapPin, Flame, Video, ArrowRight } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function PujasPage() {
  const dbPujas = await prisma.puja.findMany({
    where: { status: 'PUBLISHED' },
    include: { temple: true, category: true },
    orderBy: { createdAt: 'desc' }
  }).catch(() => [])

  return (
    <PublicPageShell 
      badge="🔥 Sacred Pujas" 
      title="Sacred Pujas" 
      subtitle="Book online pujas performed by certified pandits at India's most powerful temples."
    >
      <div className="mt-8">
        {dbPujas.length === 0 ? (
          <div className="text-center py-16 bg-muted/40 rounded-3xl border border-dashed p-8">
            <Flame className="h-12 w-12 text-primary mx-auto mb-4 animate-pulse" />
            <h3 className="text-xl font-bold">No Pujas Active Right Now</h3>
            <p className="text-muted-foreground mt-2 max-w-md mx-auto">
              We are currently setting up the sacred altars. Please check back soon or consult our AI Pandit for spiritual advice.
            </p>
            <Button asChild className="mt-6">
              <Link href="/ask-a-pandit">Ask AI Pandit ✨</Link>
            </Button>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {dbPujas.map((p) => {
              const coverImg = p.coverImage || 'https://images.unsplash.com/photo-1609766418204-94aae0ecfdfc?w=600'
              const price = Number(p.price) || 851

              return (
                <Link key={p.slug} href={`/pujas/${p.slug}`} className="block group">
                  <Card className="overflow-hidden h-full flex flex-col transition-all duration-300 hover:-translate-y-1 hover:shadow-xl border-border/60">
                    <div className="relative aspect-[16/10] overflow-hidden">
                      <img 
                        src={coverImg} 
                        alt={p.name} 
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" 
                      />
                      <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                        {p.isVip && <Badge className="bg-amber-600 text-white font-semibold">⭐ VIP</Badge>}
                        {p.isOnline && (
                          <Badge className="bg-red-500 text-white font-semibold flex items-center gap-1">
                            <Video className="h-3 w-3 animate-pulse" /> Live Stream
                          </Badge>
                        )}
                      </div>
                      {p.category && (
                        <span className="absolute bottom-3 right-3 bg-black/75 backdrop-blur-sm text-white text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded-md">
                          {p.category.name}
                        </span>
                      )}
                    </div>

                    <CardContent className="p-5 flex-1 flex flex-col justify-between">
                      <div className="space-y-2">
                        <h3 className="font-bold text-xl group-hover:text-primary transition-colors line-clamp-1">
                          {p.name}
                        </h3>
                        {p.temple && (
                          <p className="text-sm text-muted-foreground flex items-center gap-1">
                            <MapPin className="h-4 w-4 text-primary shrink-0" /> 
                            <span>{p.temple.name} • {p.temple.city}, {p.temple.state}</span>
                          </p>
                        )}
                        {p.shortDescription && (
                          <p className="text-sm text-muted-foreground line-clamp-2 pt-1">
                            {p.shortDescription}
                          </p>
                        )}
                      </div>

                      <div className="mt-6 pt-4 border-t border-dashed border-border/80 flex items-center justify-between">
                        <div>
                          <p className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Sankalp Price</p>
                          <p className="text-2xl font-black text-primary">₹{price}</p>
                        </div>
                        <Button size="sm" className="group-hover:bg-primary/90" asChild>
                          <Link href={`/pujas/${p.slug}`}>Book Puja</Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </PublicPageShell>
  )
}
