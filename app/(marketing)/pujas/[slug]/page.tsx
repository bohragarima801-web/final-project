'use client'

import { useEffect, useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { MapPin, Calendar, CheckCircle2, Video, Gift, Sparkles, User, Users, Info, ChevronRight, HelpCircle, Star } from 'lucide-react'
import Link from 'next/link'
import { useParams } from 'next/navigation'

export default function PujaDetailsPage() {
  const { slug } = useParams()
  const [puja, setPuja] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [selectedPackage, setSelectedPackage] = useState<'1' | '2' | '4' | '6'>('1')

  useEffect(() => {
    if (!slug) return
    fetch(`/api/admin/pujas`)
      .then((r) => r.json())
      .then((data) => {
        if (data.ok) {
          const matched = (data.pujas || []).find((p: any) => p.slug === slug)
          setPuja(matched || null)
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [slug])

  if (loading) {
    return (
      <div className="flex justify-center items-center py-40">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-600"></div>
      </div>
    )
  }

  if (!puja) {
    return (
      <div className="container py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-800">Puja Not Found</h2>
        <p className="text-muted-foreground">The requested sacred puja could not be found.</p>
        <Button asChild>
          <Link href="/pujas">Back to Pujas</Link>
        </Button>
      </div>
    )
  }

  const basePrice = Number(puja.price) || 951
  const packages = {
    '1': { label: 'One Member', price: basePrice, desc: `On puja day, Pandit ji will perform the rituals & chant your Name and Gotra in Sankalp. You'll receive a recorded puja video and sacred prasad at home.` },
    '2': { label: 'Two Members', price: basePrice + 550, desc: `Pandit ji will perform the rituals & chant the Names and Gotras (up to 2 family members) in Sankalp. Recorded puja video & prasad included.` },
    '4': { label: '4 Members', price: basePrice + 1550, desc: `Pandit ji will include up to 4 members of your family in the Sankalp. Detailed recorded puja video and pure prasad sent to your address.` },
    '6': { label: '6 Members', price: basePrice + 2550, desc: `Full family package. Up to 6 family members included in the sacred Sankalp. Personalized video recording, blessing certificate, and premium prasad.` }
  }

  return (
    <div className="bg-slate-50/50 min-h-screen">
      <div className="container py-10 max-w-6xl mx-auto space-y-8">
        
        {/* Breadcrumb Navigation */}
        <div className="text-xs text-muted-foreground space-x-2">
          <Link href="/" className="hover:underline">Home</Link>
          <span>/</span>
          <Link href="/pujas" className="hover:underline">Pujas</Link>
          <span>/</span>
          <span className="text-slate-800 font-semibold">{puja.name}</span>
        </div>

        {/* Split Layout Header */}
        <div className="grid gap-8 lg:grid-cols-12 items-start bg-white p-6 md:p-8 rounded-3xl border shadow-sm">
          
          {/* Left Column: Cover Image & Media */}
          <div className="lg:col-span-5 space-y-4">
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow border">
              {puja.coverImage ? (
                <img src={puja.coverImage} alt={puja.name} className="h-full w-full object-cover" />
              ) : (
                <div className="h-full w-full flex items-center justify-center bg-orange-50 text-orange-500">
                  <Sparkles className="h-16 w-16 opacity-30 animate-pulse" />
                </div>
              )}
              {puja.isVip && (
                <Badge className="absolute top-4 left-4 bg-yellow-500 text-white font-bold border-none px-3 py-1">
                  ⭐ VIP Puja
                </Badge>
              )}
              {puja.isOnline && (
                <Badge className="absolute top-4 right-4 bg-red-600 text-white font-bold border-none px-3 py-1 flex items-center gap-1">
                  <Video className="h-3.5 w-3.5" /> LIVE
                </Badge>
              )}
            </div>

            {/* Micro Details List */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-orange-50/30 rounded-xl border flex flex-col justify-center">
                <span className="text-[10px] uppercase font-bold text-slate-500">Temple</span>
                <span className="text-xs font-bold text-slate-800 line-clamp-1">{puja.temple?.name || 'Holy Place'}</span>
              </div>
              <div className="p-3 bg-orange-50/30 rounded-xl border flex flex-col justify-center">
                <span className="text-[10px] uppercase font-bold text-slate-500">Priest</span>
                <span className="text-xs font-bold text-slate-800">Devyajnam Pandit</span>
              </div>
            </div>
          </div>

          {/* Right Column: Title, Quick Specs & Packages Selector */}
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-2">
              <Badge className="bg-orange-100 text-orange-800 border-none px-3 py-0.5 text-xs font-bold">
                {puja.category?.name || 'Sanatan Seva'}
              </Badge>
              <h1 className="text-2xl md:text-3xl font-black text-slate-800 leading-tight">
                {puja.name}
              </h1>
              <p className="text-sm text-slate-500 flex items-center gap-1">
                <MapPin className="h-4 w-4 text-orange-600" /> {puja.temple?.name || 'Uttarakhand / Kashi / Ujjain'}
              </p>
            </div>

            <p className="text-slate-600 text-sm leading-relaxed border-l-4 border-orange-500 pl-4 bg-orange-50/20 py-2 rounded-r-lg">
              {puja.shortDescription || 'Participate in this auspicious puja to align your stars and invite divine energy.'}
            </p>

            {/* How this works Quick Timeline */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">How this works (पूजा विधि)</h3>
              <div className="grid grid-cols-4 gap-2 text-[10px] text-center font-bold text-slate-600">
                <div className="p-2 bg-slate-50 rounded-lg border">1. Gotra Details</div>
                <div className="p-2 bg-slate-50 rounded-lg border">2. Sankalp Pay</div>
                <div className="p-2 bg-slate-50 rounded-lg border">3. Live Video</div>
                <div className="p-2 bg-slate-50 rounded-lg border">4. Prasad Sent</div>
              </div>
            </div>

            {/* Dynamic Package Box */}
            <div className="p-5 rounded-2xl bg-orange-50/40 border border-orange-100 space-y-4">
              <div className="flex justify-between items-center border-b pb-3">
                <span className="text-xs font-bold text-slate-700">Select Puja Package</span>
                <span className="text-2xl font-black text-orange-600">₹{packages[selectedPackage].price}</span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {(Object.keys(packages) as Array<'1' | '2' | '4' | '6'>).map((key) => (
                  <Button
                    key={key}
                    variant={selectedPackage === key ? 'default' : 'outline'}
                    className={`h-11 flex flex-col items-center justify-center p-1 ${selectedPackage === key ? 'bg-orange-600 text-white hover:bg-orange-700' : ''}`}
                    onClick={() => setSelectedPackage(key)}
                  >
                    <span className="text-[10px] font-bold">{packages[key].label}</span>
                    <span className="text-[10px] opacity-90">₹{packages[key].price}</span>
                  </Button>
                ))}
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed italic bg-white p-3 rounded-lg border">
                {packages[selectedPackage].desc}
              </p>
              <Button size="lg" className="w-full bg-orange-600 hover:bg-orange-700 text-white font-black h-12 shadow" asChild>
                <Link href={`/bookings/new?pujaId=${puja.id}&package=${selectedPackage}&price=${packages[selectedPackage].price}`}>
                  Book Puja For {packages[selectedPackage].label} <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
              </Button>
            </div>

          </div>
        </div>

        {/* Detailed Tabs System */}
        <div className="bg-white rounded-3xl border shadow-sm overflow-hidden">
          <Tabs defaultValue="benefits" className="w-full">
            <TabsList className="w-full justify-start rounded-none border-b bg-slate-50 h-12 overflow-x-auto overflow-y-hidden">
              <TabsTrigger value="benefits" className="data-[state=active]:border-b-2 data-[state=active]:border-orange-600 rounded-none px-6">Benefits</TabsTrigger>
              <TabsTrigger value="process" className="data-[state=active]:border-b-2 data-[state=active]:border-orange-600 rounded-none px-6">Puja Process</TabsTrigger>
              <TabsTrigger value="importance" className="data-[state=active]:border-b-2 data-[state=active]:border-orange-600 rounded-none px-6">Importance</TabsTrigger>
              <TabsTrigger value="faqs" className="data-[state=active]:border-b-2 data-[state=active]:border-orange-600 rounded-none px-6">FAQs</TabsTrigger>
              <TabsTrigger value="reviews" className="data-[state=active]:border-b-2 data-[state=active]:border-orange-600 rounded-none px-6">Reviews</TabsTrigger>
            </TabsList>

            {/* Benefits Tab */}
            <TabsContent value="benefits" className="p-6 md:p-8 space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-orange-600" /> Benefits of performing this Puja
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line bg-slate-50 p-5 rounded-xl border">
                  {puja.benefits || '• Removes planetary doshas (ग्रह दोष) and marital obstacles.\n• Brings harmony and understanding in relationships.\n• Attracts success, good health, and family prosperity.'}
                </p>
              </div>
            </TabsContent>

            {/* Process Tab */}
            <TabsContent value="process" className="p-6 md:p-8 space-y-6">
              <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
                {[
                  { step: '1', title: 'Select Package', desc: 'Choose the number of members to include in the Sankalp.' },
                  { step: '2', title: 'Enter Name & Gotra', desc: 'Provide your family names and Gotra during checkout.' },
                  { step: '3', title: 'Confirm Booking', desc: 'Securely pay to finalize your booking slot.' },
                  { step: '4', title: 'Pandit ji performs Puja', desc: 'Pandit ji will chant your name and gotra in live/recorded Sankalp.' },
                  { step: '5', title: 'Video Updates', desc: 'Receive puja clip and updates directly on your WhatsApp.' },
                  { step: '6', title: 'Prasad Delivery', desc: 'Pure temple prasad is delivered to your home within 7-9 days.' },
                ].map((s) => (
                  <div key={s.step} className="p-5 border rounded-2xl bg-slate-50/50 space-y-2 relative">
                    <span className="absolute top-4 right-4 text-3xl font-black text-orange-100 select-none">0{s.step}</span>
                    <h4 className="font-bold text-sm text-slate-800 mt-2">{s.title}</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">{s.desc}</p>
                  </div>
                ))}
              </div>
            </TabsContent>

            {/* Importance Tab */}
            <TabsContent value="importance" className="p-6 md:p-8 space-y-6">
              <div className="space-y-4 max-w-3xl">
                <h3 className="text-lg font-bold text-slate-800">Spiritual Significance</h3>
                <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                  {puja.description || 'This puja invokes the cosmic energies of Lord Shiva and Goddess Parvati to harmonize marriage and relationships, remove negative blocks, and bestow health, intelligence, and legacy blessings.'}
                </p>
              </div>
            </TabsContent>

            {/* FAQs Tab */}
            <TabsContent value="faqs" className="p-6 md:p-8">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="faq-1">
                  <AccordionTrigger className="text-sm font-bold">What if I do not know my Gotra?</AccordionTrigger>
                  <AccordionContent className="text-xs text-slate-600 leading-relaxed">
                    If you do not know your gotra, it is prefilled as "Kashyap". Kashyap gotra is generally accepted for all devotees whose gotra is unknown.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="faq-2">
                  <AccordionTrigger className="text-sm font-bold">How will I receive the Puja Video?</AccordionTrigger>
                  <AccordionContent className="text-xs text-slate-600 leading-relaxed">
                    We will share a personalized recorded video clip of the Pandit ji chanting your name and gotra in the Sankalp on your registered WhatsApp number and email.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="faq-3">
                  <AccordionTrigger className="text-sm font-bold">How long does Prasad delivery take?</AccordionTrigger>
                  <AccordionContent className="text-xs text-slate-600 leading-relaxed">
                    The sacred Prasad, dry fruits, ash/kumkum, and holy thread are packed hygienically and shipped to your home, reaching you in 7 to 9 business days.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </TabsContent>

            {/* Reviews Tab */}
            <TabsContent value="reviews" className="p-6 md:p-8 space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  { name: 'Vijay Sharma', time: '1 month ago', text: 'Very divine experience. Got WhatsApp video of my gotra sankalp on Shravan Somwar. Highly recommend! 🙏' },
                  { name: 'Pooja Rawat', time: '3 weeks ago', text: 'Beautiful packaging of Prasad and quick updates. Thank you Devyajnam team for the marriage harmonizing puja!' }
                ].map((r, i) => (
                  <Card key={i} className="border border-slate-100">
                    <CardContent className="p-5 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs">{r.name}</span>
                        <span className="text-[10px] text-muted-foreground">{r.time}</span>
                      </div>
                      <div className="flex gap-0.5 text-yellow-500">
                        {[...Array(5)].map((_, idx) => <Star key={idx} className="h-3 w-3 fill-yellow-500 text-yellow-500" />)}
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">{r.text}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>

      </div>
    </div>
  )
}
