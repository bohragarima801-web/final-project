'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Menu, X, ShoppingBag, User, Search, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Logo } from '@/components/logo'
import { ThemeToggle } from '@/components/theme-toggle'
import { cn } from '@/lib/utils'

const navItems = [
  { title: 'Home', href: '/' },
  { title: 'Pujas', href: '/pujas' },
  { title: 'VIP Pujas', href: '/vip-pujas' },
  { title: 'Products', href: '/products' },
  { title: 'Chadhawa', href: '/chadhawa' },
  { title: 'Donation', href: '/donation' },
  { title: 'Temples', href: '/temples' },
  { title: 'Blog', href: '/blog' },
]

const toolsMenu = [
  { title: 'Ask a Pandit ✨', href: '/ask-a-pandit', desc: 'AI spiritual guidance' },
  { title: 'Kundali', href: '/tools#kundali', desc: 'Birth chart & analysis' },
  { title: 'Kundali Milan', href: '/tools#milan', desc: 'Marriage compatibility' },
  { title: 'Panchang', href: '/tools#panchang', desc: 'Daily Hindu calendar' },
  { title: 'Muhurat', href: '/tools#muhurat', desc: 'Auspicious timings' },
  { title: 'Numerology', href: '/tools#numerology', desc: 'Number-based insights' },
  { title: 'Ratna', href: '/tools#ratna', desc: 'Gemstone suggestion' },
  { title: 'Mala Counter', href: '/tools#mala', desc: 'Digital jaap tracker' },
]

export function Navbar({ user }: { user?: { fullName?: string | null; email: string } | null }) {
  const [open, setOpen] = useState(false)
  const [toolsOpen, setToolsOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/80 backdrop-blur-lg">
      <div className="container flex h-16 items-center justify-between gap-4">
        <Logo />

        <nav className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}
              className="px-3 py-2 rounded-md text-sm font-medium text-foreground/80 hover:text-primary hover:bg-primary/5 transition-colors">
              {item.title}
            </Link>
          ))}
          <div className="relative" onMouseEnter={() => setToolsOpen(true)} onMouseLeave={() => setToolsOpen(false)}>
            <Link href="/tools"
              className="flex items-center gap-1 px-3 py-2 rounded-md text-sm font-medium text-foreground/80 hover:text-primary hover:bg-primary/5">
              Tools <ChevronDown className="h-3 w-3" />
            </Link>
            {toolsOpen && (
              <div className="absolute top-full right-0 pt-2 w-72">
                <div className="bg-popover border rounded-lg shadow-xl p-2">
                  {toolsMenu.map((t) => (
                    <Link key={t.href} href={t.href} className="block px-3 py-2 rounded-md hover:bg-muted">
                      <div className="text-sm font-medium">{t.title}</div>
                      <div className="text-[11px] text-muted-foreground">{t.desc}</div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </nav>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" aria-label="Search" className="hidden sm:inline-flex"><Search className="h-5 w-5" /></Button>
          <Button variant="ghost" size="icon" aria-label="Cart" asChild className="hidden sm:inline-flex">
            <Link href="/cart"><ShoppingBag className="h-5 w-5" /></Link>
          </Button>
          <ThemeToggle />

          {user ? (
            <Button asChild size="sm" variant="outline" className="hidden sm:inline-flex">
              <Link href="/dashboard"><User className="h-4 w-4 mr-1" /> {user.fullName?.split(' ')[0] || 'Account'}</Link>
            </Button>
          ) : (
            <Button asChild size="sm" className="hidden sm:inline-flex"><Link href="/login">Login</Link></Button>
          )}

          <Button variant="ghost" size="icon" onClick={() => setOpen(!open)} className="lg:hidden" aria-label="Menu">
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      <div className={cn('lg:hidden border-t border-border/60 bg-background', open ? 'block' : 'hidden')}>
        <nav className="container py-4 flex flex-col gap-1">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} onClick={() => setOpen(false)}
              className="px-3 py-2 rounded-md text-sm font-medium hover:bg-primary/5">{item.title}</Link>
          ))}
          <Link href="/tools" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-primary/5">Tools</Link>
          <Link href="/ask-a-pandit" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-primary/5">Ask a Pandit ✨</Link>
          <div className="border-t border-border/60 my-2" />
          {user ? (
            <Link href="/dashboard" className="px-3 py-2 rounded-md text-sm font-medium text-primary">My Dashboard</Link>
          ) : (
            <>
              <Link href="/login" className="px-3 py-2 rounded-md text-sm font-medium text-primary">Login</Link>
              <Link href="/register" className="px-3 py-2 rounded-md text-sm font-medium">Register</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}
