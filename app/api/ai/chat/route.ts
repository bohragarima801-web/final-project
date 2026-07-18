import { NextRequest } from 'next/server'
import { getLLM, MODELS, SYSTEM_PROMPTS, type ChatMessage } from '@/lib/ai'

export const runtime = 'nodejs'
export const maxDuration = 60

type Mode = 'pandit' | 'admin_content' | 'admin_blog' | 'admin_seo'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      messages = [],
      mode = 'pandit' as Mode,
      model,
      stream: doStream = true,
      session_id,
    } = body || {}

    if (!Array.isArray(messages) || messages.length === 0) {
      return new Response(JSON.stringify({ ok: false, error: 'messages required' }), { status: 400 })
    }

    const chosenModel =
      model ||
      (mode === 'admin_blog' || mode === 'admin_content' ? MODELS.PRO : MODELS.FLASH)

    const systemPrompt = SYSTEM_PROMPTS[mode as keyof typeof SYSTEM_PROMPTS] || SYSTEM_PROMPTS.pandit

    const chatMessages: ChatMessage[] = [
      { role: 'system', content: systemPrompt },
      ...messages.map((m: any) => ({ role: m.role, content: m.content })),
    ]

    const llm = await getLLM()

    if (!doStream) {
      const completion = await llm.chat.completions.create({
        model: chosenModel,
        messages: chatMessages as any,
        temperature: mode.startsWith('admin') ? 0.75 : 0.85,
      })
      const text = completion.choices?.[0]?.message?.content ?? ''
      return new Response(JSON.stringify({
        ok: true,
        content: text,
        model: chosenModel,
        session_id: session_id || null,
      }), { headers: { 'Content-Type': 'application/json' } })
    }

    // Streaming path
    const completionStream = await llm.chat.completions.create({
      model: chosenModel,
      messages: chatMessages as any,
      temperature: mode.startsWith('admin') ? 0.75 : 0.85,
      stream: true,
    })

    const encoder = new TextEncoder()
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of completionStream as any) {
            const delta = chunk?.choices?.[0]?.delta?.content
            if (delta) controller.enqueue(encoder.encode(delta))
          }
          controller.close()
        } catch (err: any) {
          controller.enqueue(encoder.encode(`\n\n[stream error: ${err?.message || 'unknown'}]`))
          controller.close()
        }
      },
    })

    return new Response(readable, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache, no-transform',
        'X-Model': chosenModel,
      },
    })
  } catch (err: any) {
    console.error('[ai/chat] error:', err)

    if (err?.message?.includes('API key is not configured') || err?.message?.includes('API key')) {
      const fallbackText = `कल्याण हो! 🙏\n\nमैं आपका एआई पंडित (AI Pandit) हूँ। वर्तमान में, एआई सेवा को पूर्ण रूप से सक्रिय करने के लिए बैकएंड में एपीआई कुंजी (API Key) कॉन्फ़िगर नहीं की गई है।\n\n**डेवलपर के लिए संकेत (Developer Hint):**\nकृपया अपनी \`.env\` फ़ाइल में \`EMERGENT_LLM_KEY\` या \`OPENAI_API_KEY\` दर्ज करें, या एडमिन सेटिंग्स पैनल (Admin Settings Panel) में जाकर 'OpenAI API Key' को कॉन्फ़िगर करें।\n\n**Devyajnam सेवाएं:**\nतब तक, आप हमारी मुख्य सेवाओं का उपयोग कर सकते हैं:\n1. **ऑनलाइन पूजा:** हमारे मुख्य पृष्ठ या 'Sacred Pujas' पेज पर जाकर देश के प्रसिद्ध मंदिरों से पूजा बुक करें।\n2. **लाइव इवेंट्स:** गंगा आरती और अन्य लाइव उत्सवों को देखने के लिए 'Live Events' पेज पर जाएं।\n3. **दान (Donation):** गौशाला सेवा, अन्नदान और मंदिर निर्माण में सहयोग करें।\n\nयदि आपके पास कोई और प्रश्न है, तो कृपया हमसे संपर्क करें। हरि ओम्! 🌸`

      if (!doStream) {
        return new Response(JSON.stringify({
          ok: true,
          content: fallbackText,
          model: 'fallback-pandit-model',
          session_id: session_id || null,
        }), { headers: { 'Content-Type': 'application/json' } })
      }

      // Streaming fallback response
      const encoder = new TextEncoder()
      const readable = new ReadableStream({
        async start(controller) {
          const words = fallbackText.split(' ')
          for (let i = 0; i < words.length; i++) {
            controller.enqueue(encoder.encode(words[i] + (i < words.length - 1 ? ' ' : '')))
            await new Promise((res) => setTimeout(res, 25))
          }
          controller.close()
        },
      })

      return new Response(readable, {
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
          'Cache-Control': 'no-cache, no-transform',
          'X-Model': 'fallback-pandit-model',
        },
      })
    }

    return new Response(JSON.stringify({
      ok: false,
      error: err?.message || 'AI request failed',
      hint: 'Check EMERGENT_LLM_KEY env var and network connectivity to Emergent proxy',
    }), { status: 500, headers: { 'Content-Type': 'application/json' } })
  }
}
