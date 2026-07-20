import { AiChat } from '@/components/ai-chat'
import { Navbar } from '@/components/layouts/navbar'
import { Footer } from '@/components/layouts/footer'
import { Badge } from '@/components/ui/badge'

export default function AskPanditPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar user={null} />
      <main className="flex-1 bg-gradient-to-br from-primary/5 via-background to-accent/5">
        <div className="container max-w-3xl py-10">
          <div className="text-center mb-6">
            <Badge variant="secondary" className="mb-2">🕊️ AI Assistant • Powered by Gemini</Badge>
            <h1 className="text-3xl md:text-4xl font-bold">
              <span className="text-om-gradient">Ask a Pandit</span>
            </h1>
            <p className="mt-2 text-muted-foreground">Get instant spiritual guidance in Hindi, English or Hinglish.</p>
          </div>
          <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border border-amber-200/50 rounded-3xl p-8 md:p-12 shadow-sm text-center">
            <p className="text-lg md:text-xl text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
              हरि ओम्! 🙏 दिव्ययज्ञम् के डिजिटल पंडित कक्ष में आपका स्वागत है। वर्तमान में हमारी एआई संवाद सेवा तकनीकी रखरखाव के अंतर्गत है। यदि आपका कोई प्रश्न पूजा, अनुष्ठान या संकल्प से संबंधित है, तो आप नीचे दिए गए 'सहायता' (Support) विकल्प से हमारे मुख्य पंडितों और सहायता टीम से सीधे संपर्क कर सकते हैं। कल्याणम अस्तु! 🌸
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
