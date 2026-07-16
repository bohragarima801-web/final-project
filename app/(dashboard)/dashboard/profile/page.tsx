import { getCurrentUser } from '@/lib/auth'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { User as UserIcon, Mail, Phone, Calendar } from 'lucide-react'

export default async function ProfilePage() {
  const user = await getCurrentUser()
  if (!user) return null

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">My Profile</h1>
        <p className="text-muted-foreground text-sm">Manage your personal information and contact details.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Personal Details</CardTitle>
          <CardDescription>Your registered account details on दिव्ययज्ञम्.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3 p-3 rounded-md bg-muted/30">
            <UserIcon className="h-5 w-5 text-primary" />
            <div>
              <p className="text-xs text-muted-foreground">Full Name</p>
              <p className="font-semibold">{user.fullName || 'Devotee'}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-md bg-muted/30">
            <Mail className="h-5 w-5 text-primary" />
            <div>
              <p className="text-xs text-muted-foreground">Email Address</p>
              <p className="font-semibold">{user.email}</p>
            </div>
          </div>

          {user.phone && (
            <div className="flex items-center gap-3 p-3 rounded-md bg-muted/30">
              <Phone className="h-5 w-5 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">Phone Number</p>
                <p className="font-semibold">{user.phone}</p>
              </div>
            </div>
          )}

          <div className="flex items-center gap-3 p-3 rounded-md bg-muted/30">
            <Calendar className="h-5 w-5 text-primary" />
            <div>
              <p className="text-xs text-muted-foreground">Member Since</p>
              <p className="font-semibold">
                {new Date(user.createdAt || Date.now()).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
