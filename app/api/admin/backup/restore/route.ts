import { NextRequest, NextResponse } from 'next/server'
import AdmZip from 'adm-zip'
import { prisma } from '@/lib/prisma'
import fs from 'fs/promises'
import path from 'path'

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File | null
    if (!file) throw new Error('No backup file uploaded')

    const fileBuffer = Buffer.from(await file.arrayBuffer())
    const zip = new AdmZip(fileBuffer)

    // 1. EXTRACT DATABASE DUMP
    const dbEntry = zip.getEntry('database_dump.json')
    if (!dbEntry) throw new Error('Invalid backup: database_dump.json missing')

    const dbDump = JSON.parse(dbEntry.getData().toString('utf-8'))

    // 2. RESTORE TABLE DATA DYNAMICALLY WITH CASCADE TRUNCATES
    const tableNames = Object.keys(dbDump)
    
    await prisma.$transaction(async (tx) => {
      // Truncate tables first
      for (const tableName of tableNames) {
        try {
          await tx.$executeRawUnsafe(`TRUNCATE TABLE "${tableName}" CASCADE`)
        } catch (e: any) {
          console.warn(`[Restore] Truncate cascade ignored for ${tableName}:`, e.message)
        }
      }

      // Re-insert table rows
      for (const [tableName, rows] of Object.entries(dbDump)) {
        if (!rows || rows.length === 0) continue
        
        for (const row of rows) {
          const columns = Object.keys(row).map(c => `"${c}"`).join(', ')
          const values = Object.values(row).map((val: any) => {
            if (val === null) return 'NULL'
            if (val instanceof Date) return `'${val.toISOString()}'`
            if (typeof val === 'object') return `'${JSON.stringify(val).replace(/'/g, "''")}'`
            if (typeof val === 'string') return `'${val.replace(/'/g, "''")}'`
            if (typeof val === 'boolean') return val ? 'TRUE' : 'FALSE'
            return val
          }).join(', ')

          try {
            await tx.$executeRawUnsafe(`INSERT INTO "${tableName}" (${columns}) VALUES (${values})`)
          } catch (e: any) {
            console.error(`[Restore] Failed to restore row in ${tableName}:`, e.message)
          }
        }
      }
    })

    // 3. RESTORE CUSTOMIZATIONS
    const custEntry = zip.getEntry('customizations.json')
    if (custEntry) {
      const customizations = JSON.parse(custEntry.getData().toString('utf-8'))
      const custFile = path.join(process.cwd(), 'lib', 'data', 'customizations.json')
      await fs.writeFile(custFile, JSON.stringify(customizations, null, 2), 'utf-8')
    }

    return NextResponse.json({ ok: true, message: 'Database and theme settings restored successfully!' })
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message }, { status: 500 })
  }
}
