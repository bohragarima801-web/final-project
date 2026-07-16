import { Navbar } from '@/components/layouts/navbar'
import { DashboardSidebar } from '@/components/layouts/dashboard-sidebar'
import { getCurrentUser } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser().catch(() => null)
  if (!user) redirect('/login?redirect=/dashboard')
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar user={{ fullName: user.fullName, email: user.email }} />
      <div className="flex flex-1">
        <DashboardSidebar />
        <main className="flex-1 p-6 lg:p-8 bg-muted/20">{children}</main>
      </div>
    </div>
  )
}
