import { PageHeader } from '@/components/admin/page-header'
import { AdminTabs } from '@/components/admin/admin-tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export default function PaymentsPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Payment Settings" description="Gateways, taxes, currency & refund rules."
        breadcrumbs={[{ label: 'Admin', href: '/admin' }, { label: 'Payments' }]} />
      <AdminTabs tabs={[
        { label: 'Overview' }, { label: 'Razorpay', value: 'razorpay' },
        { label: 'UPI', value: 'upi' }, { label: 'Taxes', value: 'taxes' },
        { label: 'Currency', value: 'currency' }, { label: 'Refund Rules', value: 'refund-rules' },
      ]} />
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader className="flex-row items-center justify-between"><CardTitle>Razorpay</CardTitle><Badge variant="secondary">Not Connected</Badge></CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2"><Label>Key ID</Label><Input placeholder="rzp_live_…" /></div>
            <div className="space-y-2"><Label>Key Secret</Label><Input type="password" placeholder="••••••••" /></div>
            <div className="space-y-2"><Label>Webhook Secret</Label><Input type="password" /></div>
            <Button>Save & Test</Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Taxes & Currency</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2"><Label>Default Currency</Label><Input defaultValue="INR" /></div>
            <div className="space-y-2"><Label>GST %</Label><Input type="number" defaultValue={18} /></div>
            <div className="space-y-2"><Label>Refund Window (days)</Label><Input type="number" defaultValue={7} /></div>
            <Button>Save</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
