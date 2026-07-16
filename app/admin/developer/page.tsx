import { PageHeader } from '@/components/admin/page-header'
import { AdminTabs } from '@/components/admin/admin-tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Activity, Cpu, Database, Zap, FileText, AlertTriangle } from 'lucide-react'

export default function DeveloperPage() {
  const services = [
    { label: 'Next.js Server', status: 'healthy', icon: Cpu },
    { label: 'Supabase Auth', status: 'healthy', icon: Zap },
    { label: 'Postgres (Prisma)', status: 'not-connected', icon: Database },
    { label: 'Storage', status: 'healthy', icon: FileText },
  ]
  return (
    <div className="space-y-6">
      <PageHeader title="Developer" description="System health, logs, cron & cache."
        breadcrumbs={[{ label: 'Admin', href: '/admin' }, { label: 'Developer' }]} />
      <AdminTabs tabs={[
        { label: 'System Health' }, { label: 'Env Vars', value: 'env' },
        { label: 'API Logs', value: 'api-logs' }, { label: 'Error Logs', value: 'error-logs' },
        { label: 'Cron Jobs', value: 'cron' }, { label: 'Cache', value: 'cache' },
      ]} />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {services.map((s) => {
          const Icon = s.icon
          const healthy = s.status === 'healthy'
          return (
            <Card key={s.label}>
              <CardContent className="p-4 flex items-center gap-3">
                <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${healthy ? 'bg-green-500/10 text-green-600' : 'bg-red-500/10 text-red-600'}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{s.label}</p>
                  <Badge variant={healthy ? 'default' : 'destructive'} className="mt-1 text-[10px]">
                    {healthy ? 'Healthy' : s.status}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2 text-base"><Activity className="h-4 w-4" /> Actions</CardTitle></CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Button variant="outline">Clear Cache</Button>
          <Button variant="outline">Run Health Check</Button>
          <Button variant="outline">Regenerate Sitemap</Button>
          <Button variant="outline">Rebuild Search Index</Button>
        </CardContent>
      </Card>
    </div>
  )
}
