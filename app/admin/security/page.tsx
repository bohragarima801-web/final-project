import { PageHeader } from '@/components/admin/page-header'
import { AdminTabs } from '@/components/admin/admin-tabs'
import { KpiCard } from '@/components/admin/kpi-card'
import { DataTableShell } from '@/components/admin/data-table-shell'
import { Lock, ShieldCheck, Activity, Key } from 'lucide-react'

export default function SecurityPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Security" description="Login logs, sessions, API keys, rate limiting."
        breadcrumbs={[{ label: 'Admin', href: '/admin' }, { label: 'Security' }]} />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard title="Active Sessions" value="1" icon={Activity} iconClass="text-green-600" />
        <KpiCard title="Failed Logins (24h)" value="0" icon={Lock} iconClass="text-red-500" />
        <KpiCard title="API Keys" value="0" icon={Key} />
        <KpiCard title="2FA Enabled" value="0" icon={ShieldCheck} />
      </div>
      <AdminTabs tabs={[
        { label: 'Overview' }, { label: 'Login Logs', value: 'login-logs' },
        { label: 'Activity', value: 'activity' }, { label: 'Sessions', value: 'sessions' },
        { label: 'API Keys', value: 'api-keys' }, { label: 'Rate Limits', value: 'rate-limits' },
      ]} />
      <DataTableShell
        columns={[
          { key: 'user', label: 'User' }, { key: 'ip', label: 'IP' },
          { key: 'ua', label: 'Device' }, { key: 'status', label: 'Status' },
          { key: 'time', label: 'Time' },
        ]}
        rows={[]}
      />
    </div>
  )
}
