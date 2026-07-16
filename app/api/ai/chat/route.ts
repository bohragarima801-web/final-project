import { NextRequest } from 'next/server'
import { getLLM, MODELS, SYSTEM_PROMPTS, type ChatMessage } from '@/lib/ai'
import { initSecrets } from '@/lib/secrets'

export const runtime = 'nodejs'
export const maxDuration = 60

type Mode = 'pandit' | 'admin_content' | 'admin_blog' | 'admin_seo'

export async function POST(req: NextRequest) {
  try {
    // Ensure secrets from admin are loaded into process.env
    await initSecrets()

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

    const llm = getLLM()

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
    return new Response(JSON.stringify({
      ok: false,
      error: err?.message || 'AI request failed',
      hint: 'Check EMERGENT_LLM_KEY env var and network connectivity to Emergent proxy',
    }), { status: 500, headers: { 'Content-Type': 'application/json' } })
  }
}
