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
import { cn } from '@/lib/utils'

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

            {/* Premium Puja Inclusions Checklist */}
            <div className="space-y-4 border-t pt-4">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">All Puja Packages Include (सभी पैकेज में शामिल है):</h3>
              <div className="grid gap-2.5 text-xs text-slate-600 font-medium">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600 shrink-0" />
                  <span>वैदिक ब्राह्मणों द्वारा आपके नाम और गोत्र के साथ विशिष्ट पूजा संकल्प (Personalized Sankalp).</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600 shrink-0" />
                  <span>पूजा अनुष्ठान का पूर्ण वीडियो रिकॉर्डिंग / लाइव स्ट्रीमिंग लिंक (Puja Video).</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600 shrink-0" />
                  <span>मन्दिर से अभिमंत्रित शुद्ध महाप्रसाद आपके घर की चौखट तक (Home Prasad Delivery).</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600 shrink-0" />
                  <span>व्हाट्सएप पर पूजा की तस्वीरें, संकल्प वीडियो और त्वरित अपडेट (WhatsApp Updates).</span>
                </div>
              </div>

              {/* Optional Add-ons Notice Card */}
              <div className="p-3 bg-amber-500/5 border border-amber-200/50 rounded-xl text-xs text-amber-800 flex items-center gap-2.5">
                <Gift className="h-5 w-5 text-orange-500 shrink-0" />
                <div>
                  <span className="font-bold">अतिरिक्त दान सेवा (Optional Add-ons):</span> आप संकल्प के समय गौ-सेवा, अन्नदान, वस्त्रदान या दीप दान का चयन कर पुण्य कमा सकते हैं।
                </div>
              </div>
            </div>

            {/* Interactive Package Cards Grid */}
            <div className="space-y-4 pt-4 border-t">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Select Your Puja Package (पूजा पैकेज चुनें):</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {(Object.keys(packages) as Array<'1' | '2' | '4' | '6'>).map((key) => {
                  const isSelected = selectedPackage === key
                  return (
                    <button
                      key={key}
                      onClick={() => setSelectedPackage(key)}
                      className={cn(
                        "text-left p-0 rounded-2xl border-2 transition-all flex flex-col justify-between bg-white overflow-hidden min-h-[200px] relative hover:scale-[1.01]",
                        isSelected 
                          ? "border-orange-500 bg-orange-50/10 shadow-sm" 
                          : "border-slate-100 hover:border-amber-200/60"
                      )}
                    >
                      {/* Package Illustration Image */}
                      <div className="w-full h-28 overflow-hidden border-b bg-slate-50/50 p-1 flex items-center justify-center">
                        <img src={`/package-${key}.jpg`} className="max-w-full max-h-full object-contain rounded-lg" alt="" />
                      </div>

                      {/* Checkmark icon for active package */}
                      {isSelected && (
                        <div className="absolute top-2 right-2 h-5 w-5 rounded-full bg-orange-600 flex items-center justify-center text-white z-10">
                          <CheckCircle2 className="h-3 w-3 fill-white text-orange-600" />
                        </div>
                      )}
                      
                      <div className="p-3 space-y-1 flex-1 flex flex-col justify-between">
                        <div className="space-y-0.5">
                          <span className="text-[9px] font-bold text-slate-400 uppercase">{packages[key].label}</span>
                          <h4 className="text-xs font-black text-slate-800 line-clamp-1">
                            {key === '1' ? 'व्यक्तिगत पूजा' : key === '2' ? 'दम्पत्ति पूजा' : key === '4' ? 'परिवार पूजा' : 'महासंकल्प पूजा'}
                          </h4>
                        </div>
                        <div className="pt-2">
                          <span className="text-sm font-black text-slate-900">₹{packages[key].price}</span>
                        </div>
                      </div>
                    </button>
                  )
                })}
              </div>
              <p className="text-xs text-slate-500 bg-slate-50 p-3.5 rounded-xl border leading-relaxed italic">
                {packages[selectedPackage].desc}
              </p>
            </div>

            {/* Trust & Certifications Row */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 pt-4 border-t text-[10px] font-bold text-slate-500 text-center">
              <div className="p-2.5 bg-slate-50/80 rounded-xl border">🤝 100% रिफंड गारंटी</div>
              <div className="p-2.5 bg-slate-50/80 rounded-xl border">💰 कोई छुपा शुल्क नहीं</div>
              <div className="p-2.5 bg-slate-50/80 rounded-xl border">🔒 ISO 27001 सुरक्षित</div>
              <div className="p-2.5 bg-slate-50/80 rounded-xl border">🏛️ आधिकारिक मन्दिर पार्टनर</div>
              <div className="p-2.5 bg-slate-50/80 rounded-xl border col-span-2 md:col-span-1">📞 २४/७ कस्टमर सपोर्ट</div>
            </div>

            {/* Viewport Fixed Bottom Sticky Checkout Bar */}
            <div className="fixed bottom-0 left-0 right-0 bg-slate-950 text-white p-4 md:py-5 border-t border-slate-800 z-50 shadow-2xl flex items-center justify-between">
              <div className="container max-w-6xl mx-auto flex items-center justify-between gap-4 px-4">
                <div className="text-left space-y-0.5">
                  <p className="text-[10px] font-bold text-orange-500 uppercase tracking-wider">{packages[selectedPackage].label} Selected</p>
                  <p className="text-lg md:text-xl font-black text-white">₹{packages[selectedPackage].price} <span className="text-xs font-normal text-slate-400">/ Total</span></p>
                </div>
                <Button size="lg" className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-black px-8 py-6 rounded-xl transition-all shadow-lg shadow-orange-500/20 hover:scale-[1.02]" asChild>
                  <Link href={`/bookings/new?pujaId=${puja.id}&package=${selectedPackage}&price=${packages[selectedPackage].price}`}>
                    आगे बढ़ें (Proceed) <ChevronRight className="h-5 w-5 ml-1" />
                  </Link>
                </Button>
              </div>
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
              <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-5">
                {[
                  { step: '1', title: 'पैकेज चुनें (Select Package)', desc: 'संकल्प में शामिल करने के लिए सदस्यों की संख्या चुनें।', img: '/process-1.jpg' },
                  { step: '2', title: 'गोत्र और नाम दर्ज करें (Details)', desc: 'चेकआउट के दौरान अपना नाम, पिता/पति का नाम और गोत्र भरें।', img: '/process-2.jpg' },
                  { step: '3', title: 'कन्फर्म और भुगतान (Confirm Pay)', desc: 'सुरक्षित भुगतान के माध्यम से अपनी बुकिंग पूर्ण करें।', img: '/process-3.jpg' },
                  { step: '4', title: 'पंडित जी द्वारा संकल्प (Live Havan)', desc: 'पंडित जी द्वारा मन्दिर से आपके नाम व गोत्र का लाइव संकल्प किया जाएगा।', img: '/process-4.png' },
                  { step: '5', title: 'प्रसाद डिलीवरी (Home Prasad)', desc: 'शुद्ध मन्दिर महाप्रसाद ८-१० दिनों में आपके पते पर भेज दिया जाएगा।', img: '/process-5.png' },
                ].map((s) => (
                  <div key={s.step} className="p-0 border rounded-2xl bg-white overflow-hidden space-y-0 relative shadow-sm flex flex-col justify-between hover:scale-[1.01] transition-transform">
                    {/* Illustration image */}
                    <div className="w-full h-32 overflow-hidden border-b bg-amber-50">
                      <img src={s.img} className="w-full h-full object-cover" alt={s.title} />
                    </div>
                    
                    <div className="p-4 space-y-1.5 flex-1 flex flex-col justify-between">
                      <div>
                        <span className="text-2xl font-black text-orange-200 select-none">0{s.step}</span>
                        <h4 className="font-bold text-xs text-slate-800 line-clamp-1">{s.title}</h4>
                      </div>
                      <p className="text-[10px] text-muted-foreground leading-relaxed mt-1">{s.desc}</p>
                    </div>
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
