import { Card } from '@/components/ui/card'
import { HeadphonesIcon } from 'lucide-react'

export default function SupportPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Customer Support</h1>
        <p className="text-muted-foreground text-sm">Need help with your bookings or orders? Get in touch.</p>
      </div>

      <Card className="flex flex-col items-center justify-center p-12 text-center">
        <HeadphonesIcon className="h-12 w-12 text-muted-foreground mb-4 opacity-50" />
        <h3 className="font-semibold text-lg">Contact Support</h3>
        <p className="text-sm text-muted-foreground max-w-sm mt-1 mb-4">
          For any queries regarding bookings or orders, email us at:
        </p>
        <p className="font-bold text-primary">support@devyajnam.com</p>
      </Card>
    </div>
  )
}
