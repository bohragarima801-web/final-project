'use client'

import { PageHeader } from '@/components/admin/page-header'
import { AdminTabs } from '@/components/admin/admin-tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

export default function NotificationsPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Notifications" description="Send Push, Email, SMS, WhatsApp & In-App notifications."
        breadcrumbs={[{ label: 'Admin', href: '/admin' }, { label: 'Notifications' }]} />
      <AdminTabs tabs={[
        { label: 'Send New' }, { label: 'Push', value: 'push' },
        { label: 'Email', value: 'email' }, { label: 'SMS', value: 'sms' },
        { label: 'WhatsApp', value: 'whatsapp' }, { label: 'In-App', value: 'in-app' },
      ]} />
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Compose Notification</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2"><Label>Title</Label><Input placeholder="🗓️ Sawan Somvar Puja Starting Soon" /></div>
            <div className="space-y-2"><Label>Message</Label><Textarea rows={4} placeholder="Book your sankalp before the ritual begins…" /></div>
            <div className="space-y-2"><Label>Audience</Label><Input placeholder="All users / Segmented" /></div>
            <div className="space-y-2"><Label>Channel</Label><Input placeholder="Push + Email + WhatsApp" /></div>
            <Button onClick={() => toast.success('Notification queued (mock)')}>Send</Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Recent Sends</CardTitle></CardHeader>
          <CardContent><p className="text-sm text-muted-foreground">No notifications sent yet.</p></CardContent>
        </Card>
      </div>
    </div>
  )
}
