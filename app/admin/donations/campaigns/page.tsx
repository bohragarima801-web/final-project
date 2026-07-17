import { PageHeader } from '@/components/admin/page-header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

const campaigns = [
  { title: 'Save 1000 Cows', category: 'Gaushala', raised: 45000, target: 500000, image: '🐄' },
  { title: 'Annadan Seva Fund', category: 'Annadan', raised: 12000, target: 100000, image: '🍚' },
  { title: 'Gurukul Sponsorship', category: 'Gurukul', raised: 32000, target: 200000, image: '📚' },
]

export default function CampaignsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Donation Campaigns"
        description="Create and manage fundraising campaigns."
        breadcrumbs={[{ label: 'Donations', href: '/admin/donations' }, { label: 'Campaigns' }]}
        action={{ label: 'New Campaign' }}
      />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {campaigns.map((c) => {
          const pct = Math.round((c.raised / c.target) * 100)
          return (
            <Card key={c.title}>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <span className="text-3xl">{c.image}</span>
                  <div>
                    <CardTitle className="text-base">{c.title}</CardTitle>
                    <Badge variant="secondary" className="mt-1">{c.category}</Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1"><span>₹{c.raised.toLocaleString('en-IN')} raised</span><span className="text-muted-foreground">of ₹{c.target.toLocaleString('en-IN')}</span></div>
                  <Progress value={pct} />
                  <p className="text-xs text-muted-foreground mt-1">{pct}% funded</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">Edit</Button>
                  <Button size="sm" className="flex-1">View</Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
