import { PageHeader } from '@/components/admin/page-header'
import { KpiCard } from '@/components/admin/kpi-card'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, TrendingUp, MousePointerClick, Globe, Smartphone, Monitor } from 'lucide-react'

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Analytics" description="Google Analytics, user growth, conversion & traffic." />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard title="Total Visitors (30d)" value="0" icon={Globe} />
        <KpiCard title="User Growth" value="0%" icon={Users} change={0} />
        <KpiCard title="Conversion Rate" value="0%" icon={MousePointerClick} />
        <KpiCard title="Revenue Growth" value="0%" icon={TrendingUp} change={0} />
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle className="text-base">Traffic Sources</CardTitle></CardHeader>
          <CardContent><p className="text-sm text-muted-foreground">Connect Google Analytics to see traffic sources.</p></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-base flex items-center gap-2">Device Breakdown</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-3"><Smartphone className="h-4 w-4" /> Mobile <span className="ml-auto text-sm text-muted-foreground">0%</span></div>
              <div className="flex items-center gap-3"><Monitor className="h-4 w-4" /> Desktop <span className="ml-auto text-sm text-muted-foreground">0%</span></div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
