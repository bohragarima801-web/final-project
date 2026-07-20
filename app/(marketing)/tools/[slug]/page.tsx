import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { headers } from 'next/headers'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { AlertCircle, Lock } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

export const dynamic = 'force-dynamic'

export default async function ToolViewPage({ params }: { params: { slug: string } }) {
  const tool = await prisma.spiritualTool.findUnique({ where: { slug: params.slug } })
  
  if (!tool || !tool.isActive) {
    notFound()
  }

  const reqHeaders = headers()
  const ip = reqHeaders.get('x-forwarded-for') || '127.0.0.1'

  let allowed = tool.isFree
  let trialExpired = false

  if (!tool.isFree) {
    // Check trial limit
    const log = await prisma.toolUsageLog.findFirst({
      where: { toolId: tool.id, ipAddress: ip }
    })

    if (!log) {
      // Trial never started, allowed for now but will need to call /api/tools/trial
      allowed = true
    } else {
      const daysSinceTrial = Math.floor((Date.now() - log.usedAt.getTime()) / (1000 * 60 * 60 * 24))
      if (daysSinceTrial >= tool.trialDays) {
        allowed = false
        trialExpired = true
      } else {
        allowed = true
      }
    }
  }

  // Build the sandboxed HTML content
  const srcDoc = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${tool.name}</title>
      <script src="https://cdn.tailwindcss.com"></script>
      <style>
        body { font-family: system-ui, sans-serif; padding: 20px; background: transparent; }
        ${tool.cssCode || ''}
      </style>
    </head>
    <body>
      ${tool.htmlCode || '<div class="text-center p-10 text-gray-500">No UI configured for this tool yet.</div>'}
      
      <script>
        ${tool.jsCode || ''}
      </script>
    </body>
    </html>
  `

  return (
    <div className="container max-w-4xl py-10 space-y-6">
      <div className="flex items-center justify-between border-b pb-4">
        <div>
          <h1 className="text-3xl font-bold">{tool.name}</h1>
          <p className="text-muted-foreground mt-1">{tool.description}</p>
        </div>
        <Button variant="outline" asChild>
          <Link href="/tools">Back to Tools</Link>
        </Button>
      </div>

      {!allowed ? (
        <Card className="border-red-200 bg-red-50/50">
          <CardContent className="flex flex-col items-center justify-center p-12 text-center space-y-4">
            <div className="h-16 w-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center">
              <Lock className="h-8 w-8" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800">Premium Access Required</h2>
            <p className="text-muted-foreground max-w-md">
              {trialExpired 
                ? `Your ${tool.trialDays}-day free trial has expired for this IP address. To continue using ${tool.name}, please activate premium access.` 
                : `This is a premium tool. Please activate it to continue.`}
            </p>
            <Button size="lg" className="mt-4 bg-orange-600 hover:bg-orange-700">
              Activate for ₹{Number(tool.price)}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {!tool.isFree && (
             <Alert className="bg-yellow-50 border-yellow-200">
               <AlertCircle className="h-4 w-4 text-yellow-600" />
               <AlertTitle className="text-yellow-800">Trial Mode Active</AlertTitle>
               <AlertDescription className="text-yellow-700 text-xs mt-1">
                 You are using a limited-time trial associated with your IP address. It will expire {tool.trialDays} days after first use.
               </AlertDescription>
             </Alert>
          )}
          <div className="w-full bg-white border rounded-xl shadow-sm min-h-[600px] overflow-hidden">
            <iframe 
              srcDoc={srcDoc}
              className="w-full h-full min-h-[600px] border-0"
              sandbox="allow-scripts allow-forms allow-same-origin"
              title={tool.name}
            />
          </div>
        </div>
      )}
    </div>
  )
}
