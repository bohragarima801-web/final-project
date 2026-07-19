'use client'

import { useParams, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, Languages, Calendar, User, Clock, Heart, Share2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

// Multilingual blog database
const BLOG_DATABASE: Record<string, {
  category: string
  readTime: string
  date: string
  author: string
  translations: Record<string, {
    title: string
    content: string
    subtitle: string
  }>
}> = {
  'mahamrityunjaya-mantra': {
    category: 'Mantras & Chants',
    readTime: '5 min read',
    date: 'July 19, 2026',
    author: 'Pandit Mukesh Bohra',
    translations: {
      hi: {
        title: 'महामृत्युंजय मंत्र का महत्व और लाभ',
        subtitle: 'ऋग्वेद का सबसे शक्तिशाली मंत्र जो भय और रोग से मुक्ति दिलाता है।',
        content: `महामृत्युंजय मंत्र ऋग्वेद का एक अत्यंत शक्तिशाली मंत्र है। इसे रुद्र मंत्र या त्रयंबकम मंत्र भी कहा जाता है। यह भगवान शिव को समर्पित है और इसके निरंतर जाप से मानसिक शांति, उत्तम स्वास्थ्य और अकाल मृत्यु का भय दूर होता है।

शास्त्रों के अनुसार, जब साधक सच्चे मन से इस मंत्र का उच्चारण करता है, तो उसके चारों ओर एक सकारात्मक ऊर्जा का कवच बन जाता है। यह मंत्र केवल एक धार्मिक श्लोक नहीं है, बल्कि इसके अक्षरों की ध्वनि शरीर में विभिन्न चक्रों को सक्रिय करती है।

**महामृत्युंजय मंत्र मूल रूप:**
*ॐ त्र्यम्बकं यजामहे सुगन्धिं पुष्टिवर्धनम्।*
*उर्वारुकमिव बन्धनान्मृत्योर्मुक्षीय माऽमृतात्॥*

**अर्थ:**
हम त्रिनेत्रधारी भगवान शिव की पूजा करते हैं, जो प्रत्येक श्वास में सुगंध भरते हैं और हमारा पोषण करते हैं। जैसे ककड़ी अपनी बेल के बंधन से मुक्त हो जाती है, वैसे ही हम मृत्यु और नश्वरता के चक्र से मुक्त हो जाएं, न कि अमरता से।

इस मंत्र का नित्य ११ या १०८ बार जाप करने से जीवन की बड़ी से बड़ी बाधाएं भी टल जाती हैं।`
      },
      en: {
        title: 'Significance & Benefits of Mahamrityunjaya Mantra',
        subtitle: 'The most powerful mantra of Rigveda that grants freedom from fear and disease.',
        content: `The Mahamrityunjaya Mantra is one of the most potent chants found in the Rigveda. Also known as the Rudra Mantra or Tryambakam Mantra, it is dedicated to Lord Shiva. Daily chanting of this mantra brings peace of mind, physical health, and eliminates the fear of untimely death.

According to sacred scriptures, when a devotee chants this mantra with deep devotion, a protective shield of positive energy surrounds them. This mantra is not just a religious chant; its sound waves activate the spiritual energy centers (chakras) within our body.

**The Original Mantra:**
*Om Tryambakam Yajamahe Sugandhim Pushti-Vardhanam*
*Urvarukamiva Bandhanan Mrityor Mukshiya Maamritat*

**Meaning:**
We worship the three-eyed Lord Shiva, who is fragrant and nourishes all beings. May He liberate us from death and the cycle of rebirth, just as a ripe cucumber is severed from its vine, and lead us to immortality.

Reciting this mantra 11 or 108 times daily helps overcome obstacles and heals mental and physical ailments.`
      },
      ta: {
        title: 'மகா மிருத்யுஞ்சய மந்திரத்தின் முக்கியத்துவம் மற்றும் நன்மைகள்',
        subtitle: 'பயம் மற்றும் நோய்களிலிருந்து விடுதலை அளிக்கும் ரிக்வேதத்தின் மிக சக்திவாய்ந்த மந்திரம்.',
        content: `மகா மிருத்யுஞ்சய மந்திரம் ரிக்வேதத்தில் உள்ள மிகச் சக்திவாய்ந்த மந்திரங்களில் ஒன்றாகும். இது ருத்ர மந்திரம் அல்லது திரியம்பகம் மந்திரம் என்றும் அழைக்கப்படுகிறது. இது சிவபெருமானுக்கு அர்ப்பணிக்கப்பட்டது. இந்த மந்திரத்தை தொடர்ந்து உச்சரிப்பது மன அமைதி, சிறந்த ஆரோக்கியம் மற்றும் அகால மரண பயத்தை நீக்குகிறது.

புனித நூல்களின்படி, ஒரு பக்தர் இந்த மந்திரத்தை உண்மையான பக்தியுடன் உச்சரிக்கும்போது, அவரைச் சுற்றி நேர்மறை ஆற்றலின் பாதுகாப்பு கவசம் உருவாகிறது. இது வெறும் ஆன்மீக ஸ்லோகம் மட்டுமல்ல, இதன் ஒலி அலைகள் உடலில் உள்ள சக்கரங்களை தூண்டுகின்றன.

**மந்திரத்தின் வடிவம்:**
*ஓம் த்ரயம்பகம் யஜாமஹே ஸுகந்திம் புஷ்டிவர்த்தனம்*
*உர்வாருகமிவ பந்தனான் மிருத்யோர் முக்ஷீய மாமிருதாத்*

தினமும் 11 அல்லது 108 முறை இந்த மந்திரத்தை உச்சரிப்பது வாழ்வில் ஏற்படும் தடைகளை நீக்கி, நீண்ட ஆயுளையும் ஆரோக்கியத்தையும் தரும்.`
      },
      te: {
        title: 'మహామృత్యుంజయ మంత్రం యొక్క ప్రాముఖ్యత మరియు ప్రయోజనాలు',
        subtitle: 'భయం మరియు వ్యాధుల నుండి విముక్తి ప్రసాదించే అత్యంత శక్తివంతమైన ఋగ్వేద మంత్రం.',
        content: `మహామృత్యుంజయ మంత్రం ఋగ్వేదంలోని అత్యంత శక్తివంతమైన మంత్రాలలో ఒకటి. దీనిని రుద్ర మంత్రం లేదా త్రయంబక మంత్రం అని కూడా పిలుస్తారు. ఇది పరమశివునికి అంకితం చేయబడింది. ఈ మంత్రాన్ని నిత్యం జపించడం వల్ల మానసిక ప్రశాంతత, ఉత్తమ ఆరోగ్యం మరియు అకాల మృత్యు భయం తొలగిపోతాయి.

శాస్త్రాల ప్రకారం, భక్తుడు ఈ మంత్రాన్ని పూర్తి విశ్వాసంతో జపించినప్పుడు, అతని చుట్టూ ఒక సానుకూల శక్తి రక్షణ కవచం ఏర్పడుతుంది. ఈ మంత్రం శబ్ద తరంగాలు శరీరంలోని చక్రాలను ఉత్తేజపరుస్తాయి.

**మూల మంత్రం:**
*ఓం త్రయంబకం యజామహే సుగంధిం పుష్టివర్ధనమ్*
*ఉర్వారుకమివ బంధనాన్ మృత్యోర్ ముక్షీయ మామృతాత్*

ఈ మంత్రాన్ని ప్రతిరోజూ 11 లేదా 108 సార్లు జపించడం ద్వారా జీవితంలో వచ్చే అడ్డంకులు తొలగిపోయి ఆయురారోగ్యాలు లభిస్తాయి.`
      },
      kn: {
        title: 'ಮಹಾಮೃತ್ಯುಂಜಯ ಮಂತ್ರದ ಮಹತ್ವ ಮತ್ತು ಪ್ರಯೋಜನಗಳು',
        subtitle: 'ಭಯ ಮತ್ತು ರೋಗಗಳಿಂದ ಮುಕ್ತಿ ನೀಡುವ ಋಗ್ವೇದದ ಅತ್ಯಂತ ಶಕ್ತಿಶಾಲಿ ಮಂತ್ರ.',
        content: `ಮಹಾಮೃತ್ಯುಂಜಯ ಮಂತ್ರವು ಋಗ್ವೇದದ ಅತ್ಯಂತ ಶಕ್ತಿಶಾಲಿ ಮಂತ್ರಗಳಲ್ಲಿ ಒಂದಾಗಿದೆ. ಇದನ್ನು ರುದ್ರ ಮಂತ್ರ ಅಥವಾ ತ್ರಯಂಬಕ ಮಂತ್ರ ಎಂದೂ ಕರೆಯುತ್ತಾರೆ. ಇದು ಶಿವನಿಗೆ ಸಮರ್ಪಿತವಾಗಿದೆ. ಈ ಮಂತ್ರದ ನಿರಂತರ ಜಪದಿಂದ ಮಾನಸಿಕ ಶಾಂತಿ, ಉತ್ತಮ ಆರೋಗ್ಯ ಮತ್ತು ಅಕಾಲಿಕ ಮರಣದ ಭಯ ದೂರವಾಗುತ್ತದೆ.

ಶಾಸ್ತ್ರಗಳ ಪ್ರಕಾರ, ಒಬ್ಬ ಭಕ್ತನು ಈ ಮಂತ್ರವನ್ನು ಪೂರ್ಣ ಭಕ್ತಿಯಿಂದ ಜಪಿಸಿದಾಗ, ಅವನ ಸುತ್ತಲೂ ಧನಾತ್ಮಕ ಶಕ್ತಿಯ ರಕ್ಷಣಾತ್ಮಕ ಕವಚವು ರೂಪುಗೊಳ್ಳುತ್ತದೆ. ಈ ಮಂತ್ರದ ಶಬ್ದ ತರಂಗಗಳು ದೇಹದಲ್ಲಿನ ಚಕ್ರಗಳನ್ನು ಸಕ್ರಿಯಗೊಳಿಸುತ್ತವೆ.

**ಮೂಲ ಮಂತ್ರ:**
*ಓಂ ತ್ರ್ಯಂಬಕಂ ಯಜಾಮಹೇ ಸುಗಂಧಿಂ ಪುಷ್ಟಿವರ್ಧನಮ್*
*ಉರ್ವಾರುಕಮಿವ ಬಂಧನಾನ್ ಮೃತ್ಯೋರ್ ಮುಕ್ಷೀಯ ಮಾಮೃತಾತ್*

ಪ್ರತಿದಿನ ಈ ಮಂತ್ರವನ್ನು 11 ಅಥವಾ 108 ಬಾರಿ ಜಪಿಸುವುದರಿಂದ ಜೀವನದಲ್ಲಿ ಬರುವ ಅಡೆತಡೆಗಳು ನಿವಾರಣೆಯಾಗಿ ದೀರ್ಘಾಯುಷ್ಯ ದೊರೆಯುತ್ತದೆ.`
      },
      gu: {
        title: 'મહામૃત્યુંજય મંત્રનું મહત્વ અને ફાયદા',
        subtitle: 'ઋગ્વેદનો સૌથી શક્તિશાળી મંત્ર જે ભય અને રોગથી મુક્તિ અપાવે છે.',
        content: `મહામૃત્યુંજય મંત્ર ઋગ્વેદનો એક અત્યંત શક્તિશાળી મંત્ર છે. તેને રુદ્ર મંત્ર અથવા ત્રયંબક મંત્ર પણ કહેવામાં આવે છે. આ ભગવાન શિવને સમર્પિત છે અને તેના નિરંતર જાપથી માનસિક શાંતિ, ઉત્તમ સ્વાસ્થ્ય અને અકાળ મૃત્યુનો ભય દૂર થાય છે.

શાસ્ત્રો અનુસાર, જ્યારે સાધક સાચા મનથી આ મંત્રનું ઉચ્ચારણ કરે છે, ત્યારે તેની ચારે બાજુ સકારાત્મક ઊર્જાનું કવચ બની જાય છે.

**મંત્રનો મૂળ ભાગ:**
*ૐ ત્ર્યમ્બકં યજામહે સુગન્ધિં પુષ્ટિવર્ધનમ્।*
*ઉર્વારુકમિવ બન્ધનાન્મૃત્યોર્મુક્ષીય માઽમૃતાત્॥*

આ મંત્રનો નિત્ય ૧૧ કે ૧૦૮ વાર જાપ કરવાથી જીવનના મોટા અવરોધો દૂર થાય છે.`
      },
      mr: {
        title: 'महामृत्युंजय मंत्राचे महत्त्व आणि फायदे',
        subtitle: 'ऋग्वेदातील सर्वात शक्तिशाली मंत्र जो भय आणि रोगापासून मुक्ती देतो.',
        content: `महामृत्युंजय मंत्र हा ऋग्वेदातील अत्यंत शक्तिशाली मंत्र आहे. याला रुद्र मंत्र किंवा त्रयंबकम मंत्र असेही म्हणतात. हा भगवान शंकराला समर्पित असून याच्या नियमित जापाने मानसिक शांती, उत्तम आरोग्य आणि अकाली मृत्यूची भीती दूर होते.

शास्त्रांनुसार, जेव्हा भक्त खऱ्या मनाने या मंत्राचा उच्चार करतो, तेव्हा त्याच्याभोवती सकारात्मक ऊर्जेचे कवच तयार होते.

**मंत्राचे मूळ रूप:**
*ॐ त्र्यम्बकं यजामहे सुगन्धिं पुष्टिवर्धनम्।*
*उर्वारुकमिव बन्धनान्मृत्योर्मुक्षीय माऽमृतात्॥*

या मंत्राचा रोज ११ किंवा १०८ वेळा जप केल्यास जीवनातील संकटे दूर होतात.`
      },
      bn: {
        title: 'মহামৃত্যুঞ্জয় মন্ত্রের গুরুত্ব ও উপকারিতা',
        subtitle: 'ঋগ্বেদের সবচেয়ে শক্তিশালী মন্ত্র যা ভয় ও রোগ থেকে মুক্তি দেয়।',
        content: `মহামৃত্যুঞ্জয় মন্ত্র ঋগ্বেদের একটি অত্যন্ত শক্তিশালী মন্ত্র। একে রুদ্র মন্ত্র বা ত্রয়ম্বকম মন্ত্রও বলা হয়। এটি ভগবান শিবের উদ্দেশ্যে উৎসর্গীকৃত এবং এর নিয়মিত জপের মাধ্যমে মানসিক শান্তি, উত্তম স্বাস্থ্য ও অকাল মৃত্যুর ভয় দূর হয়।

শাস্ত্র অনুযায়ী, যখন কোনো ভক্ত পবিত্র মনে এই মন্ত্র উচ্চারণ করেন, তখন তাঁর চারপাশে একটি ইতিবাচক শক্তির বলয় তৈরি হয়।

**মূল মন্ত্র:**
*ওঁ ত্র্যম্বকং যজামহে সুগন্ধিং পুষ্টিবর্ধনম্।*
*উর্বারু কমিব বন্ধনান্মৃত্যোর্মুক্ষীয় মামৃতাৎ॥*

প্রতিদিন ১১ বা ১০৮ বার এই মন্ত্র জপ করলে জীবনের সব বাধা কেটে যায় এবং আরোগ্য লাভ হয়।`
      }
    }
  }
}

const LANGUAGES = [
  { code: 'hi', label: 'हिन्दी' },
  { code: 'en', label: 'English' },
  { code: 'ta', label: 'தமிழ்' },
  { code: 'te', label: 'తెలుగు' },
  { code: 'kn', label: 'ಕನ್ನಡ' },
  { code: 'gu', label: 'ગુજરાતી' },
  { code: 'mr', label: 'मराठी' },
  { code: 'bn', label: 'বাংলা' },
]

export default function BlogDetailPage() {
  const params = useParams()
  const router = useRouter()
  const slug = (params?.slug as string) || 'mahamrityunjaya-mantra'
  
  const [lang, setLang] = useState('hi')
  const [copied, setCopied] = useState(false)
  const [liked, setLiked] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('lang') || 'hi'
      setLang(stored)
    }
  }, [])

  const handleLangChange = (code: string) => {
    setLang(code)
    localStorage.setItem('lang', code)
    // Dispatch event to update navbar lang state
    window.dispatchEvent(new Event('languageChange'))
  }

  const post = BLOG_DATABASE[slug] || BLOG_DATABASE['mahamrityunjaya-mantra']
  const contentData = post.translations[lang] || post.translations['hi']

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="container max-w-4xl py-12 px-4">
      {/* Back button */}
      <Button variant="ghost" size="sm" asChild className="mb-8 hover:text-primary rounded-xl">
        <Link href="/blog" className="inline-flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" /> लेख सूची (Back to Blog)
        </Link>
      </Button>

      {/* Language Switcher Bar inside the blog page */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 mb-8 bg-amber-50/50 border border-amber-100 rounded-2xl">
        <div className="flex items-center gap-2 text-sm font-bold text-amber-900">
          <Languages className="h-5 w-5 text-orange-600" />
          <span>भाषा बदलें (Select Language):</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {LANGUAGES.map((l) => (
            <button
              key={l.code}
              onClick={() => handleLangChange(l.code)}
              className={cn(
                "px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border",
                lang === l.code 
                  ? "bg-gradient-to-r from-orange-500 to-red-600 text-white border-transparent shadow-sm" 
                  : "bg-white text-slate-700 border-amber-100 hover:bg-amber-50/40"
              )}
            >
              {l.label}
            </button>
          ))}
        </div>
      </div>

      {/* Article Content Area */}
      <article className="space-y-6 bg-white border border-amber-100 p-6 md:p-10 rounded-3xl shadow-sm">
        <div className="space-y-3">
          <Badge className="bg-amber-500/10 border border-amber-500/30 text-amber-700 hover:bg-amber-500/20 text-xs py-1 px-3.5 rounded-full font-bold">
            {post.category}
          </Badge>
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 leading-tight">
            {contentData.title}
          </h1>
          <p className="text-slate-500 text-base leading-relaxed font-medium">
            {contentData.subtitle}
          </p>
        </div>

        {/* Metadata info */}
        <div className="flex flex-wrap items-center justify-between border-t border-b border-amber-100/60 py-4 gap-4 text-xs font-bold text-slate-500">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5"><User className="h-4 w-4 text-orange-500" /> By {post.author}</span>
            <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4 text-orange-500" /> {post.date}</span>
            <span className="flex items-center gap-1.5"><Clock className="h-4 w-4 text-orange-500" /> {post.readTime}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setLiked(!liked)}
              className={cn("gap-1.5 rounded-xl", liked && "text-red-500 hover:text-red-600 bg-red-50/50")}
            >
              <Heart className={cn("h-4 w-4", liked && "fill-red-500")} /> {liked ? 'Liked' : 'Like'}
            </Button>
            <Button variant="ghost" size="sm" onClick={handleShare} className="gap-1.5 rounded-xl">
              <Share2 className="h-4 w-4" /> {copied ? 'Copied!' : 'Share'}
            </Button>
          </div>
        </div>

        {/* Main body content */}
        <div className="text-slate-700 text-base md:text-lg leading-relaxed whitespace-pre-wrap font-normal space-y-4 pt-2">
          {contentData.content}
        </div>
      </article>

      {/* Suggested Services */}
      <div className="mt-12 text-center bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-transparent border border-amber-200/50 p-8 rounded-3xl">
        <h3 className="text-xl font-bold text-slate-900 mb-2">क्या आप शिव पूजा अनुष्ठान कराना चाहते हैं?</h3>
        <p className="text-slate-600 text-sm max-w-lg mx-auto mb-5">
          हमारे प्रमाणित वैदिक ब्राह्मणों द्वारा अपने नाम व गोत्र से महामृत्युंजय जाप व रुद्राभिषेक पूजा संपन्न कराएं।
        </p>
        <Button size="lg" className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-bold" asChild>
          <Link href="/pujas"> पूजा बुकिंग देखें</Link>
        </Button>
      </div>
    </div>
  )
}
