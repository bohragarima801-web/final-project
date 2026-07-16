'use client'

import { useEffect, useState } from 'react'
import { PageHeader } from '@/components/admin/page-header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'

export default function SettingsPage() {
  const [loading, setLoading] = useState(true)
  const [savingKey, setSavingKey] = useState<string | null>(null)

  // Brand identity
  const [siteName, setSiteName] = useState('Devyajnam')
  const [tagline, setTagline] = useState('Sanatan Seva Online')

  // Contact info
  const [email, setEmail] = useState('seva@devyajnam.com')
  const [phone, setPhone] = useState('+91-99999-99999')
  const [whatsapp, setWhatsapp] = useState('+91-99999-99999')
  const [address, setAddress] = useState('Varanasi, Uttar Pradesh, India')

  // Theme colors
  const [colorPrimary, setColorPrimary] = useState('#FF8C21')
  const [colorAccent, setColorAccent] = useState('#B12D2D')
  const [colorSecondary, setColorSecondary] = useState('#F0B429')

  // Maintenance mode
  const [maintenanceMode, setMaintenanceMode] = useState(false)
  const [maintenanceMsg, setMaintenanceMsg] = useState('We will be back soon…')

  // Load configuration on mount
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true)
        const res = await fetch('/api/admin/settings?group=general')
        const data = await res.json()
        if (data.ok && data.config) {
          const cfg = data.config
          setSiteName(cfg.site_name || 'Devyajnam')
          setTagline(cfg.site_tagline || 'Sanatan Seva Online')
          setEmail(cfg.contact_email || 'seva@devyajnam.com')
          setPhone(cfg.contact_phone || '+91-99999-99999')
          setWhatsapp(cfg.contact_whatsapp || '+91-99999-99999')
          setAddress(cfg.contact_address || 'Varanasi, Uttar Pradesh, India')
          setColorPrimary(cfg.theme_color_primary || '#FF8C21')
          setColorAccent(cfg.theme_color_accent || '#B12D2D')
          setColorSecondary(cfg.theme_color_secondary || '#F0B429')
          setMaintenanceMode(!!cfg.maintenance_mode)
          setMaintenanceMsg(cfg.maintenance_message || 'We will be back soon…')
        }
      } catch (err) {
        console.error('Failed to load general settings:', err)
        toast.error('Failed to load global configurations')
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
        body: JSON.stringify({ key, value, group: 'general' })
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

  const saveIdentity = async () => {
    await handleSaveSetting('site_name', siteName, 'Website Name')
    await handleSaveSetting('site_tagline', tagline, 'Brand Tagline')
  }

  const saveContact = async () => {
    await handleSaveSetting('contact_email', email, 'Contact Email')
    await handleSaveSetting('contact_phone', phone, 'Contact Phone')
    await handleSaveSetting('contact_whatsapp', whatsapp, 'WhatsApp Contact')
    await handleSaveSetting('contact_address', address, 'Physical Address')
  }

  const saveTheme = async () => {
    await handleSaveSetting('theme_color_primary', colorPrimary, 'Primary Theme Color')
    await handleSaveSetting('theme_color_accent', colorAccent, 'Accent Theme Color')
    await handleSaveSetting('theme_color_secondary', colorSecondary, 'Secondary Theme Color')
  }

  const saveMaintenance = async () => {
    await handleSaveSetting('maintenance_mode', maintenanceMode, 'Maintenance Mode')
    await handleSaveSetting('maintenance_message', maintenanceMsg, 'Maintenance Message')
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] gap-2">
        <Loader2 className="h-8 w-8 text-amber-500 animate-spin" />
        <p className="text-sm text-muted-foreground">Loading configurations…</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Website Settings" 
        description="Global system parameters, identity layouts, theme styles, support touchpoints, and server state options."
        breadcrumbs={[{ label: 'Admin', href: '/admin' }, { label: 'Settings' }]} 
      />

      <div className="grid gap-6 md:grid-cols-2">
        {/* Brand Identity Card */}
        <Card className="border border-border/60 shadow-sm">
          <CardHeader className="pb-3"><CardTitle className="text-base font-bold">Brand Identity</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="site-nm">Site Name</Label>
              <Input id="site-nm" value={siteName} onChange={(e) => setSiteName(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="tagline-val">Tagline</Label>
              <Input id="tagline-val" value={tagline} onChange={(e) => setTagline(e.target.value)} />
            </div>
            <Button 
              className="w-full bg-amber-500 hover:bg-amber-600 font-semibold"
              onClick={saveIdentity}
              disabled={savingKey !== null}
            >
              {savingKey === 'site_name' ? 'Saving…' : 'Save Brand Identity'}
            </Button>
          </CardContent>
        </Card>

        {/* Contact Details Card */}
        <Card className="border border-border/60 shadow-sm">
          <CardHeader className="pb-3"><CardTitle className="text-base font-bold">Contact Details</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="em-val">Email Address</Label>
              <Input id="em-val" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="ph-val">Phone Number</Label>
              <Input id="ph-val" value={phone} onChange={(e) => setPhone(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="wa-val">WhatsApp Number</Label>
              <Input id="wa-val" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="addr-val">Physical Address</Label>
              <Input id="addr-val" value={address} onChange={(e) => setAddress(e.target.value)} />
            </div>
            <Button 
              className="w-full bg-amber-500 hover:bg-amber-600 font-semibold"
              onClick={saveContact}
              disabled={savingKey !== null}
            >
              {savingKey === 'contact_email' ? 'Saving…' : 'Save Contact Details'}
            </Button>
          </CardContent>
        </Card>

        {/* Theme Colors Card */}
        <Card className="border border-border/60 shadow-sm">
          <CardHeader className="pb-3"><CardTitle className="text-base font-bold">Theme Styling</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="prim-c">Primary Saffron</Label>
                <Input id="prim-c" type="color" className="h-10 cursor-pointer p-1" value={colorPrimary} onChange={(e) => setColorPrimary(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="acc-c">Accent Sindoor</Label>
                <Input id="acc-c" type="color" className="h-10 cursor-pointer p-1" value={colorAccent} onChange={(e) => setColorAccent(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="sec-c">Secondary Gold</Label>
                <Input id="sec-c" type="color" className="h-10 cursor-pointer p-1" value={colorSecondary} onChange={(e) => setColorSecondary(e.target.value)} />
              </div>
            </div>
            <Button 
              className="w-full bg-amber-500 hover:bg-amber-600 font-semibold"
              onClick={saveTheme}
              disabled={savingKey !== null}
            >
              {savingKey === 'theme_color_primary' ? 'Saving…' : 'Save Theme Colors'}
            </Button>
          </CardContent>
        </Card>

        {/* Maintenance Mode Card */}
        <Card className="border border-border/60 shadow-sm">
          <CardHeader className="pb-3"><CardTitle className="text-base font-bold">Maintenance Mode</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between py-2 border-b border-border/50">
              <div className="space-y-0.5">
                <Label htmlFor="maint-mode">Enable Offline Mode</Label>
                <p className="text-xs text-muted-foreground">Redirect public traffic to a holding placeholder.</p>
              </div>
              <Switch id="maint-mode" checked={maintenanceMode} onCheckedChange={setMaintenanceMode} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="maint-msg">Maintenance Message</Label>
              <Input id="maint-msg" value={maintenanceMsg} onChange={(e) => setMaintenanceMsg(e.target.value)} placeholder="Holding screen text…" />
            </div>
            <Button 
              className="w-full bg-amber-500 hover:bg-amber-600 font-semibold"
              onClick={saveMaintenance}
              disabled={savingKey !== null}
            >
              {savingKey === 'maintenance_mode' ? 'Saving…' : 'Save Status & Message'}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
