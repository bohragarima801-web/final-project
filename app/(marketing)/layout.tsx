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

  const activeCoupon = await prisma.coupon.findFirst({
    where: {
      isActive: true,
      OR: [
        { expiresAt: null },
        { expiresAt: { gt: new Date() } }
      ]
    },
    orderBy: { createdAt: 'desc' }
  }).catch(() => null)

  return (
    <div className="min-h-screen flex flex-col">
      {activeCoupon && (
        <div className="bg-gradient-to-r from-orange-600 via-red-500 to-orange-600 text-white py-2.5 px-4 text-center text-xs md:text-sm font-bold flex flex-wrap justify-center items-center gap-1.5 shadow-md relative z-50">
          <span className="animate-pulse mr-1">🔥</span>
          <span>
            Special Offer: Use code 
            <span className="bg-white text-orange-700 px-2 py-0.5 rounded-md tracking-wider mx-2 border border-orange-200 shadow-sm inline-block">
              {activeCoupon.code}
            </span> 
            for {activeCoupon.discountType === 'PERCENTAGE' ? `${activeCoupon.discountValue}% OFF` : `₹${activeCoupon.discountValue} OFF`}!
          </span>
          {activeCoupon.description && <span className="hidden md:inline font-normal opacity-95"> - {activeCoupon.description}</span>}
        </div>
      )}
      <Navbar user={user ? { fullName: user.fullName, email: user.email } : null} />
      <main className="flex-1">{children}</main>
      <Footer mapUrl={mapUrl} />
    </div>
  )
}
