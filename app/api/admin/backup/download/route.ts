import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'

const SETTINGS_FILE = path.join(process.cwd(), 'lib', 'data', 'backup-settings.json')
const DEFAULT_LOCAL_PATH = "C:\\Users\\Jai Shree Krishna\\Desktop\\Divyayagyam-main\\backups"

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const filename = searchParams.get('filename')
    if (!filename) {
      return NextResponse.json({ ok: false, error: 'Missing filename parameter' }, { status: 400 })
    }

    let localPath = DEFAULT_LOCAL_PATH
    try {
      const raw = await fs.readFile(SETTINGS_FILE, 'utf-8')
      const settings = JSON.parse(raw)
      localPath = settings.localPath || DEFAULT_LOCAL_PATH
    } catch {}

    const filePath = path.join(localPath, filename)
    const fileBuffer = await fs.readFile(filePath)

    return new Response(fileBuffer, {
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename="${filename}"`
      }
    })
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message }, { status: 500 })
  }
}
