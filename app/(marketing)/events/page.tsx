import prisma from '@/lib/prisma'
import { PublicPageShell } from '@/components/public-page-shell'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Play, MapPin, Calendar, Video, Volume2, Info } from 'lucide-react'

export const dynamic = 'force-dynamic'

function getEmbedUrl(url: string) {
  if (!url) return ''
  try {
    let videoId = ''
    if (url.includes('youtube.com/watch')) {
      const parts = url.split('?')
      if (parts[1]) {
        const urlParams = new URLSearchParams(parts[1])
        videoId = urlParams.get('v') || ''
      }
    } else if (url.includes('youtu.be/')) {
      const parts = url.split('youtu.be/')
      if (parts[1]) {
        videoId = parts[1].split('?')[0] || ''
      }
    } else if (url.includes('youtube.com/embed/')) {
      return url
    }
    return videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1` : url
  } catch {
    return url
  }
}

export default async function EventsPage() {
  // Fetch events from DB
  const dbEvents = await prisma.event.findMany({
    where: { isActive: true },
    orderBy: { startsAt: 'desc' }
  }).catch(() => [])

  // Sample/fallback high quality live streams if DB has none
  const sampleEvents = [
    {
      id: 'samp-1',
      title: 'Sacred Evening Ganga Aarti from Varanasi',
      description: 'Experience the spectacular daily Ganga Aarti performed at Dashashwamedh Ghat in Varanasi. Watch the divine brass lamps ritual and listening to high energy chanting of hymns.',
      coverImage: 'https://images.unsplash.com/photo-1561361513-2d000a50f0db?w=800',
      location: 'Dashashwamedh Ghat, Varanasi, UP',
      startsAt: new Date(),
      isLive: true,
      streamUrl: 'https://www.youtube.com/watch?v=v38kU8g_J74'
    },
    {
      id: 'samp-2',
      title: 'Mahakaleshwar Jyotirlinga Bhasma Aarti',
      description: 'Experience the world-famous morning Bhasma Aarti of Lord Mahakal in Ujjain. The divine ritual is performed daily with sacred ash.',
      coverImage: 'https://images.unsplash.com/photo-1609766418204-94aae0ecfdfc?w=800',
      location: 'Ujjain Mahakal Temple, MP',
      startsAt: new Date(Date.now() + 86400000), // tomorrow
      isLive: false,
      streamUrl: ''
    },
    {
      id: 'samp-3',
      title: 'Tirupati Balaji Kalyanotsavam',
      description: 'Watch the divine marriage ceremony ritual performed for Lord Venkateswara and His consorts at Tirumala.',
      coverImage: 'https://images.unsplash.com/photo-1583324113626-70df0f4deaab?w=800',
      location: 'Tirupati Balaji Temple, Andhra Pradesh',
      startsAt: new Date(Date.now() + 172800000), // in 2 days
      isLive: false,
      streamUrl: ''
    }
  ]

  const allEvents = dbEvents.length > 0 ? dbEvents.map(e => ({
    id: e.id,
    title: e.title,
    description: e.description || '',
    coverImage: e.coverImage || 'https://images.unsplash.com/photo-1609766418204-94aae0ecfdfc?w=800',
    location: e.location || 'Sacred Temple',
    startsAt: e.startsAt,
    isLive: e.isLive,
    streamUrl: e.streamUrl || ''
  })) : sampleEvents

  // Separate active/live event
  const liveEvent = allEvents.find(e => e.isLive && e.streamUrl)
  const remainingEvents = allEvents.filter(e => e.id !== liveEvent?.id)

  return (
    <PublicPageShell
      badge="🎥 Live Event"
      title="Live Aarti & Events"
      subtitle="Experience divine rituals and daily aartis from sacred temples across India in real-time."
    >
      <div className="space-y-12 mt-6">
        
        {/* LIVE STREAM player section */}
        {liveEvent ? (
          <div className="rounded-3xl border border-primary/20 bg-card p-1 shadow-2xl diya-glow">
            <div className="grid lg:grid-cols-12 gap-6 p-4 md:p-6 items-center">
              {/* Video Player */}
              <div className="lg:col-span-8 overflow-hidden rounded-2xl bg-black aspect-video relative group border border-border">
                {getEmbedUrl(liveEvent.streamUrl) ? (
                  <iframe
                    src={getEmbedUrl(liveEvent.streamUrl)}
                    title={liveEvent.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    className="absolute inset-0 w-full h-full border-0"
                  />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 text-white space-y-4">
                    <Video className="h-16 w-16 text-primary animate-pulse" />
                    <p className="font-bold text-lg">Live Stream is starting soon...</p>
                  </div>
                )}
              </div>

              {/* Event Meta */}
              <div className="lg:col-span-4 space-y-6">
                <div className="space-y-2">
                  <Badge className="bg-red-500 hover:bg-red-600 text-white animate-pulse font-semibold flex items-center gap-1.5 w-fit">
                    <span className="h-2 w-2 rounded-full bg-white animate-ping" />
                    LIVE NOW
                  </Badge>
                  <h2 className="text-2xl md:text-3xl font-black text-om-gradient leading-tight">
                    {liveEvent.title}
                  </h2>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <MapPin className="h-4 w-4 text-primary shrink-0" />
                    <span>{liveEvent.location}</span>
                  </p>
                </div>

                {liveEvent.description && (
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {liveEvent.description}
                  </p>
                )}

                <div className="pt-4 border-t border-dashed space-y-3">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/60 p-3 rounded-xl">
                    <Volume2 className="h-4 w-4 text-primary shrink-0" />
                    <span>Turn up your volume to listen to sacred mantras and bells.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-muted/40 border border-dashed rounded-3xl p-8 text-center max-w-xl mx-auto py-12">
            <Video className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-bold">No Live Aarti right now</h3>
            <p className="text-sm text-muted-foreground mt-2">
              Daily live streams generally run during evening and morning aarti times. Check out the schedule below.
            </p>
          </div>
        )}

        {/* EVENTS SCHEDULE */}
        <div className="space-y-6">
          <div>
            <h3 className="text-2xl font-bold text-om-gradient">Rituals & Festivals Schedule</h3>
            <p className="text-sm text-muted-foreground">Book a puja to add your personal gotra sankalp into these events.</p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {remainingEvents.map((e) => {
              const formattedDate = new Date(e.startsAt).toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'short',
                hour: '2-digit',
                minute: '2-digit'
              })

              return (
                <Card key={e.id} className="overflow-hidden group hover:border-primary/40 hover:shadow-lg transition-all flex flex-col justify-between">
                  <div>
                    <div className="aspect-[16/10] overflow-hidden relative border-b">
                      <img
                        src={e.coverImage}
                        alt={e.title}
                        className="h-full w-full object-cover transition-transform group-hover:scale-103"
                      />
                      <Badge className="absolute top-3 right-3 bg-black/70 text-white backdrop-blur">
                        {formattedDate}
                      </Badge>
                    </div>

                    <CardContent className="p-5 space-y-3">
                      <h4 className="font-bold text-lg group-hover:text-primary transition-colors line-clamp-1">
                        {e.title}
                      </h4>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5 text-primary shrink-0" />
                        <span>{e.location}</span>
                      </p>
                      {e.description && (
                        <p className="text-sm text-muted-foreground line-clamp-3">
                          {e.description}
                        </p>
                      )}
                    </CardContent>
                  </div>

                  <div className="p-5 pt-0">
                    <Button asChild variant="outline" className="w-full">
                      <Link href="/pujas">
                        Book Gotra Sankalp
                      </Link>
                    </Button>
                  </div>
                </Card>
              )
            })}
          </div>
        </div>

      </div>
    </PublicPageShell>
  )
}
