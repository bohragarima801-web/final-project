'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Loader2, Sparkles, Video, Flame } from 'lucide-react'
import Link from 'next/link'

function getEmbedUrl(url: string) {
  if (!url) return '';
  try {
    if (url.includes('youtube.com/shorts/')) {
      return url.replace('youtube.com/shorts/', 'youtube.com/embed/');
    }
    if (url.includes('youtube.com/watch')) {
      const u = new URL(url);
      const v = u.searchParams.get('v');
      if (v) return `https://www.youtube.com/embed/${v}`;
    }
    if (url.includes('youtu.be/')) {
      const v = url.split('youtu.be/')[1].split('?')[0];
      return `https://www.youtube.com/embed/${v}`;
    }
  } catch (e) {}
  return url;
}

export default function Page() {
  const [offerings, setOfferings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/admin/chadhawa')
      .then((r) => r.json())
      .then((j) => {
        if (j.ok) {
          // Show only active chadhawa offerings on public page
          setOfferings((j.data || []).filter((o: any) => o.isActive))
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="container py-14 space-y-10">
      <div className="text-center max-w-2xl mx-auto">
        <Badge variant="secondary" className="mb-3">🌼 Offerings</Badge>
        <h1 className="text-4xl md:text-5xl font-black text-om-gradient">Chadhawa Seva</h1>
        <p className="mt-3 text-lg text-muted-foreground">
          Offer flowers, prasad, bhog, deep daan, or gau seva at India's most powerful, heritage temples.
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : offerings.length === 0 ? (
        <Card className="border-dashed max-w-md mx-auto">
          <CardContent className="p-8 text-center space-y-4">
            <Sparkles className="h-12 w-12 text-muted-foreground/60 mx-auto" />
            <h3 className="text-lg font-semibold">No Offerings Active</h3>
            <p className="text-sm text-muted-foreground">Check back soon for available Chadhawa services.</p>
            <Button asChild size="sm">
              <Link href="/">Back Home</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {offerings.map((offering) => (
            <Card key={offering.id} className="overflow-hidden group hover:shadow-lg transition-all border border-primary/10">
              <div className="relative aspect-[16/10] bg-slate-100 overflow-hidden">
                {offering.image ? (
                  <img
                    src={offering.image}
                    alt={offering.name}
                    className="h-full w-full object-cover transition-transform group-hover:scale-105"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-primary bg-orange-50/50">
                    <Sparkles className="h-12 w-12 opacity-40" />
                  </div>
                )}
                {offering.videoUrl && (
                  <Badge className="absolute top-3 left-3 bg-red-600 text-white flex items-center gap-1">
                    <Video className="h-3 w-3" /> Video Stream
                  </Badge>
                )}
              </div>
              <CardContent className="p-5 space-y-3">
                <div>
                  <h3 className="font-bold text-lg text-slate-800 line-clamp-1">{offering.name}</h3>
                  <div className="text-lg font-extrabold text-primary mt-1">₹{Number(offering.price)}</div>
                </div>
                <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                  {offering.description || 'No description available for this sacred offering service.'}
                </p>
                {offering.videoUrl && (
                  <div className="aspect-video w-full rounded-md overflow-hidden mt-3 border bg-black shadow-sm">
                    <iframe
                      src={getEmbedUrl(offering.videoUrl)}
                      className="h-full w-full"
                      allowFullScreen
                      title={offering.name}
                    />
                  </div>
                )}
                <div className="pt-2 border-t flex justify-end">
                  <Button size="sm" asChild>
                    <Link href={`/pujas`}>Book Now</Link>
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
