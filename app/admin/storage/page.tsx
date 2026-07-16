import { PageHeader } from '@/components/admin/page-header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { HardDrive, ImageIcon, FileText, Video } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function StoragePage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Storage" description="Supabase Storage & optional Cloudinary."
        breadcrumbs={[{ label: 'Admin', href: '/admin' }, { label: 'Storage' }]} />
      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><HardDrive className="h-4 w-4" /> Usage</CardTitle></CardHeader>
        <CardContent>
          <div className="flex justify-between text-sm mb-1"><span>Used</span><span className="text-muted-foreground">0 MB / 1 GB</span></div>
          <Progress value={0} />
        </CardContent>
      </Card>
      <div className="grid gap-4 md:grid-cols-3">
        <Card><CardHeader><CardTitle className="flex items-center gap-2 text-base"><ImageIcon className="h-4 w-4" /> Images</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold">0</p><p className="text-xs text-muted-foreground">0 MB</p></CardContent></Card>
        <Card><CardHeader><CardTitle className="flex items-center gap-2 text-base"><Video className="h-4 w-4" /> Videos</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold">0</p><p className="text-xs text-muted-foreground">0 MB</p></CardContent></Card>
        <Card><CardHeader><CardTitle className="flex items-center gap-2 text-base"><FileText className="h-4 w-4" /> Documents</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold">0</p><p className="text-xs text-muted-foreground">0 MB</p></CardContent></Card>
      </div>
      <div className="flex gap-2">
        <Button>Open File Manager</Button>
        <Button variant="outline">Configure Cloudinary</Button>
      </div>
    </div>
  )
}
