import { PageHeader } from '@/components/admin/page-header'
import { AdminTabs } from '@/components/admin/admin-tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'

export default function SeoPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="SEO" description="Meta tags, sitemap, robots, schema, redirects."
        breadcrumbs={[{ label: 'Admin', href: '/admin' }, { label: 'SEO' }]} />
      <AdminTabs tabs={[
        { label: 'Overview' }, { label: 'Meta Tags', value: 'meta' },
        { label: 'Sitemap', value: 'sitemap' }, { label: 'Robots.txt', value: 'robots' },
        { label: 'Open Graph', value: 'og' }, { label: 'Schema', value: 'schema' },
        { label: 'Redirects', value: 'redirects' },
      ]} />
      <Card>
        <CardHeader><CardTitle>Global SEO Defaults</CardTitle></CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2"><Label>Default Title Template</Label><Input defaultValue="%s | दिव्ययज्ञम्" /></div>
          <div className="space-y-2"><Label>Default Keywords</Label><Input defaultValue="Online Puja, Sanatan, Temple, Prasad" /></div>
          <div className="space-y-2 md:col-span-2"><Label>Default Description</Label><Textarea rows={3} defaultValue="दिव्ययज्ञम् — Book sacred pujas online, offer chadhawa & donate." /></div>
          <div className="space-y-2"><Label>OG Image URL</Label><Input placeholder="https://…" /></div>
          <div className="space-y-2"><Label>Google Search Console Verification</Label><Input placeholder="google-site-verification=…" /></div>
          <div className="md:col-span-2"><Button>Save SEO Settings</Button></div>
        </CardContent>
      </Card>
    </div>
  )
}
