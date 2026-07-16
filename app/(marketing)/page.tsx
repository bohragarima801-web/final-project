import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { prisma } from '@/lib/prisma'
import { ensureDefaultCategoriesAndTemples } from '@/lib/data-defaults'
import { DEFAULT_PLACEHOLDER_IMAGE } from '@/lib/utils'
import { getWebsiteSettings } from '@/lib/settings'
import {
  Flame, Sparkles, ShoppingBag, Star, ArrowRight,
  MapPin, Calendar, ShieldCheck, Video, Play,
} from 'lucide-react'

export const dynamic = 'force-dynamic'

const getPlaceholderSvg = (hue: number, label: string) => 
  `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600"><rect width="100%" height="100%" fill="hsl(${hue}, 30%, 96%)"/><circle cx="400" cy="300" r="180" fill="hsl(${hue}, 40%, 91%)" opacity="0.6"/><circle cx="400" cy="300" r="120" fill="none" stroke="hsl(${hue}, 50%, 82%)" stroke-width="4" stroke-dasharray="12 6"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="system-ui, sans-serif" font-size="26" font-weight="bold" fill="hsl(${hue}, 60%, 42%)">${encodeURIComponent(label)}</text></svg>`

const upcomingPujas = [
  { id: '1', name: 'Maha Rudrabhishek', temple: 'Kashi Vishwanath', date: '15 Jul', img: getPlaceholderSvg(22, 'Maha Rudrabhishek'), price: 1100, vip: false },
  { id: '2', name: 'Guru Purnima Puja', temple: 'Somnath', date: '21 Jul', img: getPlaceholderSvg(35, 'Guru Purnima Puja'), price: 2100, vip: false },
  { id: '3', name: 'Sawan Somvar Puja', temple: 'Baidyanath Dham', date: 'Every Mon', img: getPlaceholderSvg(15, 'Sawan Somvar Puja'), price: 851, vip: false },
  { id: '4', name: 'Nag Panchami Puja', temple: 'Ujjain Mahakal', date: '29 Jul', img: getPlaceholderSvg(160, 'Nag Panchami Puja'), price: 1251, vip: true },
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

export default async function HomePage() {
  await ensureDefaultCategoriesAndTemples()

  // Load website configurations
  const settings = await getWebsiteSettings()

  // Fetch featured published pujas
  const dbPujas = await prisma.puja.findMany({
    where: { status: 'PUBLISHED', isFeatured: true },
    include: { temple: true },
    take: 4
  })

  const pujasToRender = dbPujas.length > 0 ? dbPujas.map((p: any) => ({
    id: p.id,
    name: p.name,
    temple: p.temple?.name || 'All Temples',
    date: p.duration ? `${p.duration} mins` : 'Sawan Season',
    img: p.coverImage || DEFAULT_PLACEHOLDER_IMAGE,
    price: p.price,
    vip: p.isVip
  })) : upcomingPujas

  // Fetch active products for home page display
  const products = await prisma.product.findMany({
    where: { status: 'ACTIVE' },
    include: { category: true },
    take: 4,
    orderBy: { createdAt: 'desc' }
  })

  // Customizable Hero Values with beautiful defaults
  const customHeroTitle = settings.homepage_hero_title || 'Book Sacred Pujas, Anywhere.'
  const customHeroSubtitle = settings.homepage_hero_subtitle || 'Live-streamed pujas from India’s most powerful temples — performed by certified pandits with your name & gotra. Prasad delivered to your doorstep.'
  const customHeroCta = settings.homepage_hero_cta || 'Book a Puja'
  const customHeroCtaLink = settings.homepage_hero_cta_link || '/pujas'
  const customHeroImage = settings.homepage_hero_image || getPlaceholderSvg(22, 'Puja Ceremony')
  const customSiteName = settings.site_name || 'दिव्ययज्ञम्'

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
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight tracking-tight">
                <span className="inline-block bg-gradient-to-r from-[#FF512F] via-[#F09819] to-[#DD2476] bg-clip-text text-transparent drop-shadow-sm hover:scale-105 transition-transform duration-300">
                  {customSiteName}
                </span>
                <br />
                <span className="text-4xl md:text-5xl lg:text-6xl font-black text-foreground block mt-3 leading-tight">
                  Book <span className="bg-gradient-to-r from-[#f953c6] to-[#b91d73] bg-clip-text text-transparent">Sacred Pujas</span>, <span className="bg-gradient-to-r from-[#FF5F6D] to-[#FFC371] bg-clip-text text-transparent">Anywhere.</span>
                </span>
              </h1>
              <p className="mt-5 text-lg text-muted-foreground max-w-xl leading-relaxed">
                {customHeroSubtitle}
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button size="lg" asChild className="bg-primary hover:bg-primary/95 text-white">
                  <Link href={customHeroCtaLink}>{customHeroCta} <ArrowRight className="ml-2 h-4 w-4" /></Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/ask-a-pandit"><Sparkles className="mr-2 h-4 w-4" /> Ask a Pandit ✨</Link>
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
                  src={customHeroImage}
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
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
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
          {pujasToRender.map((p: any, i: number) => (
            <Card key={p.id || i} className="overflow-hidden group hover:shadow-lg transition-all flex flex-col justify-between">
              <div className="relative aspect-[4/3] overflow-hidden">
                <img src={p.img} alt={p.name} className="h-full w-full object-cover transition-transform group-hover:scale-105" />
                {p.vip && <Badge className="absolute top-3 left-3 bg-accent">⭐ VIP</Badge>}
                <div className="absolute top-3 right-3 bg-background/90 backdrop-blur px-2 py-1 rounded-md text-xs font-semibold flex items-center gap-1">
                  <Calendar className="h-3 w-3" /> {p.date}
                </div>
              </div>
              <CardContent className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-semibold line-clamp-1">{p.name}</h3>
                  <p className="mt-1 text-xs text-muted-foreground flex items-center gap-1">
                    <MapPin className="h-3 w-3" /> {p.temple}
                  </p>
                </div>
                <div className="mt-3 flex items-center justify-between pt-2 border-t border-border/40">
                  <span className="text-lg font-bold text-primary">₹{parseFloat(p.price?.toString() || '0').toLocaleString('en-IN')}</span>
                  <Button size="sm" asChild>
                    <Link href={`/bookings/new?pujaId=${p.id}`}>Book Now</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* SPIRITUAL PRODUCTS SECTION */}
      <section className="container py-16 bg-muted/30 border-y">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <Badge variant="outline" className="mb-3 bg-amber-50 border-amber-200 text-amber-800">🛍️ Divine Store</Badge>
            <h2 className="text-3xl md:text-4xl font-bold">Spiritual Store Products</h2>
            <p className="mt-2 text-muted-foreground">Authentic, energised accessories and samagri for your spiritual rituals.</p>
          </div>
          <Button variant="outline" asChild><Link href="/products">Browse Store <ArrowRight className="ml-2 h-4 w-4" /></Link></Button>
        </div>

        {products.length === 0 ? (
          <Card className="border-dashed bg-background p-8 text-center text-muted-foreground">
            No products available at the moment. Please update published items in the Admin Panel.
          </Card>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((product) => {
              const hasSale = !!product.salePrice && parseFloat(product.salePrice.toString()) < parseFloat(product.price.toString())
              const activePrice = hasSale ? product.salePrice : product.price

              return (
                <Card key={product.id} className="overflow-hidden group hover:shadow-lg transition-all flex flex-col justify-between bg-background border border-border/50">
                  <div className="relative aspect-square overflow-hidden bg-muted">
                    <img 
                      src={product.coverImage || DEFAULT_PLACEHOLDER_IMAGE} 
                      alt={product.name} 
                      className="h-full w-full object-cover transition-transform group-hover:scale-105" 
                    />
                    <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1">
                      <Badge className="bg-black/80 text-white border-none text-[9px] font-bold uppercase tracking-wider">
                        {product.category?.name || 'Spiritual'}
                      </Badge>
                      {product.isAbhimantrit && (
                        <Badge className="bg-purple-600 border-none text-white font-extrabold text-[9px]">
                          Energised
                        </Badge>
                      )}
                    </div>
                  </div>
                  <CardContent className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-semibold line-clamp-1 group-hover:text-amber-600 transition-colors">{product.name}</h3>
                      <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{product.shortDescription || 'Authentic divine accessory.'}</p>
                    </div>
                    <div className="mt-3 flex items-center justify-between pt-2 border-t border-border/40">
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-lg font-bold text-foreground">₹{parseFloat(activePrice?.toString() || '0').toLocaleString('en-IN')}</span>
                        {hasSale && (
                          <span className="text-xs text-muted-foreground line-through">₹{parseFloat(product.price.toString()).toLocaleString('en-IN')}</span>
                        )}
                      </div>
                      <Button size="sm" asChild className="bg-amber-500 hover:bg-amber-600 text-black font-semibold h-8 text-xs">
                        <Link href={`/cart/add?productId=${product.id}`}>Buy Now</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </section>

      {/* DEVOTIONAL VIDEO CENTER & SCHEDULED BROADCASTS */}
      {settings.social_posts && settings.social_posts.length > 0 && (
        <section className="container py-16 bg-amber-500/[0.02]">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <Badge variant="outline" className="mb-3 bg-amber-100 text-amber-800 border-amber-200">📹 Devotional Media</Badge>
              <h2 className="text-3xl md:text-4xl font-bold">Scheduled Videos & Live Streams</h2>
              <p className="mt-2 text-muted-foreground">Stay connected with direct access to divine video feeds and scheduled spiritual broadcasts.</p>
            </div>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {settings.social_posts.map((post: any, i: number) => (
              <Card key={post.id || i} className="overflow-hidden group hover:shadow-lg transition-all flex flex-col justify-between border-amber-200/50 bg-background">
                <div className="relative aspect-[16/9] bg-muted overflow-hidden flex items-center justify-center">
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/30 transition-colors z-10">
                    <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
                      <Play className="h-6 w-6 text-white fill-white ml-0.5" />
                    </div>
                  </div>
                  <img 
                    src={`https://picsum.photos/seed/video-${post.id || i}/600/340`} 
                    alt={post.title} 
                    className="h-full w-full object-cover" 
                  />
                  <div className="absolute top-3 left-3 z-20 flex gap-1.5">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-black uppercase text-white ${
                      post.status === 'LIVE' ? 'bg-red-600 animate-pulse' : 'bg-blue-600'
                    }`}>
                      {post.status === 'LIVE' ? '● LIVE' : 'Scheduled'}
                    </span>
                    <span className="bg-black/60 text-white text-[10px] font-bold px-2 py-0.5 rounded backdrop-blur">
                      {post.platform}
                    </span>
                  </div>
                </div>
                <CardContent className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-sm text-foreground group-hover:text-primary transition-colors line-clamp-1">{post.title}</h3>
                    <p className="mt-1 text-xs text-muted-foreground">Broadcast: {post.scheduledAt}</p>
                  </div>
                  <div className="mt-3 pt-2 border-t border-border/40 flex items-center justify-between">
                    <span className="text-[11px] text-muted-foreground truncate max-w-[150px]">{post.url}</span>
                    <Button size="sm" variant="outline" className="h-8 text-xs font-bold" asChild>
                      <a href={post.url} target="_blank" rel="noopener noreferrer">View Stream</a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* LIVE EVENTS BANNER */}
      <section className="container py-10">
        <div className="rounded-3xl om-gradient p-1">
          <div className="rounded-[calc(1.5rem-4px)] bg-background p-8 md:p-12 grid md:grid-cols-2 items-center gap-6">
            <div>
              <Badge className="bg-red-500 text-white mb-3"><Play className="h-3 w-3 mr-1 fill-white" /> LIVE</Badge>
              <h2 className="text-3xl font-bold">Watch Live Aarti & Events</h2>
              <p className="mt-2 text-muted-foreground">Experience daily aarti from the most sacred temples — anytime, anywhere.</p>
              <Button className="mt-5 text-white" asChild><Link href="/events">Watch Now</Link></Button>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[1,2,3,4,5,6].map((i) => (
                <div key={i} className="aspect-square rounded-lg bg-muted overflow-hidden">
                  <img src={getPlaceholderSvg((22 + i * 40) % 360, `Aarti ${i}`)} className="h-full w-full object-cover" alt="" />
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
          <p className="mt-3 opacity-90 max-w-xl mx-auto">Join 100,000+ devotees who trust {customSiteName} for their spiritual needs.</p>
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
