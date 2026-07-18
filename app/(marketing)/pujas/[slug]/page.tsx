import prisma from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { MapPin, Calendar, Flame, Video, CheckCircle2, User, Users, Landmark, Clock, ArrowRight } from 'lucide-react'

interface PageProps {
  params: Promise<{ slug: string }>
}

export default async function PujaDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const puja = await prisma.puja.findUnique({
    where: { slug },
    include: { temple: true, category: true }
  })

  if (!puja) {
    notFound()
  }

  const basePrice = Number(puja.price) || 851
  const coverImg = puja.coverImage || 'https://images.unsplash.com/photo-1609766418204-94aae0ecfdfc?w=900'

  const packages = [
    {
      key: '1',
      name: 'Individual Sankalp',
      price: basePrice,
      description: 'Sankalp performed in your name and gotra. Prasad delivered to your home.',
      features: ['1 Person Sankalp', 'Name & Gotra Recitation', 'Live Stream Access', 'Prasad Delivery (1 Box)'],
      icon: User
    },
    {
      key: '2',
      name: 'Couple/Family Sankalp',
      price: basePrice + 550,
      description: 'Sankalp performed for you and your spouse/family member.',
      features: ['2 Family Members', 'Name & Gotra Recitation', 'Live Stream Access', 'Prasad Delivery (1 Box + Raksha Sutra)'],
      icon: Users
    },
    {
      key: '4',
      name: 'Joint Family Sankalp',
      price: basePrice + 1550,
      description: 'Sankalp performed for up to 4 family members with special blessings.',
      features: ['4 Family Members', 'Name & Gotra Recitation', 'Priority Live Stream Call', 'Special Prasad Box + Chadhawa Prasad'],
      icon: Users
    },
    {
      key: '6',
      name: 'Grand Devotee Puja',
      price: basePrice + 2550,
      description: 'Exclusive family puja with dedicated pandit ji and full family gotra chadhawa.',
      features: ['6 Family Members', 'Personalised Sankalp Video', 'Exclusive Prasad (Idol/Rudraksha + Prasad)', 'Pandit Ji Dakshina Included'],
      icon: Flame
    }
  ]

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Event",
    "name": puja.name,
    "description": puja.shortDescription || puja.description || `Sacred ${puja.name} performed by learned pandits.`,
    "startDate": new Date().toISOString().split('T')[0],
    "location": {
      "@type": "Place",
      "name": puja.temple ? `${puja.temple.name}, ${puja.temple.city}, ${puja.temple.state}` : "Sacred Temple, India"
    },
    "organizer": {
      "@type": "Organization",
      "name": "Sanatan Seva"
    }
  }

  return (
    <div className="min-h-screen bg-background py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="container max-w-6xl mx-auto px-4">
        {/* Breadcrumb / Back button */}
        <div className="mb-6">
          <Link href="/pujas" className="text-sm font-medium text-primary hover:underline flex items-center gap-1">
            ← Back to all Pujas
          </Link>
        </div>

        {/* HERO SECTION */}
        <div className="grid lg:grid-cols-12 gap-8 items-start mb-12">
          {/* Cover image & main info */}
          <div className="lg:col-span-7 space-y-6">
            <div className="relative aspect-[16/9] rounded-3xl overflow-hidden border border-border/80 shadow-lg diya-glow bg-gradient-to-br from-primary/30 to-accent/30">
              <img src={coverImg} alt={puja.name} className="h-full w-full object-cover" />
              <div className="absolute top-4 left-4 flex gap-2">
                {puja.isVip && <Badge className="bg-amber-600 text-white font-semibold">⭐ VIP</Badge>}
                {puja.isOnline && (
                  <Badge className="bg-red-500 text-white font-semibold flex items-center gap-1">
                    <Video className="h-3 w-3 animate-pulse" /> Live Stream Available
                  </Badge>
                )}
              </div>
            </div>

            <div className="space-y-4">
              {puja.category && (
                <Badge variant="secondary" className="px-3 py-1 font-semibold uppercase tracking-wider text-xs">
                  {puja.category.name}
                </Badge>
              )}
              <h1 className="text-3xl md:text-5xl font-black text-om-gradient leading-tight">
                {puja.name}
              </h1>

              {puja.temple && (
                <div className="flex items-center gap-3 p-4 bg-muted/40 border rounded-2xl">
                  <Landmark className="h-5 w-5 text-primary shrink-0" />
                  <div>
                    <h3 className="font-semibold text-sm">{puja.temple.name}</h3>
                    <p className="text-xs text-muted-foreground">{puja.temple.city}, {puja.temple.state}</p>
                  </div>
                </div>
              )}

              {puja.duration && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
                  <Clock className="h-4 w-4 text-primary" />
                  <span>Duration: {puja.duration} mins</span>
                </div>
              )}
            </div>
          </div>

          {/* Quick booking card */}
          <div className="lg:col-span-5 bg-card border rounded-3xl p-6 shadow-xl space-y-6 sticky top-6">
            <div>
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Sankalp Packages starting at</p>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-4xl font-black text-primary">₹{basePrice}</span>
                <span className="text-sm text-muted-foreground">onwards</span>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="font-bold text-sm">Sacred Inclusion:</h3>
              <ul className="text-sm space-y-2 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Personalized Sankalp with name and gotra.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Live online streaming from the temple.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Abhimantrit Prasad delivered right to your home.</span>
                </li>
              </ul>
            </div>

            <Button asChild size="lg" className="w-full">
              <a href="#packages-section">Select Package & Book</a>
            </Button>
          </div>
        </div>

        {/* DETAILS TABS SECTION */}
        <div className="grid lg:grid-cols-12 gap-8 items-start mb-16">
          <div className="lg:col-span-8 space-y-8">
            {puja.description && (
              <div className="space-y-3">
                <h2 className="text-2xl font-bold border-b pb-2">About the Puja</h2>
                <div className="text-muted-foreground leading-relaxed text-sm md:text-base whitespace-pre-line">
                  {puja.description}
                </div>
              </div>
            )}

            {puja.benefits && (
              <div className="space-y-3">
                <h2 className="text-2xl font-bold border-b pb-2">Benefits of performing this Puja</h2>
                <div className="text-muted-foreground leading-relaxed text-sm whitespace-pre-line">
                  {puja.benefits}
                </div>
              </div>
            )}

            {puja.procedure && (
              <div className="space-y-3">
                <h2 className="text-2xl font-bold border-b pb-2">Puja Vidhi & Procedure</h2>
                <div className="text-muted-foreground leading-relaxed text-sm whitespace-pre-line">
                  {puja.procedure}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* PACKAGES GRID */}
        <div id="packages-section" className="space-y-8 pt-6 scroll-mt-6">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl font-black text-om-gradient">Choose Sankalp Package</h2>
            <p className="text-muted-foreground mt-2">Select the option that matches your family needs.</p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {packages.map((pkg) => {
              const PkgIcon = pkg.icon
              return (
                <Card key={pkg.key} className="overflow-hidden flex flex-col justify-between border-border hover:border-primary/50 hover:shadow-lg transition-all">
                  <CardContent className="p-6 space-y-6 flex-1 flex flex-col justify-between">
                    <div className="space-y-4">
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <PkgIcon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg leading-tight">{pkg.name}</h3>
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{pkg.description}</p>
                      </div>
                    </div>

                    <div className="space-y-4 pt-4 border-t border-dashed">
                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-black text-primary">₹{pkg.price}</span>
                      </div>
                      <ul className="text-xs space-y-2 text-muted-foreground">
                        {pkg.features.map((f, i) => (
                          <li key={i} className="flex items-center gap-1.5">
                            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                            <span>{f}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <Button asChild className="w-full mt-6">
                      <Link href={`/bookings/new?pujaId=${puja.id}&package=${pkg.key}`}>
                        Book Now <ArrowRight className="ml-1.5 h-3 w-3" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
