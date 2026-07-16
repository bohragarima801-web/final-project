import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar, ShoppingBag, Heart, Bell } from 'lucide-react'
import { getCurrentUser } from '@/lib/auth'

const stats = [
  { title: 'Active Bookings', value: '0', icon: Calendar, color: 'text-primary' },
  { title: 'Orders', value: '0', icon: ShoppingBag, color: 'text-accent' },
  { title: 'Wishlist', value: '0', icon: Heart, color: 'text-pink-500' },
  { title: 'Notifications', value: '0', icon: Bell, color: 'text-secondary' },
]

export default async function DashboardPage() {
  const user = await getCurrentUser()
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">नमस्ते, {user?.fullName?.split(' ')[0] || 'Devotee'} 🙏</h1>
        <p className="text-muted-foreground text-sm">Welcome to your spiritual dashboard.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => {
          const Icon = s.icon
          return (
            <Card key={s.title}>
              <CardHeader className="pb-2 flex-row items-center justify-between space-y-0">
                <CardTitle className="text-sm font-medium text-muted-foreground">{s.title}</CardTitle>
                <Icon className={`h-4 w-4 ${s.color}`} />
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{s.value}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <Card>
        <CardHeader><CardTitle>Recent activity</CardTitle></CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">No recent activity yet. Start by booking a puja — <a href="/pujas" className="text-primary hover:underline">browse pujas →</a></p>
        </CardContent>
      </Card>
    </div>
  )
}
