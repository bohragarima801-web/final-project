'use client'

import { useState } from 'react'
import { PageHeader } from '@/components/admin/page-header'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { Loader2, Send, FileSpreadsheet, Download, CheckCircle2 } from 'lucide-react'

export default function NotificationsPage() {
  const [message, setMessage] = useState('')
  const [sending, setSending] = useState(false)
  const [csvFile, setCsvFile] = useState<File | null>(null)
  const [result, setResult] = useState<string | null>(null)

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) {
      setCsvFile(file)
      toast.success(`CSV file selected: ${file.name}`)
    }
  }

  async function handleBulkSend(e: React.FormEvent) {
    e.preventDefault()
    if (!csvFile) {
      toast.error('Please upload a CSV file first')
      return
    }

    setSending(true)
    setResult(null)

    const formData = new FormData()
    formData.append('file', csvFile)
    formData.append('message', message)

    try {
      const res = await fetch('/api/admin/notifications/csv', {
        method: 'POST',
        body: formData,
      })
      const data = await res.json()
      if (data.ok) {
        toast.success('Bulk notifications sent successfully!')
        setResult(data.message)
        setCsvFile(null)
        setMessage('')
      } else {
        toast.error(data.error || 'Failed to dispatch notifications')
      }
    } catch {
      toast.error('Network error uploading CSV')
    } finally {
      setSending(false)
    }
  }

  function downloadSampleCSV() {
    const csvContent = 'data:text/csv;charset=utf-8,name,email,phone,message\nRahul Sharma,rahul@example.com,+919999999999,Jai Shri Ram {name}! Your Somwar Puja starts in 1 hour.\nAnjali Verma,anjali@example.com,+918888888888,Namaste {name}! Receive your prasad updates here.'
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', 'devyajnam_notification_sample.csv')
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    toast.success('Sample CSV downloaded!')
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Spiritual Notification Center"
        description="Broadcast notifications globally or run target marketing lists using bulk CSV imports."
        breadcrumbs={[{ label: 'Admin', href: '/admin' }, { label: 'Notifications' }]}
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-2 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileSpreadsheet className="h-5 w-5 text-primary" /> Bulk Send via CSV Upload
            </CardTitle>
            <CardDescription>
              Upload a contact sheet to send customized alerts via WhatsApp, SMS, and Email in one click.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleBulkSend} className="space-y-4">
              <div className="space-y-2">
                <Label>1. Download Sample Layout</Label>
                <div>
                  <Button type="button" variant="outline" size="sm" onClick={downloadSampleCSV} className="gap-1.5">
                    <Download className="h-4 w-4" /> Download Sample CSV
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="csvFile">2. Upload Contact CSV File</Label>
                <Input
                  id="csvFile"
                  type="file"
                  accept=".csv"
                  onChange={handleFileChange}
                  className="cursor-pointer"
                  required
                />
                <p className="text-[10px] text-muted-foreground">Required columns: name, email, phone, message</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">3. Default Template Message (Fallback)</Label>
                <Textarea
                  id="message"
                  placeholder="Use variables like {name} in the message text. This message will be sent if the CSV row does not contain a custom message."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={4}
                />
              </div>

              <Button type="submit" disabled={sending} className="w-full">
                {sending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending alerts…
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" /> Dispatch Bulk Notifications
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Dispatch Logs & Console Reports</CardTitle>
            <CardDescription>View live results and delivery confirmations below.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {result ? (
              <div className="p-4 rounded-lg bg-green-50 border border-green-200 text-green-800 text-sm flex gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold">Dispatch Complete</h4>
                  <p className="mt-1">{result}</p>
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No bulk uploads processed in this session.</p>
            )}

            <div className="p-3 bg-muted rounded-md text-xs font-mono border">
              <span className="text-muted-foreground font-semibold">// How template variables work:</span>
              <ul className="mt-1 space-y-1 list-disc pl-4 text-slate-700">
                <li>{"{name}"} - replaced with devotee name</li>
                <li>{"{email}"} - replaced with contact email</li>
                <li>{"{phone}"} - replaced with WhatsApp/mobile</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
