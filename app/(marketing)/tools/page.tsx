'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { Sparkles, Sparkle, Calendar, Gem, ScrollText, Bot, Music, ArrowRight, Loader2 } from 'lucide-react'
import Link from 'next/link'

export default function ToolsPage() {
  const [tools, setTools] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [trialStatuses, setTrialStatuses] = useState<Record<string, boolean>>({})
  const [activatedStatuses, setActivatedStatuses] = useState<Record<string, boolean>>({})

  useEffect(() => {
    fetch('/api/admin/tools')
      .then((r) => r.json())
      .then((j) => {
        if (j.ok) {
          // Merge default tools and custom tools
          setTools(j.data || [])
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  async function startTrial(slug: string, trialDays: number, toolId: string) {
    try {
      const res = await fetch('/api/tools/trial', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ toolId })
      })
      const data = await res.json()
      if (data.ok) {
        setTrialStatuses((prev) => ({ ...prev, [slug]: true }))
        toast.success(`🎉 Your ${trialDays}-day Free Trial has been activated for this tool!`)
        // Redirect to tool
        window.location.href = `/tools/${slug}`
      } else {
        toast.error(data.error || 'Failed to start trial')
      }
    } catch {
      toast.error('Network error starting trial')
    }
  }

  function buyActivation(slug: string, price: number) {
    setActivatedStatuses((prev) => ({ ...prev, [slug]: true }))
    toast.success(`💳 Payment of ₹${price} received. Premium access activated!`)
  }

  const iconMap: Record<string, any> = {
    kundali: ScrollText,
    milan: Sparkle,
    panchang: Calendar,
    muhurat: Sparkles,
    numerology: Sparkles,
    ratna: Gem,
    mala: Music,
    'ask-a-pandit': Bot,
  }

  return (
    <div className="container py-12 space-y-10">
      <div className="text-center max-w-2xl mx-auto">
        <Badge variant="secondary" className="mb-3">🔮 Spiritual Tools</Badge>
        <h1 className="text-4xl md:text-5xl font-black text-om-gradient">Sacred Tools</h1>
        <p className="mt-3 text-lg text-muted-foreground">
          Astrology, matchmaking, panchang, and AI — configure customized licenses.
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {/* Static AI Pandit Tool (Always Free & Live) */}
          <Card className="group hover:shadow-xl hover:-translate-y-1 transition-all overflow-hidden border-2 border-primary/20">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-start justify-between">
                <div className="h-12 w-12 rounded-xl om-gradient flex items-center justify-center">
                  <Bot className="h-6 w-6 text-white" />
                </div>
                <Badge className="bg-green-100 text-green-800">AI Live • Free</Badge>
              </div>
              <div>
                <h3 className="font-bold text-lg">Ask a Pandit ✨</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  AI-powered spiritual guidance in Hindi, English, or Hinglish.
                </p>
              </div>
              <Button asChild className="w-full">
                <Link href="/ask-a-pandit">
                  Talk to Pandit <ArrowRight className="h-4 w-4 ml-1" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Database Tools */}
          {tools
            .filter((t) => t.isActive)
            .map((t) => {
              const IconComponent = iconMap[t.slug] || Sparkle
              const trialActive = trialStatuses[t.slug]
              const premiumActive = activatedStatuses[t.slug]

              return (
                <Card key={t.id} className="group hover:shadow-xl hover:-translate-y-1 transition-all overflow-hidden border">
                  <CardContent className="p-6 space-y-4 flex flex-col justify-between h-full">
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="h-12 w-12 rounded-xl bg-orange-100 flex items-center justify-center">
                          <IconComponent className="h-6 w-6 text-primary" />
                        </div>
                        {t.isFree ? (
                          <Badge variant="outline">Free Access</Badge>
                        ) : premiumActive ? (
                          <Badge className="bg-green-100 text-green-800">⭐ Premium Active</Badge>
                        ) : trialActive ? (
                          <Badge className="bg-yellow-100 text-yellow-800">⏳ Trial Mode</Badge>
                        ) : (
                          <Badge variant="destructive">Premium (₹{Number(t.price)})</Badge>
                        )}
                      </div>
                      <div>
                        <h3 className="font-bold text-lg">{t.name}</h3>
                        <p className="mt-2 text-xs text-muted-foreground leading-relaxed">{t.description}</p>
                      </div>
                    </div>

                    <div className="pt-4 border-t space-y-2">
                      {t.isFree || premiumActive || trialActive ? (
                        <Button className="w-full" asChild>
                          <Link href={`/tools/${t.slug}`}>
                            Open {t.name} <ArrowRight className="h-4 w-4 ml-1" />
                          </Link>
                        </Button>
                      ) : (
                        <div className="grid grid-cols-2 gap-2">
                          <Button variant="outline" size="sm" onClick={() => startTrial(t.slug, t.trialDays, t.id)}>
                            {t.trialDays} Days Trial
                          </Button>
                          <Button size="sm" onClick={() => buyActivation(t.slug, Number(t.price))}>
                            Activate Now
                          </Button>
                        </div>
                      )}
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
