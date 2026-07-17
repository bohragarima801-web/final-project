import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { MapPin, Sparkles } from 'lucide-react'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export default async function VipPujasPage() {
  const pujas = await prisma.puja.findMany({
    where: { status: 'PUBLISHED', isVip: true },
    include: { category: true, temple: true },
    orderBy: { createdAt: 'desc' }
  }).catch(() => [])

  return (
    <div className="container py-14 space-y-10">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <Badge variant="secondary" className="mb-3 bg-yellow-100 text-yellow-800 border-yellow-300">⭐ VIP Services</Badge>
        <h1 className="text-4xl md:text-5xl font-black text-om-gradient">VIP Puja Anusthan (विशिष्ट पूजा)</h1>
        <p className="text-lg text-muted-foreground leading-relaxed">
          शीर्ष विद्वान आचार्यों और पंडितों द्वारा विशेष व्यक्तिगत पूजा एवं पाठ, महा-यज्ञ तथा अनुष्ठान।
        </p>
      </div>

      {pujas.length === 0 ? (
        <Card className="border-dashed max-w-md mx-auto">
          <CardContent className="p-8 text-center space-y-4">
            <Sparkles className="h-12 w-12 text-muted-foreground/60 mx-auto" />
            <h3 className="text-lg font-semibold">No VIP Pujas Scheduled</h3>
            <p className="text-sm text-muted-foreground">Check back soon for active VIP Puja services or ask our AI Pandit.</p>
            <Button asChild size="sm">
              <Link href="/ask-a-pandit">Ask AI Pandit ✨</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {pujas.map((p) => (
            <Card key={p.id} className="overflow-hidden group hover:shadow-xl transition-all border border-yellow-500/20 flex flex-col justify-between bg-gradient-to-b from-amber-50/20 to-white">
              <div className="relative aspect-[16/10] bg-slate-100 overflow-hidden">
                {p.coverImage ? (
                  <img
                    src={p.coverImage}
                    alt={p.name}
                    className="h-full w-full object-cover transition-transform group-hover:scale-105"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-primary bg-amber-50/50">
                    <Sparkles className="h-12 w-12 opacity-40 text-yellow-600" />
                  </div>
                )}
                <Badge className="absolute top-3 left-3 bg-amber-500 text-white font-bold border-none">
                  ⭐ EXCLUSIVE
                </Badge>
              </div>
              <CardContent className="p-5 flex-1 flex flex-col justify-between space-y-3">
                <div className="space-y-2">
                  <Badge variant="outline" className="text-xs text-yellow-700 border-yellow-300 bg-yellow-50">
                    {p.category?.name || 'Exclusive Ritual'}
                  </Badge>
                  <h3 className="font-bold text-lg text-slate-800 line-clamp-1 group-hover:text-amber-600 transition-colors">
                    {p.name}
                  </h3>
                  <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                    <MapPin className="h-4 w-4 text-amber-600 shrink-0" />
                    {p.temple?.name || 'Veda Pathshala / Special Mandap'}
                  </p>
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mt-2">
                    {p.shortDescription || 'Participate in this highly customized VIP ritual for health, prosperity, and lineage blessings.'}
                  </p>
                </div>
                <div className="pt-3 border-t flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-muted-foreground">VIP संकल्प मूल्य</span>
                    <span className="text-lg font-black text-amber-600">₹{p.vipPrice || p.price}</span>
                  </div>
                  <Button size="sm" className="bg-amber-500 hover:bg-amber-600 text-white font-bold" asChild>
                    <Link href={`/bookings/new?pujaId=${p.id}`}>बुक करें (Book VIP)</Link>
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
