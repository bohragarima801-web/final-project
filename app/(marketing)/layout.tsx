import { Navbar } from '@/components/layouts/navbar'
import { Footer } from '@/components/layouts/footer'
import { getCurrentUser } from '@/lib/auth'
import prisma from '@/lib/prisma'

export default async function MarketingLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser().catch(() => null)
  
  const mapSetting = await prisma.websiteSetting.findFirst({
    where: { key: 'contact.google_map_url' }
  }).catch(() => null)

  const mapUrl = mapSetting?.value || ''

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar user={user ? { fullName: user.fullName, email: user.email } : null} />
      <main className="flex-1">{children}</main>
      <Footer mapUrl={mapUrl} />
    </div>
  )
}
