import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Flame, HandCoins, Sparkles, ShoppingBag, Star, ArrowRight,
  MapPin, Calendar, ShieldCheck, Video, Play, BookOpen
} from 'lucide-react'
import { prisma } from '@/lib/prisma'
import { MediaCarousel } from '@/components/ui/media-carousel'
import { HeroPujaSlider } from '@/components/hero-puja-slider'

const upcomingPujas = [
  { name: 'महा रुद्राभिषेक (Maha Rudrabhishek)', temple: 'काशी विश्वनाथ मंदिर, वाराणसी', date: 'श्रावण सोमवार Special', img: 'https://images.unsplash.com/photo-1609766418204-94aae0ecfdfc?w=600', price: 1100, vip: false },
  { name: 'गुरु पूर्णिमा महाआरती (Guru Purnima)', temple: 'सोमनाथ ज्योतिर्लिंग मंदिर', date: '21 July', img: 'https://images.unsplash.com/photo-1583324113626-70df0f4deaab?w=600', price: 2100, vip: false },
  { name: 'कालसर्प दोष निवारण पूजा (Kalsarp Dosh)', temple: 'महाकालेश्वर मंदिर, उज्जैन', date: 'Every Sunday', img: 'https://images.unsplash.com/photo-1580889240912-6f5cc9e07d84?w=600', price: 1251, vip: true },
  { name: 'महामृत्युंजय जाप (Maha Mrityunjay Jap)', temple: 'त्र्यंबकेश्वर ज्योतिर्लिंग', date: 'Instant Booking', img: 'https://images.unsplash.com/photo-1588580000645-4562a6d2c839?w=600', price: 1500, vip: true },
]

const services = [
  { icon: Flame, title: 'ऑनलाइन पूजा (Online Pujas)', desc: 'प्रमाणित पंडितों द्वारा आपके नाम व गोत्र से अभिमंत्रित लाइव पूजा संकल्प।', href: '/pujas', color: 'from-orange-500/20 to-orange-500/5' },
  { icon: Sparkles, title: 'चढ़ावा सेवा (Chadhawa Seva)', desc: 'पवित्र धामों में फूल अर्पण, भोग, दीप दान और गौ-सेवा सीधे ऑनलाइन कराएं।', href: '/chadhawa', color: 'from-yellow-500/20 to-yellow-500/5' },
  { icon: ShoppingBag, title: 'अभिमंतृत सामग्री (Divine Store)', desc: 'गंगाजल, सिद्ध रुद्राक्ष, पारद शिवलिंग एवं प्रमाणित रत्न घर मंगाएं।', href: '/products', color: 'from-pink-500/20 to-pink-500/5' },
]

const fallbackTestimonials = [
  { name: 'रविंद्र दीक्षित (Ravindra Dixit)', location: 'लखनऊ', rating: 5, message: 'काशी विश्वनाथ मंदिर में की गई पूजा का अनुभव अत्यंत दिव्य था। प्रसाद भी 4 दिनों में घर मिल गया।' },
  { name: 'दीपक चौरसिया (Deepak Chaurasia)', location: 'भोपाल', rating: 5, message: 'लाइव स्ट्रीमिंग की क्वालिटी बहुत अच्छी थी। घर बैठे लग रहा था कि हम मंदिर के गर्भगृह में ही बैठे हैं।' },
  { name: 'अंजली मेनन (Anjali Menon)', location: 'बैंगलोर', rating: 5, message: 'पंडित जी ने मंत्रोच्चारण के साथ मेरा नाम और गोत्र स्पष्ट रूप से बोला। बहुत संतुष्ट हूँ।' },
]

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const products = await prisma.product.findMany({
    take: 4,
    include: { category: true }
  }).catch(() => [])

  const dbPujas = await prisma.puja.findMany({
    where: { status: 'PUBLISHED' },
    take: 4,
    include: { category: true, temple: true },
    orderBy: { createdAt: 'desc' }
  }).catch(() => [])

  let testimonials = await prisma.testimonial.findMany({
    where: { isActive: true },
    orderBy: { createdAt: 'desc' },
    take: 6
  }).catch(() => [])

  if (testimonials.length === 0) {
    testimonials = fallbackTestimonials as any
  }

  return (
    <div className="space-y-16 pb-16">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-amber-50/70 via-amber-50/30 to-transparent pt-24 pb-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-amber-500/5 via-transparent to-transparent opacity-60 pointer-events-none" />
        <div className="container relative grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <Badge className="bg-amber-500/10 border border-amber-500/30 text-amber-700 hover:bg-amber-500/20 px-3 py-1 text-sm font-semibold rounded-full w-fit">
              🕉️ सनातन सेवा • घर बैठे पावन दर्शन
            </Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-normal text-slate-900">
              घर बैठे कराएं <br />
              <span className="text-om-gradient">पवित्र पूजा</span> व <span className="text-om-gradient">अनुष्ठान</span>
            </h1>
            <p className="text-lg text-slate-600 leading-relaxed max-w-xl">
              भारत के प्रसिद्ध सिद्ध पीठों व ज्योतिर्लिंगों से सीधे लाइव-स्ट्रीम पूजा। <span className="inline-block">वैदिक ब्राह्मणों द्वारा</span> आपके नाम व गोत्र के साथ विशिष्ट संकल्प। सिद्ध महाप्रसाद आपके द्वार।
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <Button size="lg" className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-bold text-base px-8 py-6 rounded-xl shadow-lg shadow-orange-500/20 transition-all hover:scale-[1.02]" asChild>
                <Link href="/pujas">पूजा बुक करें (Book Now) <ArrowRight className="ml-2 h-5 w-5" /></Link>
              </Button>
              <Button size="lg" variant="outline" className="border-amber-200 bg-white hover:bg-amber-50/50 text-slate-700 px-8 py-6 rounded-xl transition-all" asChild>
                <Link href="/tools"><Sparkles className="mr-2 h-5 w-5 text-orange-500" /> आध्यात्मिक टूल्स (Tools)</Link>
              </Button>
            </div>
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-amber-200/80">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-orange-600 font-bold"><ShieldCheck className="h-5 w-5 shrink-0" /> 100% शुद्ध</div>
                <div className="text-xs text-slate-500 font-medium">प्रमाणित वैदिक पंडित</div>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-orange-600 font-bold"><Video className="h-5 w-5 shrink-0" /> लाइव दर्शन</div>
                <div className="text-xs text-slate-500 font-medium">घर बैठे साक्षात लाइव</div>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-orange-600 font-bold"><Star className="h-5 w-5 shrink-0 fill-orange-500" /> 4.9 रेटिंग</div>
                <div className="text-xs text-slate-500 font-medium">12k+ सुखी भक्त परिवार</div>
              </div>
            </div>
          </div>
          <div className="relative w-full flex items-center justify-center">
            <HeroPujaSlider pujas={dbPujas} />
          </div>
        </div>
      </section>

      {/* THREE SERVICES CARDS */}
      <section className="container">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-10">
          <Badge className="bg-orange-500/10 border-orange-500/20 text-orange-600 hover:bg-orange-500/10 text-xs">सेवाएं • Services</Badge>
          <h2 className="text-3xl font-black text-slate-950">मुख्य सनातन सेवाएँ (Sacred Services)</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">हमारी हर सेवा का उद्देश्य आपके जीवन में सुख, शांति और समृद्धि लाना है।</p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => {
            const Icon = s.icon
            return (
              <Link key={s.href} href={s.href} className="group">
                <Card className="h-full transition-all duration-300 border border-slate-100 hover:border-orange-500/20 hover:shadow-xl hover:-translate-y-1">
                  <CardContent className="p-8 space-y-4">
                    <div className={`h-14 w-14 rounded-2xl bg-gradient-to-br ${s.color} flex items-center justify-center`}>
                      <Icon className="h-7 w-7 text-orange-600" />
                    </div>
                    <h3 className="font-bold text-xl text-slate-900 group-hover:text-orange-600 transition-colors">{s.title}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">{s.desc}</p>
                    <div className="inline-flex items-center gap-1 text-xs font-bold text-orange-600 mt-2">
                      आगे बढ़ें (Explore) <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
      </section>

      {/* UPCOMING PUJAS */}
      <section className="container">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <Badge className="bg-orange-500/10 border-orange-500/20 text-orange-600 hover:bg-orange-500/10 text-xs mb-2">शीघ्र आगामी • Reserve Now</Badge>
            <h2 className="text-2xl md:text-3xl font-black text-slate-950">मुख्य आगामी पूजा (Upcoming Pujas)</h2>
            <p className="text-xs text-muted-foreground">आने वाले शुभ मुहुर्तों पर अपने परिवार की शांति के लिए संकल्प बुक करें।</p>
          </div>
          <Button variant="outline" className="border-slate-200 text-xs font-bold" asChild>
            <Link href="/pujas">सभी देखें (View All) <ArrowRight className="ml-1.5 h-4 w-4" /></Link>
          </Button>
        </div>
        <MediaCarousel>
          {dbPujas.length > 0 ? (
            dbPujas.map((p) => (
              <Card key={p.id} className="overflow-hidden group border border-slate-100 hover:shadow-xl transition-all flex flex-col justify-between h-full bg-white">
                <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
                  {p.coverImage ? (
                    p.coverImage.endsWith('.mp4') || p.coverImage.endsWith('.webm') || p.coverImage.startsWith('data:video/') ? (
                      <video src={p.coverImage} className="h-full w-full object-cover" muted loop autoPlay playsInline />
                    ) : (
                      <img src={p.coverImage} alt={p.name} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
                    )
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-primary bg-orange-50/50">
                      <Sparkles className="h-10 w-10 opacity-40" />
                    </div>
                  )}
                  {p.isVip && <Badge className="absolute top-3 left-3 bg-red-600 text-white font-bold border-none">⭐ VIP</Badge>}
                  {p.isOnline && (
                    <Badge className="absolute top-3 right-3 bg-green-600 text-white font-bold border-none text-[10px]">
                      📹 LIVE
                    </Badge>
                  )}
                </div>
                <CardContent className="p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div className="space-y-1">
                    <h3 className="font-bold text-sm text-slate-900 group-hover:text-orange-600 transition-colors line-clamp-1">{p.name}</h3>
                    <p className="text-[11px] text-muted-foreground flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5 text-orange-600 shrink-0" /> {p.temple?.name || 'Any Holy Temple'}
                    </p>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t">
                    <span className="text-lg font-black text-orange-600">₹{p.price}</span>
                    <Button size="sm" className="bg-orange-600 hover:bg-orange-700 text-white" asChild>
                      <Link href={`/pujas/${p.slug}`}>बुक करें</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            upcomingPujas.map((p, i) => (
              <Card key={i} className="overflow-hidden group border border-slate-100 hover:shadow-xl transition-all flex flex-col justify-between h-full bg-white">
                <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
                  <img src={p.img} alt={p.name} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
                  {p.vip && <Badge className="absolute top-3 left-3 bg-red-600 text-white font-bold border-none">⭐ VIP</Badge>}
                  <div className="absolute top-3 right-3 bg-black/70 backdrop-blur px-2.5 py-1 rounded text-[10px] text-white font-bold flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5 text-orange-500" /> {p.date}
                  </div>
                </div>
                <CardContent className="p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div className="space-y-1">
                    <h3 className="font-bold text-sm text-slate-900 group-hover:text-orange-600 transition-colors line-clamp-1">{p.name}</h3>
                    <p className="text-[11px] text-muted-foreground flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5 text-orange-600 shrink-0" /> {p.temple}
                    </p>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t">
                    <span className="text-lg font-black text-orange-600">₹{p.price}</span>
                    <Button size="sm" className="bg-orange-600 hover:bg-orange-700 text-white" asChild>
                      <Link href={`/pujas`}>बुक करें</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </MediaCarousel>
      </section>

      {/* SACRED PRODUCTS */}
      {products.length > 0 && (
        <section className="container py-14 bg-orange-50/20 rounded-3xl border border-orange-500/5">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <Badge className="bg-orange-500/10 border-orange-500/20 text-orange-600 hover:bg-orange-500/10 text-xs mb-2">सिद्ध सामग्री • Store</Badge>
              <h2 className="text-2xl md:text-3xl font-black text-slate-950">अभिमंत्रित पूजा सामग्री (Divine Products)</h2>
              <p className="text-xs text-muted-foreground">गंगाजल, सिद्ध माला, रुद्राक्ष एवं वैदिक यंत्र जो आपके घर को सकारात्मक ऊर्जा से भर दें।</p>
            </div>
            <Button variant="outline" className="border-slate-200 text-xs font-bold" asChild>
              <Link href="/products">सभी देखें (View All) <ArrowRight className="ml-1.5 h-4 w-4" /></Link>
            </Button>
          </div>
          <MediaCarousel>
            {products.map((p: any) => (
              <Card key={p.id} className="overflow-hidden group border border-slate-100 hover:shadow-xl transition-all flex flex-col justify-between h-full bg-white">
                <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
                  {p.coverImage || (p.images && p.images[0]) ? (
                    <img src={p.coverImage || p.images[0]} alt={p.name} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
                  ) : (
                    <div className="h-full w-full bg-slate-200" />
                  )}
                  {p.category?.name && (
                    <Badge className="absolute top-3 left-3 bg-orange-600 text-white border-none text-[10px] font-bold">
                      {p.category.name}
                    </Badge>
                  )}
                </div>
                <CardContent className="p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div className="space-y-1">
                    <h3 className="font-bold text-sm text-slate-900 group-hover:text-orange-600 transition-colors line-clamp-1">{p.name}</h3>
                    <p className="text-[11px] text-muted-foreground line-clamp-2 leading-relaxed">{p.shortDescription || 'प्रामाणिक एवं सिद्ध सनातन सामग्री।'}</p>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t">
                    <span className="text-lg font-black text-slate-900">₹{Number(p.salePrice || p.price)}</span>
                    <Button size="sm" className="bg-slate-900 hover:bg-slate-800 text-white text-xs" asChild>
                      <Link href={`/products`}>अभी खरीदें</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </MediaCarousel>
        </section>
      )}

      {/* LIVE EVENTS BANNER */}
      <section className="container">
        <div className="rounded-[2.5rem] bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-transparent border border-amber-200/50 p-1 shadow-sm">
          <div className="rounded-[calc(2.5rem-4px)] bg-white p-8 md:p-12 grid md:grid-cols-2 items-center gap-6 text-slate-800">
            <div className="space-y-4">
              <Badge className="bg-red-600 text-white border-none text-xs flex items-center w-fit gap-1"><Play className="h-3 w-3 fill-white animate-pulse" /> LIVE STREAM</Badge>
              <h2 className="text-3xl font-black text-slate-900">लाइव आरती व दिव्य दर्शन</h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                भारत के प्रमुख मंदिरों से साक्षात दैनिक आरती का हिस्सा बनें। हर दिन, हर पर्व पर सीधे गर्भगृह से लाइव दर्शन। अभी काशी विश्वनाथ मंगला आरती लाइव चल रही है।
              </p>
              <Button className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-bold" asChild><Link href="/events">पूर्ण दर्शन (Watch Full)</Link></Button>
            </div>
            
            <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl border-4 border-amber-200/50 bg-black group">
              <iframe 
                width="100%" 
                height="100%" 
                src="https://www.youtube.com/embed/5hdwR25nNvw?autoplay=1&mute=1&loop=1&playlist=5hdwR25nNvw&controls=0" 
                title="Kashi Vishwanath Live Aarti" 
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                allowFullScreen
                className="absolute inset-0 w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
              ></iframe>
              <div className="absolute top-4 left-4 bg-red-600 text-white text-[10px] font-black px-2 py-1 rounded animate-pulse shadow-lg flex items-center gap-1 z-10">
                <span className="h-1.5 w-1.5 rounded-full bg-white"></span> LIVE
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="container">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-10">
          <Badge className="bg-orange-500/10 border-orange-500/20 text-orange-600 hover:bg-orange-500/10 text-xs">अनुभव • Devotee Feedback</Badge>
          <h2 className="text-3xl font-black text-slate-950">भक्तों के पावन अनुभव (Devotees Speak)</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">सैकड़ों परिवारों ने हमारी सेवाओं के माध्यम से प्रभु का आशीर्वाद पाया है।</p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <Card key={i} className="border border-slate-100 hover:shadow-lg transition-all">
              <CardContent className="p-6 space-y-4">
                <div className="flex gap-0.5">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} className="h-4 w-4 fill-orange-500 text-orange-500" />
                  ))}
                </div>
                <p className="text-xs text-slate-600 leading-relaxed italic">“{t.message}”</p>
                <div className="flex items-center gap-3 pt-2 border-t">
                  <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold overflow-hidden">
                    {t.avatar ? (
                      <img src={t.avatar} alt={t.name} className="h-full w-full object-cover" />
                    ) : (
                      t.name[0]
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800 leading-tight">{t.name}</p>
                    <p className="text-[10px] text-muted-foreground">{t.location}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* APP PROMOTION BANNER */}
      <section className="container">
        <div className="rounded-[2.5rem] bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-transparent border border-amber-200/50 p-8 md:p-14 shadow-sm relative overflow-hidden">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            
            {/* Left text column */}
            <div className="space-y-6 text-left">
              <Badge className="bg-amber-500/10 border border-amber-500/30 text-amber-700 hover:bg-amber-500/20 px-3 py-1 text-xs font-bold rounded-full gap-1.5 w-fit">
                📱 दिव्ययज्ञम् ऐप • Mobile App
              </Badge>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 leading-tight">
                दिव्ययज्ञम् ऐप <br />
                <span className="text-om-gradient">डाउनलोड करें</span>
              </h2>
              <p className="text-slate-600 text-sm md:text-base leading-relaxed">
                भारत का सबसे प्रिय सनातन सेवा एवं भक्ति प्लेटफॉर्म। अपने मोबाइल पर दैनिक पंचांग, ज्योतिषीय परामर्श, लाइव आरती दर्शन, मंत्र जाप और अभिमंत्रित पूजन सेवाओं का लाभ कहीं भी, कभी भी उठाएं।
              </p>
              
              {/* App download mockup badges */}
              <div className="flex flex-wrap gap-4 pt-2">
                <a href="#" className="hover:scale-105 transition-transform">
                  <img src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png" className="h-14 object-contain" alt="Get it on Google Play" />
                </a>
                <a href="#" className="hover:scale-105 transition-transform flex items-center bg-black text-white px-4 py-2.5 rounded-xl border border-slate-800 shadow">
                  <span className="text-xs font-bold leading-tight">Download on the <br /><span className="text-sm font-black">App Store</span></span>
                </a>
              </div>
            </div>

            {/* Right graphic column */}
            <div className="flex justify-center items-center">
              <div className="relative max-w-sm md:max-w-md rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-white">
                <img 
                  src="/app-promo.jpg" 
                  className="w-full h-auto object-cover" 
                  alt="Divyayagyam App Promotion" 
                />
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  )
}
