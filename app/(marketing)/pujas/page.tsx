import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Calendar, MapPin, Sparkles } from 'lucide-react'
import { prisma } from '@/lib/prisma'

export const revalidate = 60

export default async function PujasPage() {
  const pujas = await prisma.puja.findMany({
    where: { status: 'PUBLISHED' },
    include: { category: true, temple: true },
    orderBy: { createdAt: 'desc' }
  }).catch(() => [])

  return (
    <div className="container py-14 space-y-10">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <Badge variant="secondary" className="mb-3">🔥 Pujas</Badge>
        <h1 className="text-4xl md:text-5xl font-black text-om-gradient">Sacred Pujas (पूजा अनुष्ठान)</h1>
        <p className="text-lg text-muted-foreground leading-relaxed">
          भारत के सुप्रसिद्ध शक्तिपीठों एवं ज्योतिर्लिंगों से सीधे लाइव-स्ट्रीम पूजा। अपने नाम व गोत्र से संकल्प करवाएं।
        </p>
      </div>

      {pujas.length === 0 ? (
        <Card className="border-dashed max-w-md mx-auto">
          <CardContent className="p-8 text-center space-y-4">
            <Sparkles className="h-12 w-12 text-muted-foreground/60 mx-auto" />
            <h3 className="text-lg font-semibold">No Pujas Scheduled</h3>
            <p className="text-sm text-muted-foreground">Check back soon for available online Puja services or ask our AI Pandit.</p>
            <Button asChild size="sm">
              <Link href="/ask-a-pandit">Ask AI Pandit ✨</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {pujas.map((p) => (
            <Card key={p.id} className="overflow-hidden group hover:shadow-xl transition-all border border-primary/10 flex flex-col justify-between">
              <div className="relative aspect-[16/10] bg-slate-100 overflow-hidden">
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
                {p.isVip && (
                  <Badge className="absolute top-3 left-3 bg-red-600 text-white font-bold border-none">
                    ⭐ VIP
                  </Badge>
                )}
                {p.isOnline && (
                  <Badge className="absolute top-3 right-3 bg-green-600 text-white font-bold border-none text-[10px]">
                    📹 LIVE STREAM
                  </Badge>
                )}
              </div>
              <CardContent className="p-5 flex-1 flex flex-col justify-between space-y-3">
                <div className="space-y-2">
                  <Badge variant="outline" className="text-xs">
                    {p.category?.name || 'Sanatan Seva'}
                  </Badge>
                  <h3 className="font-bold text-lg text-slate-800 line-clamp-1 group-hover:text-orange-600 transition-colors">
                    {p.name}
                  </h3>
                  <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                    <MapPin className="h-4 w-4 text-orange-600 shrink-0" />
                    {p.temple?.name || 'Any Holy Temple'}
                  </p>
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mt-2">
                    {p.shortDescription || 'Participate in this sacred puja for peace, health, and spiritual growth.'}
                  </p>
                </div>
                <div className="pt-3 border-t flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-muted-foreground">संकल्प मूल्य</span>
                    <span className="text-lg font-black text-orange-600">₹{p.price}</span>
                  </div>
                  <Button size="sm" className="bg-orange-600 hover:bg-orange-700 text-white font-bold" asChild>
                    <Link href={`/bookings/new?pujaId=${p.id}`}>बुक करें (Book)</Link>
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
