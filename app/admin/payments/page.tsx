'use client'

import { useEffect, useState } from 'react'
import { PageHeader } from '@/components/admin/page-header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'

export default function PaymentsPage() {
  const [loading, setLoading] = useState(true)
  const [savingKey, setSavingKey] = useState<string | null>(null)

  // Razorpay Settings State
  const [keyId, setKeyId] = useState('')
  const [keySecret, setKeySecret] = useState('')
  const [webhookSecret, setWebhookSecret] = useState('')

  // Taxes & Currency State
  const [currency, setCurrency] = useState('INR')
  const [gst, setGst] = useState('18')
  const [refundWindow, setRefundWindow] = useState('7')

  // Load configuration on mount
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true)
        const res = await fetch('/api/admin/settings?group=payment')
        const data = await res.json()
        if (data.ok && data.config) {
          const cfg = data.config
          setKeyId(cfg.razorpay_key_id || '')
          setKeySecret(cfg.razorpay_key_secret || '')
          setWebhookSecret(cfg.razorpay_webhook_secret || '')
          setCurrency(cfg.default_currency || 'INR')
          setGst(String(cfg.gst_percent ?? '18'))
          setRefundWindow(String(cfg.refund_window_days ?? '7'))
        }
      } catch (err) {
        console.error('Failed to load payment settings:', err)
        toast.error('Failed to load payment configuration')
      } finally {
        setLoading(false)
      }
    }

    fetchSettings()
  }, [])

  // Save specific settings helper
  const handleSaveSetting = async (key: string, value: any, label: string) => {
    try {
      setSavingKey(key)
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key, value, group: 'payment' })
      })
      const data = await res.json()
      if (data.ok) {
        toast.success(`${label} updated successfully`)
      } else {
        toast.error(data.error || 'Failed to update setting')
      }
    } catch (err) {
      toast.error('Network error saving setting')
    } finally {
      setSavingKey(null)
    }
  }

  const saveRazorpay = async () => {
    await handleSaveSetting('razorpay_key_id', keyId, 'Razorpay Key ID')
    await handleSaveSetting('razorpay_key_secret', keySecret, 'Razorpay Secret Key')
    await handleSaveSetting('razorpay_webhook_secret', webhookSecret, 'Razorpay Webhook Secret')
  }

  const saveTaxesAndCurrency = async () => {
    await handleSaveSetting('default_currency', currency, 'Default Currency')
    await handleSaveSetting('gst_percent', Number(gst), 'GST Percentage')
    await handleSaveSetting('refund_window_days', Number(refundWindow), 'Refund Window')
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] gap-2">
        <Loader2 className="h-8 w-8 text-amber-500 animate-spin" />
        <p className="text-sm text-muted-foreground">Loading payment configurations…</p>
      </div>
    )
  }

  const isRazorpayConnected = !!keyId && !!keySecret

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Payment Gateways & Taxes" 
        description="Configure Razorpay merchant keys, tax percentages, webhook validations, and refund workflows."
        breadcrumbs={[{ label: 'Admin', href: '/admin' }, { label: 'Payments' }]} 
      />

      <div className="grid gap-6 md:grid-cols-2">
        {/* Razorpay Setup Card */}
        <Card className="border border-border/60 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-base font-bold">Razorpay Integration</CardTitle>
            <Badge variant={isRazorpayConnected ? 'default' : 'secondary'} className={isRazorpayConnected ? 'bg-emerald-500 hover:bg-emerald-600' : ''}>
              {isRazorpayConnected ? 'CONNECTED' : 'NOT CONNECTED'}
            </Badge>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="key-id">Key ID</Label>
              <Input 
                id="key-id" 
                placeholder="rzp_live_..." 
                value={keyId} 
                onChange={(e) => setKeyId(e.target.value)} 
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="key-secret">Key Secret</Label>
              <Input 
                id="key-secret" 
                type="password" 
                placeholder="••••••••••••••••••••••••" 
                value={keySecret} 
                onChange={(e) => setKeySecret(e.target.value)} 
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="webhook-sec">Webhook Secret</Label>
              <Input 
                id="webhook-sec" 
                type="password" 
                placeholder="Webhook validation key" 
                value={webhookSecret} 
                onChange={(e) => setWebhookSecret(e.target.value)} 
              />
            </div>
            <Button 
              className="w-full bg-amber-500 hover:bg-amber-600 font-semibold"
              onClick={saveRazorpay}
              disabled={savingKey !== null}
            >
              {savingKey === 'razorpay_key_id' ? 'Saving…' : 'Save Razorpay Credentials'}
            </Button>
          </CardContent>
        </Card>

        {/* Taxes and Currency Card */}
        <Card className="border border-border/60 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-bold font-sans">Taxes & Currency Rules</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="def-curr">Default Currency</Label>
              <Input 
                id="def-curr" 
                value={currency} 
                onChange={(e) => setCurrency(e.target.value.toUpperCase())} 
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="gst-pct">GST / Service Tax Percentage (%)</Label>
              <Input 
                id="gst-pct" 
                type="number" 
                value={gst} 
                onChange={(e) => setGst(e.target.value)} 
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="ref-window">Refund Request Window (Days)</Label>
              <Input 
                id="ref-window" 
                type="number" 
                value={refundWindow} 
                onChange={(e) => setRefundWindow(e.target.value)} 
              />
            </div>
            <Button 
              className="w-full bg-amber-500 hover:bg-amber-600 font-semibold"
              onClick={saveTaxesAndCurrency}
              disabled={savingKey !== null}
            >
              {savingKey === 'default_currency' ? 'Saving…' : 'Save Rules & Settings'}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
