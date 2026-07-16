import { PageHeader } from '@/components/admin/page-header'
import { KpiCard } from '@/components/admin/kpi-card'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Megaphone, Ticket, Users, Mail, ArrowUpRight } from 'lucide-react'

export default function MarketingPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Marketing" description="Coupons, referral program, newsletter & campaigns."
        breadcrumbs={[{ label: 'Admin', href: '/admin' }, { label: 'Marketing' }]} />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard title="Active Coupons" value="0" icon={Ticket} />
        <KpiCard title="Referrals" value="0" icon={Users} />
        <KpiCard title="Newsletter Subs" value="0" icon={Mail} />
        <KpiCard title="Campaigns Live" value="0" icon={Megaphone} />
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[
          { title: 'Coupons', desc: 'Create and manage discount codes.', href: '/admin/marketing/coupons' },
          { title: 'Newsletter', desc: 'Send updates to subscribers.', href: '/admin/marketing/newsletter' },
          { title: 'Referral Program', desc: 'Configure referral rewards.', href: '/admin/marketing?tab=referral' },
          { title: 'Campaigns', desc: 'Run promotional campaigns.', href: '/admin/marketing?tab=campaigns' },
          { title: 'Promo Banners', desc: 'Homepage / category banners.', href: '/admin/marketing?tab=banners' },
        ].map((m) => (
          <Card key={m.href}>
            <CardHeader><CardTitle className="text-base">{m.title}</CardTitle></CardHeader>
            <CardContent className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">{m.desc}</p>
              <Button size="sm" variant="outline" asChild><Link href={m.href}>Open <ArrowUpRight className="h-3 w-3 ml-1" /></Link></Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
