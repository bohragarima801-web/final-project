import { NextRequest } from 'next/server'
import { getLLM, MODELS, SYSTEM_PROMPTS, type ChatMessage } from '@/lib/ai'

export const runtime = 'nodejs'
export const maxDuration = 60

type Mode = 'pandit' | 'admin_content' | 'admin_blog' | 'admin_seo'

export async function POST(req: NextRequest) {
  let doStream = true
  let session_id = null
  try {
    const body = await req.json().catch(() => null)
    const {
      messages = [],
      mode = 'pandit' as Mode,
      model,
      stream = true,
      session_id: sid = null,
    } = body || {}

    doStream = stream
    session_id = sid

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
    
    // Handle missing API key or connection failures gracefully with a Pandit fallback
    const fallbackText = "हरि ओम्! 🙏 दिव्ययज्ञम् के डिजिटल पंडित कक्ष में आपका स्वागत है। वर्तमान में हमारी एआई संवाद सेवा तकनीकी रखरखाव के अंतर्गत है। यदि आपका कोई प्रश्न पूजा, अनुष्ठान या संकल्प से संबंधित है, तो आप नीचे दिए गए 'सहायता' (Support) विकल्प से हमारे मुख्य पंडितों और सहायता टीम से सीधे संपर्क कर सकते हैं। कल्याणम अस्तु! 🌸"
    
    if (!doStream) {
      return new Response(JSON.stringify({
        ok: true,
        content: fallbackText,
        model: 'fallback-pandit',
        session_id: session_id || null,
      }), { headers: { 'Content-Type': 'application/json' } })
    } else {
      const encoder = new TextEncoder()
      const readable = new ReadableStream({
        start(controller) {
          controller.enqueue(encoder.encode(fallbackText))
          controller.close()
        }
      })
      return new Response(readable, {
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
          'Cache-Control': 'no-cache, no-transform',
          'X-Model': 'fallback-pandit',
        },
      })
    }
  }
}
