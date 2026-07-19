import { AIChat } from '@/components/ai-chat'
import { Badge } from '@/components/ui/badge'

export default function AskAPanditPage() {
  return (
    <div className="container py-12 max-w-4xl space-y-8">
      <div className="text-center space-y-3">
        <Badge className="bg-orange-500/10 text-orange-600 hover:bg-orange-500/20 border border-orange-500/20 px-3 py-1 text-xs">
          ✨ Live Spiritual AI
        </Badge>
        <h1 className="text-3xl md:text-5xl font-black text-slate-900">
          Ask a <span className="text-om-gradient">Pandit</span>
        </h1>
        <p className="text-slate-600 max-w-2xl mx-auto">
          Seek spiritual guidance, astrological advice, and learn about Hindu traditions directly from our AI-powered Vedic assistant.
        </p>
      </div>
      
      <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-2xl relative min-h-[600px]">
        {/* We use the pre-built AIChat component here */}
        <AIChat />
      </div>
    </div>
  )
}
