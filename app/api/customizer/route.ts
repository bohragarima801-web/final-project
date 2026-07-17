import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'
import { prisma } from '@/lib/prisma'

const FILE = path.join(process.cwd(), 'lib', 'data', 'customizations.json')

async function read() {
  try {
    const raw = await fs.readFile(FILE, 'utf-8')
    return JSON.parse(raw)
  } catch {
    return { globalCss: '', globalJs: '', pageCustom: {} }
  }
}

async function write(data: any) {
  await fs.mkdir(path.dirname(FILE), { recursive: true })
  await fs.writeFile(FILE, JSON.stringify(data, null, 2), 'utf-8')
}

export async function GET() {
  const data = await read()
  
  // Load theme & identity settings from database to apply dynamically
  const settings = await prisma.websiteSetting.findMany({
    where: {
      key: {
        in: ['theme.primary', 'theme.accent', 'theme.secondary', 'theme.background', 'site.logo', 'site.name'],
      },
    },
  }).catch(() => [])

  const theme: Record<string, string> = {}
  settings.forEach((s) => {
    theme[s.key] = s.value
  })

  return NextResponse.json({ ok: true, data: { ...data, theme } }, {
    headers: { 'Cache-Control': 'no-store' },
  })
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const current = await read()
    
    // Save theme settings to database if provided
    if (body.theme && typeof body.theme === 'object') {
      for (const [k, v] of Object.entries(body.theme)) {
        await prisma.websiteSetting.upsert({
          where: { key: k },
          update: { value: v as any },
          create: { key: k, value: v as any, group: 'theme' }
        })
      }
    }

    const merged = {
      globalCss: typeof body.globalCss === 'string' ? body.globalCss : current.globalCss,
      globalJs: typeof body.globalJs === 'string' ? body.globalJs : current.globalJs,
      pageCustom: body.pageCustom && typeof body.pageCustom === 'object'
        ? { ...current.pageCustom, ...body.pageCustom }
        : current.pageCustom,
    }
    await write(merged)
    return NextResponse.json({ ok: true, data: merged })
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message }, { status: 500 })
  }
}
