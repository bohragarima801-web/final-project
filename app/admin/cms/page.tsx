import { PageHeader } from '@/components/admin/page-header'
import { AdminTabs } from '@/components/admin/admin-tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ClipboardList, ImageIcon, ArrowUpRight } from 'lucide-react'

const sections = [
  { title: 'Homepage', desc: 'Manage sections shown on the home page.', href: '/admin/cms' },
  { title: 'Hero Slider', desc: 'Rotating banners for the landing page.', href: '/admin/cms/hero' },
  { title: 'About Page', desc: 'Company story, mission, vision.', href: '/admin/cms?tab=about' },
  { title: 'Contact Page', desc: 'Contact info, form, map.', href: '/admin/cms?tab=contact' },
  { title: 'Footer', desc: 'Links, columns, socials.', href: '/admin/cms?tab=footer' },
  { title: 'Header Menu', desc: 'Main navigation items.', href: '/admin/cms?tab=menu' },
  { title: 'FAQs', desc: 'Frequently asked questions.', href: '/admin/cms?tab=faqs' },
  { title: 'Privacy Policy', desc: 'Legal privacy statement.', href: '/admin/cms?tab=privacy' },
  { title: 'Terms of Service', desc: 'User agreement.', href: '/admin/cms?tab=terms' },
  { title: 'Refund Policy', desc: 'Refund & cancellation rules.', href: '/admin/cms?tab=refund' },
  { title: 'Custom Pages', desc: 'Create any custom page.', href: '/admin/cms/pages' },
]

export default function CmsPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="CMS — Content Management" description="Edit every page and section of the website."
        breadcrumbs={[{ label: 'Admin', href: '/admin' }, { label: 'CMS' }]} />
      <AdminTabs tabs={[
        { label: 'Homepage' }, { label: 'About', value: 'about' }, { label: 'Contact', value: 'contact' },
        { label: 'Footer', value: 'footer' }, { label: 'Menu', value: 'menu' }, { label: 'FAQs', value: 'faqs' },
        { label: 'Privacy', value: 'privacy' }, { label: 'Terms', value: 'terms' }, { label: 'Refund', value: 'refund' },
      ]} />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {sections.map((s) => (
          <Card key={s.href}>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2"><ClipboardList className="h-4 w-4 text-primary" />{s.title}</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">{s.desc}</p>
              <Button size="sm" variant="outline" asChild><Link href={s.href}>Edit <ArrowUpRight className="h-3 w-3 ml-1" /></Link></Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
