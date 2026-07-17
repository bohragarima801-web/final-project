import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Flame, HandCoins, Sparkles, ShoppingBag, Star, ArrowRight,
  MapPin, Calendar, ShieldCheck, Video, Play,
} from 'lucide-react'

const upcomingPujas = [
  { name: 'Maha Rudrabhishek', temple: 'Kashi Vishwanath', date: '15 Jul', img: 'https://images.unsplash.com/photo-1609766418204-94aae0ecfdfc?w=600', price: 1100, vip: false },
  { name: 'Guru Purnima Puja', temple: 'Somnath', date: '21 Jul', img: 'https://images.unsplash.com/photo-1583324113626-70df0f4deaab?w=600', price: 2100, vip: false },
  { name: 'Sawan Somvar Puja', temple: 'Baidyanath Dham', date: 'Every Mon', img: 'https://images.unsplash.com/photo-1580889240912-6f5cc9e07d84?w=600', price: 851, vip: false },
  { name: 'Nag Panchami Puja', temple: 'Ujjain Mahakal', date: '29 Jul', img: 'https://images.unsplash.com/photo-1588580000645-4562a6d2c839?w=600', price: 1251, vip: true },
]

const services = [
  { icon: Flame, title: 'Online Pujas', desc: 'Book pujas across 500+ temples with live streaming.', href: '/pujas', color: 'from-orange-500/20 to-orange-500/5' },
  { icon: Sparkles, title: 'Chadhawa Seva', desc: 'Offer flowers, prasad, bhog & deep daan.', href: '/chadhawa', color: 'from-yellow-500/20 to-yellow-500/5' },
  { icon: ShoppingBag, title: 'Abhimantrit Products', desc: 'Prasad, rudraksha, idols & spiritual books.', href: '/products', color: 'from-pink-500/20 to-pink-500/5' },
]

const testimonials = [
  { name: 'Anjali Sharma', location: 'Mumbai', rating: 5, message: 'The puja was conducted with such devotion. Received prasad within a week!' },
  { name: 'Rajesh Kumar', location: 'Delhi', rating: 5, message: 'Live streaming quality was superb. Felt like being at the temple.' },
  { name: 'Priya Nair', location: 'Bangalore', rating: 5, message: 'Excellent service and authentic pandits. Highly recommended.' },
]

import { prisma } from '@/lib/prisma'

export default async function HomePage() {
  const products = await prisma.product.findMany({
    take: 4,
    include: { category: true }
  }).catch(() => [])
  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 om-gradient opacity-[0.08]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_hsl(22_92%_50%/0.15),transparent_50%)]" />
        <div className="container relative py-20 lg:py-28">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge variant="secondary" className="mb-4">🕊️ Sanatan Seva • Online</Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black leading-tight">
                <span className="text-om-gradient">दिव्ययज्ञम्</span>
                <br />
                Book Sacred Pujas, Anywhere.
              </h1>
              <p className="mt-5 text-lg text-muted-foreground max-w-xl">
                Live-streamed pujas from India’s most powerful temples — performed by certified pandits with your name & gotra. Prasad delivered to your doorstep.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button size="lg" asChild>
                  <Link href="/pujas">Book a Puja <ArrowRight className="ml-2 h-4 w-4" /></Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/tools"><Sparkles className="mr-2 h-4 w-4" /> Spiritual Tools</Link>
                </Button>
              </div>
              <div className="mt-8 flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-primary" /> 100% Authentic Pandits</div>
                <div className="flex items-center gap-2"><Video className="h-4 w-4 text-primary" /> Live Streaming</div>
                <div className="flex items-center gap-2"><Star className="h-4 w-4 text-primary fill-primary" /> 4.9/5 (12,000+ devotees)</div>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-[4/5] rounded-3xl overflow-hidden diya-glow bg-gradient-to-br from-primary/30 to-accent/30">
                <img
                  src="https://images.unsplash.com/photo-1609766418204-94aae0ecfdfc?w=900"
                  alt="Puja ceremony"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-card border border-border rounded-2xl shadow-xl p-4 max-w-[220px]">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                  <span className="text-xs font-semibold">LIVE NOW</span>
                </div>
                <p className="mt-2 text-sm font-medium">Sawan Rudrabhishek</p>
                <p className="text-xs text-muted-foreground">Kashi Vishwanath • 1,240 watching</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="container py-16">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-3xl md:text-4xl font-bold">Divine Services</h2>
          <p className="mt-3 text-muted-foreground">Everything you need for your spiritual journey.</p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((s) => {
            const Icon = s.icon
            return (
              <Link key={s.href} href={s.href} className="group">
                <Card className="h-full transition-all group-hover:-translate-y-1 group-hover:shadow-lg">
                  <CardContent className="p-6">
                    <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center mb-4`}>
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-semibold text-lg">{s.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">{s.desc}</p>
                    <div className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary">
                      Explore <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
      </section>

      {/* UPCOMING PUJAS */}
      <section className="container py-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <Badge variant="outline" className="mb-3">📅 Upcoming</Badge>
            <h2 className="text-3xl md:text-4xl font-bold">Upcoming Pujas</h2>
            <p className="mt-2 text-muted-foreground">Reserve your sankalp for these sacred occasions.</p>
          </div>
          <Button variant="outline" asChild><Link href="/pujas">View all <ArrowRight className="ml-2 h-4 w-4" /></Link></Button>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {upcomingPujas.map((p, i) => (
            <Card key={i} className="overflow-hidden group hover:shadow-lg transition-all">
              <div className="relative aspect-[4/3] overflow-hidden">
                <img src={p.img} alt={p.name} className="h-full w-full object-cover transition-transform group-hover:scale-105" />
                {p.vip && <Badge className="absolute top-3 left-3 bg-accent">⭐ VIP</Badge>}
                <div className="absolute top-3 right-3 bg-background/90 backdrop-blur px-2 py-1 rounded-md text-xs font-semibold flex items-center gap-1">
                  <Calendar className="h-3 w-3" /> {p.date}
                </div>
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold line-clamp-1">{p.name}</h3>
                <p className="mt-1 text-xs text-muted-foreground flex items-center gap-1">
                  <MapPin className="h-3 w-3" /> {p.temple}
                </p>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-lg font-bold text-primary">₹{p.price}</span>
                  <Button size="sm">Book</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* SACRED PRODUCTS */}
      <section className="container py-16 bg-muted/20">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <Badge variant="outline" className="mb-3">🛍️ Store</Badge>
            <h2 className="text-3xl md:text-4xl font-bold">Abhimantrit Products</h2>
            <p className="mt-2 text-muted-foreground">Authentic, energized accessories, rudraksha, and spiritual books.</p>
          </div>
          <Button variant="outline" asChild><Link href="/products">View all <ArrowRight className="ml-2 h-4 w-4" /></Link></Button>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((p: any) => (
            <Card key={p.id} className="overflow-hidden group hover:shadow-lg transition-all flex flex-col justify-between border border-primary/10">
              <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                {p.coverImage || (p.images && p.images[0]) ? (
                  <img src={p.coverImage || p.images[0]} alt={p.name} className="h-full w-full object-cover transition-transform group-hover:scale-105" />
                ) : (
                  <div className="h-full w-full bg-slate-200" />
                )}
                {p.category?.name && <Badge className="absolute top-3 left-3 bg-primary text-white border-none">{p.category.name}</Badge>}
              </div>
              <CardContent className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <h3 className="font-semibold line-clamp-1 group-hover:text-amber-600 transition-colors">{p.name}</h3>
                  <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{p.shortDescription || 'Authentic divine accessory.'}</p>
                </div>
                <div className="mt-4 flex items-center justify-between pt-2 border-t">
                  <span className="text-lg font-bold text-foreground">₹{Number(p.salePrice || p.price)}</span>
                  <Button size="sm" asChild>
                    <Link href={`/products`}>Buy Now</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* LIVE EVENTS BANNER */}
      <section className="container py-10">
        <div className="rounded-3xl om-gradient p-1">
          <div className="rounded-[calc(1.5rem-4px)] bg-background p-8 md:p-12 grid md:grid-cols-2 items-center gap-6">
            <div>
              <Badge className="bg-red-500 text-white mb-3"><Play className="h-3 w-3 mr-1 fill-white" /> LIVE</Badge>
              <h2 className="text-3xl font-bold">Watch Live Aarti & Events</h2>
              <p className="mt-2 text-muted-foreground">Experience daily aarti from the most sacred temples — anytime, anywhere.</p>
              <Button className="mt-5" asChild><Link href="/events">Watch Now</Link></Button>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[1,2,3,4,5,6].map((i) => (
                <div key={i} className="aspect-square rounded-lg bg-muted overflow-hidden">
                  <img src={`https://images.unsplash.com/photo-15${80+i}88580000645-4562a6d2c839?w=200`} className="h-full w-full object-cover" alt="" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="container py-16">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-3xl md:text-4xl font-bold">Devotees Speak</h2>
          <p className="mt-3 text-muted-foreground">Trusted by thousands of families worldwide.</p>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="flex gap-0.5">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} className="h-4 w-4 fill-primary text-primary" />
                  ))}
                </div>
                <p className="mt-3 text-sm">“{t.message}”</p>
                <div className="mt-4 flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full om-gradient" />
                  <div>
                    <p className="text-sm font-semibold">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.location}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container pb-20">
        <div className="rounded-3xl om-gradient p-10 md:p-14 text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold">Begin your sacred journey today</h2>
          <p className="mt-3 opacity-90 max-w-xl mx-auto">Join 100,000+ devotees who trust Devyajnam for their spiritual needs.</p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Button size="lg" variant="secondary" asChild><Link href="/register">Create Free Account</Link></Button>
            <Button size="lg" variant="outline" className="bg-transparent border-white/40 text-white hover:bg-white/10" asChild>
              <Link href="/pujas">Browse Pujas</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
