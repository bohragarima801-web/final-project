import { Card } from '@/components/ui/card'
import { FileText } from 'lucide-react'

export default function InvoicesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">My Invoices</h1>
        <p className="text-muted-foreground text-sm">Download your billing invoices for tax and records.</p>
      </div>

      <Card className="flex flex-col items-center justify-center p-12 text-center">
        <FileText className="h-12 w-12 text-muted-foreground mb-4 opacity-50" />
        <h3 className="font-semibold text-lg">No Invoices</h3>
        <p className="text-sm text-muted-foreground max-w-sm mt-1">
          No invoices are available for download at this moment.
        </p>
      </Card>
    </div>
  )
}
