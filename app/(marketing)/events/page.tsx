import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Calendar, MapPin, Video, Sparkles, AlertCircle } from 'lucide-react'
import { prisma } from '@/lib/prisma'

export const revalidate = 60

// Helper to get embeddable YouTube link if applicable
function getEmbedUrl(url: string | null) {
  if (!url) return null
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/
  const match = url.match(regExp)
  return match && match[2].length === 11 ? `https://www.youtube.com/embed/${match[2]}` : url
}

export default async function EventsPage() {
  const events = await prisma.event.findMany({
    where: { isActive: true },
    orderBy: { startsAt: 'asc' }
  }).catch(() => [])

  // Find any currently live stream
  const liveEvent = events.find((e) => e.isLive && e.streamUrl)
  const embedUrl = liveEvent ? getEmbedUrl(liveEvent.streamUrl) : null

  return (
    <div className="container py-14 space-y-12">
      {/* HEADER */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <Badge variant="secondary" className="mb-3 bg-red-100 text-red-700 hover:bg-red-100 border-none animate-pulse">🔴 Live Darshan</Badge>
        <h1 className="text-4xl md:text-5xl font-black text-om-gradient">Live Events & Festivals</h1>
        <p className="text-lg text-muted-foreground leading-relaxed">
          भारत के प्रमुख मंदिरों से साक्षात लाइव आरती, उत्सव एवं पावन धार्मिक कार्यक्रमों से जुड़ें।
        </p>
      </div>

      {/* LIVE STREAM SECTION */}
      {liveEvent ? (
        <Card className="overflow-hidden border-2 border-red-500 shadow-2xl">
          <div className="bg-red-600 text-white px-6 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-white animate-ping" />
              <span className="font-black text-sm tracking-wider">LIVE STREAMING NOW</span>
            </div>
            <Badge variant="outline" className="border-white text-white text-[10px] uppercase font-bold">
              {liveEvent.location || 'Holy Place'}
            </Badge>
          </div>
          <div className="grid lg:grid-cols-3 gap-0">
            <div className="lg:col-span-2 aspect-video bg-black relative">
              {embedUrl ? (
                <iframe
                  src={embedUrl}
                  title={liveEvent.title}
                  className="h-full w-full border-none"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <div className="h-full w-full flex flex-col items-center justify-center text-slate-400 gap-3">
                  <Video className="h-16 w-16 opacity-40 animate-pulse text-red-500" />
                  <p className="text-sm font-semibold">Live broadcast starting shortly...</p>
                </div>
              )}
            </div>
            <CardContent className="p-6 flex flex-col justify-between bg-slate-900 text-white">
              <div className="space-y-4">
                <Badge className="bg-red-500/10 border-red-500/30 text-red-400">🔴 Live</Badge>
                <h2 className="text-2xl font-black">{liveEvent.title}</h2>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {liveEvent.description || 'Watch the sacred rituals, aarti, and darshan live from the temple.'}
                </p>
              </div>
              <div className="pt-6 border-t border-slate-800 space-y-3">
                <div className="text-xs text-slate-400 flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-orange-500" />
                  {liveEvent.location || 'All India Temples'}
                </div>
                <Button className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold" asChild>
                  <Link href="/pujas">Book Puja for Next Event</Link>
                </Button>
              </div>
            </CardContent>
          </div>
        </Card>
      ) : (
        <Card className="border border-dashed bg-slate-50/50">
          <CardContent className="p-10 text-center space-y-4 max-w-md mx-auto">
            <Video className="h-12 w-12 text-slate-400 mx-auto" />
            <h3 className="text-lg font-bold text-slate-800">No Active Live Streams</h3>
            <p className="text-sm text-slate-600">
              वर्तमान में कोई लाइव आरती या प्रसारण सक्रिय नहीं है। कृपया नीचे दी गई आगामी उत्सव अनुसूची देखें।
            </p>
            <Button asChild size="sm" variant="outline" className="border-slate-200">
              <Link href="/pujas">Browse Online Pujas</Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {/* SCHEDULE & UPCOMING EVENTS */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-slate-800 border-l-4 border-orange-500 pl-3">
          आगामी उत्सव एवं लाइव शेड्यूल (Festival Schedule)
        </h2>

        {events.length === 0 ? (
          <div className="text-center py-10 text-muted-foreground text-sm">
            कोई आगामी लाइव इवेंट अनुसूचित नहीं है। कृपया जल्द ही दोबारा जांचें।
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {events.map((e) => {
              const startFormatted = new Date(e.startsAt).toLocaleDateString('hi-IN', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })

              return (
                <Card key={e.id} className="overflow-hidden group hover:shadow-lg transition-all border border-slate-100 flex flex-col justify-between">
                  <div className="relative aspect-[16/10] bg-slate-100 overflow-hidden">
                    {e.coverImage ? (
                      <img src={e.coverImage} alt={e.title} className="h-full w-full object-cover transition-transform group-hover:scale-105" />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center text-primary bg-orange-50/50">
                        <Sparkles className="h-10 w-10 opacity-30" />
                      </div>
                    )}
                    {e.isLive && (
                      <Badge className="absolute top-3 left-3 bg-red-600 text-white font-bold border-none text-[10px] animate-pulse">
                        🔴 LIVE NOW
                      </Badge>
                    )}
                  </div>
                  <CardContent className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <div className="text-xs text-orange-600 font-bold flex items-center gap-1">
                        <Calendar className="h-4 w-4" /> {startFormatted}
                      </div>
                      <h3 className="font-bold text-base text-slate-800 group-hover:text-orange-600 transition-colors line-clamp-1">{e.title}</h3>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5 text-primary shrink-0" />
                        {e.location || 'Holy Place'}
                      </p>
                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mt-2">
                        {e.description || 'Watch the sacred rituals and darshan live.'}
                      </p>
                    </div>
                    <div className="pt-3 border-t">
                      {e.isLive && e.streamUrl ? (
                        <Button className="w-full bg-red-600 hover:bg-red-700 text-white font-bold text-xs" asChild>
                          <Link href="/events">🔴 अभी लाइव देखें (Watch Live)</Link>
                        </Button>
                      ) : (
                        <Button className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs" asChild>
                          <Link href="/pujas">अनुष्ठान बुक करें (Book Puja)</Link>
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
