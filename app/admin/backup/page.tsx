import { PageHeader } from '@/components/admin/page-header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { DatabaseBackup, HardDrive, RotateCcw } from 'lucide-react'

export default function BackupPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Backup & Restore" description="Database and media backups."
        breadcrumbs={[{ label: 'Admin', href: '/admin' }, { label: 'Backup' }]}
        action={{ label: 'Create Backup Now', icon: DatabaseBackup }} />
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2"><DatabaseBackup className="h-4 w-4" /> Database</CardTitle>
            <Badge variant="secondary">Daily @ 02:00 IST</Badge>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Last backup: never</p>
            <div className="mt-3 flex gap-2">
              <Button size="sm">Backup Now</Button>
              <Button size="sm" variant="outline"><RotateCcw className="h-3 w-3 mr-1" /> Restore</Button>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2"><HardDrive className="h-4 w-4" /> Media</CardTitle>
            <Badge variant="secondary">Weekly</Badge>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Last backup: never</p>
            <div className="mt-3 flex gap-2">
              <Button size="sm">Backup Now</Button>
              <Button size="sm" variant="outline">Download</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
