import { Navbar } from '@/components/layouts/navbar'
import { Footer } from '@/components/layouts/footer'
import { getCurrentUser } from '@/lib/auth'

export default async function MarketingLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser().catch(() => null)
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar user={user ? { fullName: user.fullName, email: user.email } : null} />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}
