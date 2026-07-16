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
          <AiChat
            mode="pandit"
            emptyTitle="🙏 प्रणाम"
            emptyDescription="Puja, mantras, festivals, astrology — kuchh bhi poochho."
            placeholder="e.g. Ekadashi vrat kaise karein?"
            suggestions={[
              'Sawan Somvar puja kaise karein?',
              'Ganesh Chaturthi ka significance kya hai?',
              'Meditation shuru kaise karein?',
              'Rudrabhishek ke fayde kya hain?',
              'Kundali dosh nivaran ke upay',
            ]}
            streamHeight="h-[560px]"
          />
          <p className="mt-4 text-xs text-center text-muted-foreground">
            ⚠️ AI-generated guidance. For important rituals, please consult a qualified Pandit.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  )
}
