import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'
import { Buffer } from 'buffer'

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ ok: false, error: 'No file uploaded' }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Try writing to local public folder first
    try {
      const uploadDir = path.join(process.cwd(), 'public', 'uploads')
      await fs.mkdir(uploadDir, { recursive: true })

      const fileExt = path.extname(file.name)
      const fileName = `${uuidv4()}${fileExt}`
      const filePath = path.join(uploadDir, fileName)

      await fs.writeFile(filePath, new Uint8Array(buffer))

      return NextResponse.json({
        ok: true,
        url: `/uploads/${fileName}`,
        name: file.name,
        size: file.size,
      })
    } catch (fsError: any) {
      console.warn('Local FS write failed (likely read-only on Vercel).')
      return NextResponse.json({ 
        ok: false, 
        error: 'Local storage is read-only on this server (Vercel). Please use the "Google Drive Link" option to add media.' 
      }, { status: 400 })
    }
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message || 'Upload failed' }, { status: 500 })
  }
}
