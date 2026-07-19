'use client'

import { useState, useEffect } from 'react'
import { PageHeader } from '@/components/admin/page-header'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Loader2, CheckCircle2, XCircle, AlertTriangle, Key, Info } from 'lucide-react'
import { toast } from 'sonner'

export default function SettingsPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [diagnosing, setDiagnosing] = useState(false)
  const [settings, setSettings] = useState<Record<string, any>>({})
  const [status, setStatus] = useState<Record<string, any>>({})
  const [activeTab, setActiveTab] = useState('general')

  // Form states
  const [siteName, setSiteName] = useState('Devyajnam')
  const [siteTagline, setSiteTagline] = useState('Sanatan Seva Online')
  const [logoUrl, setLogoUrl] = useState('')
  const [email, setEmail] = useState('seva@devyajnam.com')
  const [phone, setPhone] = useState('+91-99999-99999')
  const [whatsapp, setWhatsapp] = useState('+91-99999-99999')
  const [address, setAddress] = useState('')
  const [googleMapUrl, setGoogleMapUrl] = useState('')
  const [primaryColor, setPrimaryColor] = useState('#FF8C21')
  const [accentColor, setAccentColor] = useState('#B12D2D')
  const [secondaryColor, setSecondaryColor] = useState('#F0B429')
  const [bgColor, setBgColor] = useState('#fff9f2')
  const [maintenanceMode, setMaintenanceMode] = useState(false)
  const [maintenanceMsg, setMaintenanceMsg] = useState('We’ll be back soon…')

  // Secrets states
  const [supabaseUrl, setSupabaseUrl] = useState('')
  const [supabaseAnonKey, setSupabaseAnonKey] = useState('')
  const [supabaseServiceRole, setSupabaseServiceRole] = useState('')
  const [openaiApiKey, setOpenaiApiKey] = useState('')
  const [razorpayKeyId, setRazorpayKeyId] = useState('')
  const [razorpayKeySecret, setRazorpayKeySecret] = useState('')
  const [dbUrl, setDbUrl] = useState('')
  const [directUrlSetting, setDirectUrlSetting] = useState('')

  const [uploadingLogo, setUploadingLogo] = useState(false)

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadingLogo(true)
    const formData = new FormData()
    formData.append('file', file)
    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })
      const data = await res.json()
      if (data.ok) {
        setLogoUrl(data.url)
        toast.success('Logo uploaded!')
      } else {
        toast.error(data.error || 'Upload failed')
      }
    } catch {
      toast.error('Network error uploading logo')
    } finally {
      setUploadingLogo(false)
    }
  }

  const loadSettings = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/settings')
      const data = await res.json()
      if (data.ok) {
        const s = data.data.settings
        setSettings(s)
        setStatus(data.data.status || {})

        // Populate fields
        if (s['site.name']) setSiteName(s['site.name'])
        if (s['site.tagline']) setSiteTagline(s['site.tagline'])
        if (s['site.logo']) setLogoUrl(s['site.logo'])
        if (s['contact.email']) setEmail(s['contact.email'])
        if (s['contact.phone']) setPhone(s['contact.phone'])
        if (s['contact.whatsapp']) setWhatsapp(s['contact.whatsapp'])
        if (s['contact.address']) setAddress(s['contact.address'])
        if (s['contact.google_map_url']) setGoogleMapUrl(s['contact.google_map_url'])
        if (s['theme.primary']) setPrimaryColor(s['theme.primary'])
        if (s['theme.accent']) setAccentColor(s['theme.accent'])
        if (s['theme.secondary']) setSecondaryColor(s['theme.secondary'])
        if (s['theme.background']) setBgColor(s['theme.background'])
        if (s['maintenance.enabled'] !== undefined) setMaintenanceMode(!!s['maintenance.enabled'])
        if (s['maintenance.message']) setMaintenanceMsg(s['maintenance.message'])

        // Secrets
        if (s['secret.supabase_url']) setSupabaseUrl(s['secret.supabase_url'])
        if (s['secret.supabase_anon_key']) setSupabaseAnonKey(s['secret.supabase_anon_key'])
        if (s['secret.supabase_service_role_key']) setSupabaseServiceRole(s['secret.supabase_service_role_key'])
        if (s['secret.openai_api_key']) setOpenaiApiKey(s['secret.openai_api_key'])
        if (s['secret.razorpay_key_id']) setRazorpayKeyId(s['secret.razorpay_key_id'])
        if (s['secret.razorpay_key_secret']) setRazorpayKeySecret(s['secret.razorpay_key_secret'])
        if (s['secret.database_url']) setDbUrl(s['secret.database_url'])
        if (s['secret.direct_url']) setDirectUrlSetting(s['secret.direct_url'])
      } else {
        toast.error('Failed to load settings: ' + data.error)
      }
    } catch (e: any) {
      toast.error('Error loading settings')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadSettings()
  }, [])

  const handleSave = async (group: string) => {
    setSaving(true)
    let payload: Record<string, any> = {}

    if (group === 'general') {
      payload = {
        'site.name': siteName,
        'site.tagline': siteTagline,
        'site.logo': logoUrl,
        'maintenance.enabled': maintenanceMode,
        'maintenance.message': maintenanceMsg,
      }
    } else if (group === 'contact') {
      payload = {
        'contact.email': email,
        'contact.phone': phone,
        'contact.whatsapp': whatsapp,
        'contact.address': address,
        'contact.google_map_url': googleMapUrl,
      }
    } else if (group === 'theme') {
      payload = {
        'theme.primary': primaryColor,
        'theme.accent': accentColor,
        'theme.secondary': secondaryColor,
        'theme.background': bgColor,
      }
    } else if (group === 'secrets') {
      payload = {
        'secret.supabase_url': supabaseUrl,
        'secret.supabase_anon_key': supabaseAnonKey,
        'secret.supabase_service_role_key': supabaseServiceRole,
        'secret.openai_api_key': openaiApiKey,
        'secret.razorpay_key_id': razorpayKeyId,
        'secret.razorpay_key_secret': razorpayKeySecret,
        'secret.database_url': dbUrl,
        'secret.direct_url': directUrlSetting,
      }
    }

    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings: payload })
      })
      const data = await res.json()
      if (data.ok) {
        toast.success('Settings saved successfully!')
        // Reload settings & trigger integration diagnostic check
        await loadSettings()
      } else {
        toast.error('Error: ' + data.error)
      }
    } catch (e) {
      toast.error('Network error saving settings')
    } finally {
      setSaving(false)
    }
  }

  const runDiagnostics = async () => {
    setDiagnosing(true)
    toast.info('Running connectivity diagnostics...')
    await loadSettings()
    setDiagnosing(false)
    toast.success('Diagnostics completed!')
  }

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Website Settings"
        description="Configure keys, secrets, branding, and check deployment health."
        breadcrumbs={[{ label: 'Admin', href: '/admin' }, { label: 'Settings' }]}
      />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 lg:w-[600px]">
          <TabsTrigger value="general">Branding & General</TabsTrigger>
          <TabsTrigger value="contact">Contact Details</TabsTrigger>
          <TabsTrigger value="secrets">Secrets & API Keys</TabsTrigger>
          <TabsTrigger value="status">System Status</TabsTrigger>
        </TabsList>

        {/* GENERAL TAB */}
        <TabsContent value="general" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Brand Identity</CardTitle>
                <CardDescription>Configure primary logo, site tagline, and site name.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Site Name</Label>
                  <Input value={siteName} onChange={(e) => setSiteName(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Tagline</Label>
                  <Input value={siteTagline} onChange={(e) => setSiteTagline(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Website Logo</Label>
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full border bg-slate-100 flex items-center justify-center overflow-hidden shrink-0">
                      {logoUrl ? (
                        <img src={logoUrl} alt="Logo" className="h-full w-full object-contain" />
                      ) : (
                        <span className="text-xl font-bold">ॐ</span>
                      )}
                    </div>
                    <div className="flex-grow flex gap-2">
                      <Input value={logoUrl} onChange={(e) => setLogoUrl(e.target.value)} placeholder="Paste Logo Image URL or upload" />
                      <label className="cursor-pointer inline-flex items-center justify-center rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground px-3 py-2 text-sm font-medium shrink-0">
                        {uploadingLogo ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          'Upload'
                        )}
                        {/* <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleLogoUpload}
                          disabled={uploadingLogo}
                        /> - Disabled for Vercel */}
                      </label>
                    </div>
                  </div>
                </div>
                <Button onClick={() => handleSave('general')} disabled={saving}>
                  {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Save General Settings
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Maintenance Mode</CardTitle>
                <CardDescription>Temporarily disable public access with a custom splash screen.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="m-mode">Enable Maintenance Mode</Label>
                  <Switch id="m-mode" checked={maintenanceMode} onCheckedChange={setMaintenanceMode} />
                </div>
                <div className="space-y-2">
                  <Label>Message</Label>
                  <Input value={maintenanceMsg} onChange={(e) => setMaintenanceMsg(e.target.value)} />
                </div>
                <Button onClick={() => handleSave('general')} disabled={saving} variant="outline">
                  Save Maintenance Config
                </Button>
              </CardContent>
            </Card>

            <Card className="md:col-span-2 lg:col-span-1">
              <CardHeader>
                <CardTitle>Website Theme & Background</CardTitle>
                <CardDescription>Customize branding colors and background color for the entire website.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Primary Color (Saffron)</Label>
                  <div className="flex gap-2">
                    <Input type="color" value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)} className="w-12 h-10 p-1 cursor-pointer border rounded" />
                    <Input value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)} placeholder="#FF8C21" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Accent Color (Sindoor Red)</Label>
                  <div className="flex gap-2">
                    <Input type="color" value={accentColor} onChange={(e) => setAccentColor(e.target.value)} className="w-12 h-10 p-1 cursor-pointer border rounded" />
                    <Input value={accentColor} onChange={(e) => setAccentColor(e.target.value)} placeholder="#B12D2D" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Secondary Color (Gold)</Label>
                  <div className="flex gap-2">
                    <Input type="color" value={secondaryColor} onChange={(e) => setSecondaryColor(e.target.value)} className="w-12 h-10 p-1 cursor-pointer border rounded" />
                    <Input value={secondaryColor} onChange={(e) => setSecondaryColor(e.target.value)} placeholder="#F0B429" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Website Background Color</Label>
                  <div className="flex gap-2">
                    <Input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="w-12 h-10 p-1 cursor-pointer border rounded" />
                    <Input value={bgColor} onChange={(e) => setBgColor(e.target.value)} placeholder="#fff9f2" />
                  </div>
                </div>
                <Button onClick={() => handleSave('theme')} disabled={saving}>
                  {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Save Theme Colors
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* CONTACT TAB */}
        <TabsContent value="contact" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Contact Details</CardTitle>
              <CardDescription>Information shown in header, footer, and help menus.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 max-w-xl">
              <div className="space-y-2">
                <Label>Support Email</Label>
                <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Phone Number</Label>
                <Input value={phone} onChange={(e) => setPhone(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>WhatsApp Number</Label>
                <Input value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Office Address</Label>
                <Input value={address} onChange={(e) => setAddress(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Google Map Embed URL (iframe Src)</Label>
                <Input value={googleMapUrl} onChange={(e) => setGoogleMapUrl(e.target.value)} placeholder="https://www.google.com/maps/embed?..." />
              </div>
              <Button onClick={() => handleSave('contact')} disabled={saving}>
                {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Contact Details
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* SECRETS & KEYS TAB */}
        <TabsContent value="secrets" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="h-5 w-5 text-orange-500" />
                Secrets & Credentials Manager
              </CardTitle>
              <CardDescription>
                Store keys securely in the database to avoid hardcoding or failing builds during Vercel deployment.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Alert className="bg-orange-50 border-orange-200">
                <Info className="h-4 w-4 text-orange-600" />
                <AlertTitle className="text-orange-800 font-semibold">Important Deployment Note</AlertTitle>
                <AlertDescription className="text-orange-700 text-sm">
                  Keys saved here will override environment variables at runtime on Vercel. 
                  This makes it easy to repair config errors without redeploying or triggering new build pipelines.
                </AlertDescription>
              </Alert>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4 border p-4 rounded-lg bg-slate-50/50">
                  <h3 className="font-semibold text-lg border-b pb-2 flex items-center justify-between">
                    Supabase Configuration
                    <Badge variant="outline">Auth & Storage</Badge>
                  </h3>
                  <div className="space-y-2">
                    <Label>Supabase URL</Label>
                    <Input 
                      placeholder="https://xxx.supabase.co" 
                      value={supabaseUrl} 
                      onChange={(e) => setSupabaseUrl(e.target.value)} 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Supabase Anon Key</Label>
                    <Input 
                      type="password" 
                      placeholder="eyJhbGc..." 
                      value={supabaseAnonKey} 
                      onChange={(e) => setSupabaseAnonKey(e.target.value)} 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Supabase Service Role Key</Label>
                    <Input 
                      type="password" 
                      placeholder="Service key (used for server-side queries)..." 
                      value={supabaseServiceRole} 
                      onChange={(e) => setSupabaseServiceRole(e.target.value)} 
                    />
                  </div>
                </div>

                <div className="space-y-4 border p-4 rounded-lg bg-slate-50/50">
                  <h3 className="font-semibold text-lg border-b pb-2 flex items-center justify-between">
                    Razorpay Gateway
                    <Badge variant="outline">Payments</Badge>
                  </h3>
                  <div className="space-y-2">
                    <Label>Razorpay Key ID</Label>
                    <Input 
                      placeholder="rzp_live_xxx / rzp_test_xxx" 
                      value={razorpayKeyId} 
                      onChange={(e) => setRazorpayKeyId(e.target.value)} 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Razorpay Key Secret</Label>
                    <Input 
                      type="password" 
                      placeholder="Key Secret..." 
                      value={razorpayKeySecret} 
                      onChange={(e) => setRazorpayKeySecret(e.target.value)} 
                    />
                  </div>

                  <h3 className="font-semibold text-lg border-b pb-2 pt-2 flex items-center justify-between">
                    OpenAI Integration
                    <Badge variant="outline">AI Pandit Chat</Badge>
                  </h3>
                  <div className="space-y-2">
                    <Label>OpenAI API Key</Label>
                    <Input 
                      type="password" 
                      placeholder="sk-proj-..." 
                      value={openaiApiKey} 
                      onChange={(e) => setOpenaiApiKey(e.target.value)} 
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4 border p-4 rounded-lg bg-slate-50/50">
                <h3 className="font-semibold text-lg border-b pb-2 flex items-center justify-between">
                  Database Connections (PostgreSQL)
                  <Badge variant="outline">Prisma URL</Badge>
                </h3>
                <div className="space-y-2">
                  <Label>Database connection URL (DATABASE_URL)</Label>
                  <Input 
                    placeholder="postgresql://username:password@host:port/database" 
                    value={dbUrl} 
                    onChange={(e) => setDbUrl(e.target.value)} 
                  />
                </div>
                <div className="space-y-2">
                  <Label>Direct connection URL (DIRECT_URL)</Label>
                  <Input 
                    placeholder="postgresql://username:password@host:port/database" 
                    value={directUrlSetting} 
                    onChange={(e) => setDirectUrlSetting(e.target.value)} 
                  />
                </div>
              </div>

              <div className="flex gap-4 border-t pt-4">
                <Button onClick={() => handleSave('secrets')} disabled={saving}>
                  {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Save Secret Keys
                </Button>
                <Button variant="outline" onClick={runDiagnostics} disabled={diagnosing}>
                  {diagnosing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Save & Validate Connections
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* SYSTEM STATUS TAB */}
        <TabsContent value="status" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <div>
                <CardTitle>Integrations Diagnostics</CardTitle>
                <CardDescription>Real-time health status of database, Supabase, and third-party APIs.</CardDescription>
              </div>
              <Button size="sm" onClick={runDiagnostics} disabled={diagnosing}>
                {diagnosing ? 'Running...' : 'Run Live Diagnostic'}
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                {/* Database Card */}
                <div className={`p-4 border rounded-lg flex items-start gap-3 bg-white shadow-sm ${status.database?.healthy ? 'border-green-200' : 'border-red-200'}`}>
                  {status.database?.healthy ? (
                    <CheckCircle2 className="h-6 w-6 text-green-500 shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="h-6 w-6 text-red-500 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <h4 className="font-semibold flex items-center gap-2">
                      Database Connection
                      <Badge variant={status.database?.healthy ? 'success' : 'destructive'} className={status.database?.healthy ? 'bg-green-100 text-green-800' : ''}>
                        {status.database?.healthy ? 'Healthy' : 'Disconnected'}
                      </Badge>
                    </h4>
                    <p className="text-sm text-slate-600 mt-1">{status.database?.details}</p>
                  </div>
                </div>

                {/* Supabase Card */}
                <div className={`p-4 border rounded-lg flex items-start gap-3 bg-white shadow-sm ${status.supabase?.healthy ? 'border-green-200' : (status.supabase?.configured ? 'border-red-200' : 'border-slate-200')}`}>
                  {status.supabase?.healthy ? (
                    <CheckCircle2 className="h-6 w-6 text-green-500 shrink-0 mt-0.5" />
                  ) : status.supabase?.configured ? (
                    <XCircle className="h-6 w-6 text-red-500 shrink-0 mt-0.5" />
                  ) : (
                    <AlertTriangle className="h-6 w-6 text-amber-500 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <h4 className="font-semibold flex items-center gap-2">
                      Supabase SDK
                      <Badge variant={status.supabase?.healthy ? 'success' : 'destructive'} className={status.supabase?.healthy ? 'bg-green-100 text-green-800' : ''}>
                        {status.supabase?.healthy ? 'Active' : (status.supabase?.configured ? 'Error' : 'Missing')}
                      </Badge>
                    </h4>
                    <p className="text-sm text-slate-600 mt-1">{status.supabase?.details}</p>
                  </div>
                </div>

                {/* Razorpay Card */}
                <div className={`p-4 border rounded-lg flex items-start gap-3 bg-white shadow-sm ${status.razorpay?.healthy ? 'border-green-200' : (status.razorpay?.configured ? 'border-red-200' : 'border-slate-200')}`}>
                  {status.razorpay?.healthy ? (
                    <CheckCircle2 className="h-6 w-6 text-green-500 shrink-0 mt-0.5" />
                  ) : status.razorpay?.configured ? (
                    <XCircle className="h-6 w-6 text-red-500 shrink-0 mt-0.5" />
                  ) : (
                    <AlertTriangle className="h-6 w-6 text-amber-500 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <h4 className="font-semibold flex items-center gap-2">
                      Razorpay Gateway
                      <Badge variant={status.razorpay?.healthy ? 'success' : 'destructive'} className={status.razorpay?.healthy ? 'bg-green-100 text-green-800' : ''}>
                        {status.razorpay?.healthy ? 'Active' : (status.razorpay?.configured ? 'Failed' : 'Not Configured')}
                      </Badge>
                    </h4>
                    <p className="text-sm text-slate-600 mt-1">{status.razorpay?.details}</p>
                  </div>
                </div>

                {/* OpenAI Card */}
                <div className={`p-4 border rounded-lg flex items-start gap-3 bg-white shadow-sm ${status.openai?.healthy ? 'border-green-200' : (status.openai?.configured ? 'border-red-200' : 'border-slate-200')}`}>
                  {status.openai?.healthy ? (
                    <CheckCircle2 className="h-6 w-6 text-green-500 shrink-0 mt-0.5" />
                  ) : status.openai?.configured ? (
                    <XCircle className="h-6 w-6 text-red-500 shrink-0 mt-0.5" />
                  ) : (
                    <AlertTriangle className="h-6 w-6 text-amber-500 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <h4 className="font-semibold flex items-center gap-2">
                      OpenAI Chat
                      <Badge variant={status.openai?.healthy ? 'success' : 'destructive'} className={status.openai?.healthy ? 'bg-green-100 text-green-800' : ''}>
                        {status.openai?.healthy ? 'Active' : (status.openai?.configured ? 'Error' : 'Not Configured')}
                      </Badge>
                    </h4>
                    <p className="text-sm text-slate-600 mt-1">{status.openai?.details}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
