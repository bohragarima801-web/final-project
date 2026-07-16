import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { PageHeader } from '@/components/admin/page-header'
import { Sparkles, Sparkle, Star, Calendar, Gem, ScrollText, Bot, Music, ArrowRight } from 'lucide-react'

const tools = [
  { title: 'Ask a Pandit ✨', desc: 'AI-powered spiritual guidance in Hindi, English or Hinglish.', href: '/ask-a-pandit', icon: Bot, live: true, badge: 'AI • Gemini 2.5' },
  { title: 'Kundali', desc: 'Generate your birth chart with detailed dasha analysis.', href: '/tools#kundali', icon: ScrollText },
  { title: 'Kundali Milan', desc: 'Check marriage compatibility using 36-guna matching.', href: '/tools#milan', icon: Sparkle },
  { title: 'Panchang', desc: 'Daily Hindu calendar with tithi, nakshatra & yoga.', href: '/tools#panchang', icon: Calendar },
  { title: 'Muhurat', desc: 'Find auspicious timings for weddings, griha pravesh & pujas.', href: '/tools#muhurat', icon: Star },
  { title: 'Numerology', desc: 'Discover your lucky number, life path & compatibility.', href: '/tools#numerology', icon: Sparkles },
  { title: 'Ratna Suggestion', desc: 'Personalized gemstone recommendation.', href: '/tools#ratna', icon: Gem },
  { title: 'Mala Counter', desc: 'Digital jaap tracker with mantra library.', href: '/tools#mala', icon: Music },
]

export default function ToolsPage() {
  return (
    <div className="container py-12">
      <div className="text-center max-w-2xl mx-auto">
        <Badge variant="secondary" className="mb-3">🔮 Spiritual Tools</Badge>
        <h1 className="text-4xl md:text-5xl font-black text-om-gradient">Sacred Tools</h1>
        <p className="mt-3 text-muted-foreground">Astrology, numerology, calendars & AI — all in one place.</p>
      </div>

      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {tools.map((t) => {
          const Icon = t.icon
          return (
            <Card key={t.href} className="group hover:shadow-xl hover:-translate-y-1 transition-all overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="h-12 w-12 rounded-xl om-gradient flex items-center justify-center"><Icon className="h-6 w-6 text-white" /></div>
                  {t.badge && <Badge className="text-[10px]">{t.badge}</Badge>}
                  {!t.badge && !t.live && <Badge variant="secondary" className="text-[10px]">Coming Soon</Badge>}
                </div>
                <h3 className="font-semibold text-lg">{t.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{t.desc}</p>
                <Button asChild variant={t.live ? 'default' : 'outline'} size="sm" className="mt-4">
                  <Link href={t.href}>{t.live ? 'Try Now' : 'Notify Me'} <ArrowRight className="h-3 w-3 ml-1" /></Link>
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
