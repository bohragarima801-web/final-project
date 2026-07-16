'use client'

import { useEffect, useState } from 'react'
import { PageHeader } from '@/components/admin/page-header'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import { Loader2, Globe, Sliders, Calendar, Trash, Plus, Video, Play, Image as ImageIcon } from 'lucide-react'

export default function SettingsPage() {
  const [loading, setLoading] = useState(true)
  const [savingKey, setSavingKey] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'general' | 'homepage' | 'social'>('general')

  // Brand identity
  const [siteName, setSiteName] = useState('Devyajnam')
  const [tagline, setTagline] = useState('Sanatan Seva Online')
  const [logoUrl, setLogoUrl] = useState('')

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

  // Homepage customizer
  const [heroTitle, setHeroTitle] = useState('')
  const [heroSubtitle, setHeroSubtitle] = useState('')
  const [heroCta, setHeroCta] = useState('')
  const [heroCtaLink, setHeroCtaLink] = useState('')
  const [heroImage, setHeroImage] = useState('')

  // Social media posts & videos
  const [socialPosts, setSocialPosts] = useState<any[]>([])
  const [newPostTitle, setNewPostTitle] = useState('')
  const [newPostUrl, setNewPostUrl] = useState('')
  const [newPostPlatform, setNewPostPlatform] = useState('YouTube')
  const [newPostDate, setNewPostDate] = useState('')
  const [newPostStatus, setNewPostStatus] = useState('SCHEDULED')

  // Load configuration on mount
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true)
        const res = await fetch('/api/admin/settings')
        const data = await res.json()
        if (data.ok && data.config) {
          const cfg = data.config
          setSiteName(cfg.site_name || 'Devyajnam')
          setTagline(cfg.site_tagline || 'Sanatan Seva Online')
          setLogoUrl(cfg.site_logo || '')

          setEmail(cfg.contact_email || 'seva@devyajnam.com')
          setPhone(cfg.contact_phone || '+91-99999-99999')
          setWhatsapp(cfg.contact_whatsapp || '+91-99999-99999')
          setAddress(cfg.contact_address || 'Varanasi, Uttar Pradesh, India')

          setColorPrimary(cfg.theme_color_primary || '#FF8C21')
          setColorAccent(cfg.theme_color_accent || '#B12D2D')
          setColorSecondary(cfg.theme_color_secondary || '#F0B429')

          setMaintenanceMode(!!cfg.maintenance_mode)
          setMaintenanceMsg(cfg.maintenance_message || 'We will be back soon…')

          setHeroTitle(cfg.homepage_hero_title || '')
          setHeroSubtitle(cfg.homepage_hero_subtitle || '')
          setHeroCta(cfg.homepage_hero_cta || '')
          setHeroCtaLink(cfg.homepage_hero_cta_link || '')
          setHeroImage(cfg.homepage_hero_image || '')

          setSocialPosts(cfg.social_posts || [])
        }
      } catch (err) {
        console.error('Failed to load settings:', err)
        toast.error('Failed to load website configurations')
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
    await handleSaveSetting('site_logo', logoUrl, 'Website Logo')
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

  const saveHomepageHero = async () => {
    await handleSaveSetting('homepage_hero_title', heroTitle, 'Homepage Hero Title')
    await handleSaveSetting('homepage_hero_subtitle', heroSubtitle, 'Homepage Hero Subtitle')
    await handleSaveSetting('homepage_hero_cta', heroCta, 'CTA Button Label')
    await handleSaveSetting('homepage_hero_cta_link', heroCtaLink, 'CTA Link')
    await handleSaveSetting('homepage_hero_image', heroImage, 'Hero Background Image')
  }

  const handleAddSocialPost = async () => {
    if (!newPostTitle || !newPostUrl) {
      toast.error('Post/Video title and URL link are required')
      return
    }
    const newPost = {
      id: Date.now().toString(),
      title: newPostTitle,
      url: newPostUrl,
      platform: newPostPlatform,
      scheduledAt: newPostDate || new Date().toISOString().split('T')[0],
      status: newPostStatus
    }
    const updated = [newPost, ...socialPosts]
    setSocialPosts(updated)
    await handleSaveSetting('social_posts', updated, 'Social scheduler post list')
    setNewPostTitle('')
    setNewPostUrl('')
  }

  const handleDeleteSocialPost = async (id: string) => {
    const updated = socialPosts.filter(p => p.id !== id)
    setSocialPosts(updated)
    await handleSaveSetting('social_posts', updated, 'Social post removed')
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-2">
        <Loader2 className="h-8 w-8 text-amber-500 animate-spin" />
        <p className="text-sm text-muted-foreground">Loading configurations…</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <PageHeader 
        title="System Customizer & Settings" 
        description="Configure brand assets, complete homepage layouts from A to Z, and schedule social media publications."
        breadcrumbs={[{ label: 'Admin', href: '/admin' }, { label: 'Settings' }]} 
      />

      {/* Dynamic Settings Navigation Tabs */}
      <div className="flex items-center gap-1.5 bg-muted/80 p-1 rounded-lg w-fit">
        <button
          onClick={() => setActiveTab('general')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-md transition-all ${
            activeTab === 'general'
              ? 'bg-background text-foreground shadow-sm font-bold'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <Globe className="h-3.5 w-3.5" /> General Configuration
        </button>
        <button
          onClick={() => setActiveTab('homepage')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-md transition-all ${
            activeTab === 'homepage'
              ? 'bg-background text-foreground shadow-sm font-bold'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <Sliders className="h-3.5 w-3.5" /> A-to-Z Homepage Customizer
        </button>
        <button
          onClick={() => setActiveTab('social')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-md transition-all ${
            activeTab === 'social'
              ? 'bg-background text-foreground shadow-sm font-bold'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <Calendar className="h-3.5 w-3.5" /> Social Media Scheduler
        </button>
      </div>

      {activeTab === 'general' && (
        <div className="grid gap-6 md:grid-cols-2">
          {/* Brand Identity Card */}
          <Card className="border shadow-sm">
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
              <div className="space-y-1.5">
                <Label htmlFor="logo-url-val">Custom Logo Image URL</Label>
                <Input id="logo-url-val" placeholder="e.g. /my-custom-logo.png" value={logoUrl} onChange={(e) => setLogoUrl(e.target.value)} />
                <p className="text-[10px] text-muted-foreground">Provide a link to your brand logo. Fallback is the sacred OM emblem.</p>
              </div>
              <Button 
                className="w-full bg-amber-500 hover:bg-amber-600 text-black font-bold"
                onClick={saveIdentity}
                disabled={savingKey !== null}
              >
                {savingKey === 'site_name' ? 'Saving…' : 'Save Brand Identity'}
              </Button>
            </CardContent>
          </Card>

          {/* Contact Details Card */}
          <Card className="border shadow-sm">
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
                className="w-full bg-amber-500 hover:bg-amber-600 text-black font-bold"
                onClick={saveContact}
                disabled={savingKey !== null}
              >
                {savingKey === 'contact_email' ? 'Saving…' : 'Save Contact Details'}
              </Button>
            </CardContent>
          </Card>

          {/* Theme Colors Card */}
          <Card className="border shadow-sm">
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
                className="w-full bg-amber-500 hover:bg-amber-600 text-black font-bold"
                onClick={saveTheme}
                disabled={savingKey !== null}
              >
                {savingKey === 'theme_color_primary' ? 'Saving…' : 'Save Theme Colors'}
              </Button>
            </CardContent>
          </Card>

          {/* Maintenance Mode Card */}
          <Card className="border shadow-sm">
            <CardHeader className="pb-3"><CardTitle className="text-base font-bold">Maintenance Mode</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between py-2 border-b">
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
                className="w-full bg-amber-500 hover:bg-amber-600 text-black font-bold"
                onClick={saveMaintenance}
                disabled={savingKey !== null}
              >
                {savingKey === 'maintenance_mode' ? 'Saving…' : 'Save Status & Message'}
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'homepage' && (
        <Card className="border shadow-sm">
          <CardHeader>
            <CardTitle className="text-base font-bold">A-to-Z Homepage Customizer</CardTitle>
            <CardDescription>Live edit and personalize the landing page copy, hero heading, call-to-actions, and graphics instantly.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="hero-title">Main Hero Title (H1)</Label>
                <Input 
                  id="hero-title" 
                  value={heroTitle} 
                  onChange={(e) => setHeroTitle(e.target.value)} 
                  placeholder="e.g. Bring Auspicious Blessings to Your Home" 
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="hero-image">Hero Banner Image URL</Label>
                <Input 
                  id="hero-image" 
                  value={heroImage} 
                  onChange={(e) => setHeroImage(e.target.value)} 
                  placeholder="e.g. /images/hero-bg.jpg or https://picsum.photos/..." 
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="hero-subtitle">Hero Subheading Description</Label>
              <Textarea 
                id="hero-subtitle" 
                rows={3}
                value={heroSubtitle} 
                onChange={(e) => setHeroSubtitle(e.target.value)} 
                placeholder="e.g. Book online pujas performed by authorized Vedic pandits at holy Indian temples..." 
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="hero-cta">Primary CTA Button Label</Label>
                <Input 
                  id="hero-cta" 
                  value={heroCta} 
                  onChange={(e) => setHeroCta(e.target.value)} 
                  placeholder="e.g. Book a Puja Now" 
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="hero-cta-link">Primary CTA Destination Link</Label>
                <Input 
                  id="hero-cta-link" 
                  value={heroCtaLink} 
                  onChange={(e) => setHeroCtaLink(e.target.value)} 
                  placeholder="e.g. /pujas" 
                />
              </div>
            </div>

            <Button 
              className="bg-primary hover:bg-primary/95 text-white font-bold w-full md:w-fit px-8"
              onClick={saveHomepageHero}
              disabled={savingKey !== null}
            >
              {savingKey === 'homepage_hero_title' ? 'Saving Homepage Config...' : 'Apply Homepage Customization'}
            </Button>
          </CardContent>
        </Card>
      )}

      {activeTab === 'social' && (
        <div className="grid gap-6 md:grid-cols-3">
          {/* Scheduling Creator Card */}
          <Card className="border shadow-sm md:col-span-1">
            <CardHeader>
              <CardTitle className="text-base font-bold flex items-center gap-2"><Video className="h-4 w-4 text-primary" /> Schedule Post / Video</CardTitle>
              <CardDescription>Schedule or display a social media content video link directly on the website main stage.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="post-title">Video / Post Title</Label>
                <Input 
                  id="post-title" 
                  value={newPostTitle} 
                  onChange={(e) => setNewPostTitle(e.target.value)} 
                  placeholder="e.g. Live Sawan Somvar Aarti Video" 
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="post-url">Social Media Link / Video URL</Label>
                <Input 
                  id="post-url" 
                  value={newPostUrl} 
                  onChange={(e) => setNewPostUrl(e.target.value)} 
                  placeholder="e.g. https://www.youtube.com/watch?v=..." 
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1.5">
                  <Label htmlFor="post-platform">Platform</Label>
                  <select 
                    id="post-platform" 
                    value={newPostPlatform} 
                    onChange={(e) => setNewPostPlatform(e.target.value)}
                    className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors"
                  >
                    <option value="YouTube">YouTube</option>
                    <option value="Facebook">Facebook</option>
                    <option value="Instagram">Instagram</option>
                    <option value="Twitter">Twitter</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="post-status">Status</Label>
                  <select 
                    id="post-status" 
                    value={newPostStatus} 
                    onChange={(e) => setNewPostStatus(e.target.value)}
                    className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors"
                  >
                    <option value="SCHEDULED">Scheduled</option>
                    <option value="LIVE">Live Now</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="post-date">Publish Date</Label>
                <Input 
                  id="post-date" 
                  type="date"
                  value={newPostDate} 
                  onChange={(e) => setNewPostDate(e.target.value)} 
                />
              </div>

              <Button 
                className="w-full bg-amber-500 hover:bg-amber-600 text-black font-bold flex items-center justify-center gap-1.5"
                onClick={handleAddSocialPost}
              >
                <Plus className="h-4 w-4" /> Add & Schedule Link
              </Button>
            </CardContent>
          </Card>

          {/* Scheduling Feed List */}
          <Card className="border shadow-sm md:col-span-2">
            <CardHeader>
              <CardTitle className="text-base font-bold">Scheduled Posts & Active Video Links</CardTitle>
              <CardDescription>All scheduled content is rendered dynamically inside the homepage feed for devotees.</CardDescription>
            </CardHeader>
            <CardContent>
              {socialPosts.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground border border-dashed rounded-lg">
                  No scheduled social media posts or video links created yet.
                </div>
              ) : (
                <div className="space-y-3">
                  {socialPosts.map((post: any) => (
                    <div 
                      key={post.id} 
                      className="flex items-center justify-between p-3.5 border rounded-lg hover:bg-muted/10 transition-colors"
                    >
                      <div className="space-y-1 pr-4">
                        <div className="flex items-center gap-2">
                          <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold ${
                            post.status === 'LIVE' 
                              ? 'bg-red-100 text-red-800' 
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            {post.status}
                          </span>
                          <span className="text-xs font-semibold text-amber-800 font-mono">
                            [{post.platform}]
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {post.scheduledAt}
                          </span>
                        </div>
                        <h4 className="font-bold text-sm text-foreground">{post.title}</h4>
                        <p className="text-xs text-muted-foreground font-mono truncate max-w-sm md:max-w-md">{post.url}</p>
                      </div>

                      <div className="flex items-center gap-2 flex-shrink-0">
                        <Button 
                          size="icon" 
                          variant="ghost" 
                          className="h-8 w-8 text-red-600 hover:text-red-700"
                          onClick={() => handleDeleteSocialPost(post.id)}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
