import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'

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

      await fs.writeFile(filePath, buffer)

      return NextResponse.json({
        ok: true,
        url: `/uploads/${fileName}`,
        name: file.name,
        size: file.size,
      })
    } catch (fsError: any) {
      console.warn('Local FS write failed (likely read-only on Vercel), falling back to base64 encoding:', fsError?.message)
      
      // Fallback: Convert to Base64 Data URL
      const base64Data = buffer.toString('base64')
      const mimeType = file.type || 'image/jpeg'
      const dataUrl = `data:${mimeType};base64,${base64Data}`

      return NextResponse.json({
        ok: true,
        url: dataUrl,
        name: file.name,
        size: file.size,
        note: 'Base64 fallback active',
      })
    }
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message || 'Upload failed' }, { status: 500 })
  }
}
