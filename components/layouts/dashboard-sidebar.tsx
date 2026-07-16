'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard, Calendar, ShoppingBag, Heart, MapPin, HeadphonesIcon,
  Bell, FileDown, User as UserIcon, LogOut, FileText, Wallet,
} from 'lucide-react'

const items = [
  { title: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { title: 'My Bookings', href: '/dashboard/bookings', icon: Calendar },
  { title: 'Orders', href: '/dashboard/orders', icon: ShoppingBag },
  { title: 'Payments', href: '/dashboard/payments', icon: Wallet },
  { title: 'Invoices', href: '/dashboard/invoices', icon: FileText },
  { title: 'Wishlist', href: '/dashboard/wishlist', icon: Heart },
  { title: 'Addresses', href: '/dashboard/addresses', icon: MapPin },
  { title: 'Notifications', href: '/dashboard/notifications', icon: Bell },
  { title: 'Downloads', href: '/dashboard/downloads', icon: FileDown },
  { title: 'Support', href: '/dashboard/support', icon: HeadphonesIcon },
  { title: 'Profile', href: '/dashboard/profile', icon: UserIcon },
]

export function DashboardSidebar() {
  const pathname = usePathname()

  return (
    <aside className="hidden lg:flex flex-col w-64 border-r border-border/60 bg-sidebar min-h-[calc(100vh-4rem)] sticky top-16">
      <nav className="flex-1 p-4 space-y-1">
        {items.map((item) => {
          const Icon = item.icon
          const active = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                active
                  ? 'bg-primary text-primary-foreground'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent'
              )}
            >
              <Icon className="h-4 w-4" />
              {item.title}
            </Link>
          )
        })}
      </nav>
      <div className="p-4 border-t border-sidebar-border">
        <form action="/auth/signout" method="post">
          <button className="flex items-center gap-3 w-full rounded-md px-3 py-2 text-sm font-medium text-sidebar-foreground hover:bg-sidebar-accent">
            <LogOut className="h-4 w-4" />
            Sign out
          </button>
        </form>
      </div>
    </aside>
  )
}
