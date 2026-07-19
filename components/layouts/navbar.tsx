'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Menu, X, ShoppingBag, User, Search, ChevronDown, Languages } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Logo } from '@/components/logo'
import { ThemeToggle } from '@/components/theme-toggle'
import { cn } from '@/lib/utils'

const languages = [
  { code: 'hi', label: 'हिन्दी' },
  { code: 'en', label: 'English' },
  { code: 'ta', label: 'தமிழ்' },
  { code: 'te', label: 'తెలుగు' },
  { code: 'kn', label: 'ಕನ್ನಡ' },
  { code: 'gu', label: 'ગુજરાતી' },
  { code: 'mr', label: 'मराठी' },
  { code: 'bn', label: 'বাংলা' },
]

const navItems = [
  { title: 'Home', href: '/' },
  { title: 'Pujas', href: '/pujas' },
  { title: 'VIP Pujas', href: '/vip-pujas' },
  { title: 'Products', href: '/products' },
  { title: 'Chadhawa', href: '/chadhawa' },
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
  const [langOpen, setLangOpen] = useState(false)
  const [currentLang, setCurrentLang] = useState('hi')

  useState(() => {
    if (typeof window !== 'undefined') {
      setCurrentLang(localStorage.getItem('lang') || 'hi')
    }
  })

  const changeLang = (code: string) => {
    localStorage.setItem('lang', code)
    setCurrentLang(code)
    setLangOpen(false)
    window.location.reload()
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-amber-100/50 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md shadow-sm transition-all">
      <div className="container flex h-16 items-center justify-between gap-4 px-4 md:px-6">
        <Logo />

        {/* SriMandir-inspired center navigation links */}
        <nav className="hidden lg:flex items-center gap-1.5">
          {navItems.map((item) => (
            <Link 
              key={item.href} 
              href={item.href}
              className="px-3.5 py-2 rounded-full text-sm font-semibold text-slate-700 hover:text-orange-600 dark:text-slate-200 dark:hover:text-orange-500 hover:bg-orange-50/50 dark:hover:bg-slate-900/50 transition-all duration-200"
            >
              {item.title}
            </Link>
          ))}
          <div className="relative" onMouseEnter={() => setToolsOpen(true)} onMouseLeave={() => setToolsOpen(false)}>
            <Link 
              href="/tools"
              className="flex items-center gap-1 px-3.5 py-2 rounded-full text-sm font-semibold text-slate-700 hover:text-orange-600 dark:text-slate-200 dark:hover:text-orange-500 hover:bg-orange-50/50 dark:hover:bg-slate-900/50 transition-all duration-200"
            >
              Tools <ChevronDown className="h-3.5 w-3.5 opacity-60" />
            </Link>
            {toolsOpen && (
              <div className="absolute top-full right-0 pt-2 w-72 z-50">
                <div className="bg-popover border border-amber-100 rounded-2xl shadow-xl p-2 animate-in fade-in slide-in-from-top-1 duration-150">
                  {toolsMenu.map((t) => (
                    <Link key={t.href} href={t.href} className="block px-3 py-2 rounded-xl hover:bg-amber-50/50 dark:hover:bg-slate-900/50 transition-colors">
                      <div className="text-sm font-bold text-slate-800 dark:text-slate-200">{t.title}</div>
                      <div className="text-[11px] text-muted-foreground">{t.desc}</div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </nav>

        {/* Right action controls */}
        <div className="flex items-center gap-2.5">
          <Button variant="ghost" size="icon" aria-label="Search" className="hidden sm:inline-flex rounded-full text-slate-600 hover:text-orange-600 dark:text-slate-300"><Search className="h-5 w-5" /></Button>
          <Button variant="ghost" size="icon" aria-label="Cart" asChild className="hidden sm:inline-flex rounded-full text-slate-600 hover:text-orange-600 dark:text-slate-300">
            <Link href="/cart"><ShoppingBag className="h-5 w-5" /></Link>
          </Button>
          <ThemeToggle />
          
          {/* SriMandir Language Selector Dropdown */}
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              className="gap-1.5 px-3 h-9 text-slate-700 dark:text-slate-300 hover:text-orange-600 hover:bg-orange-50/50 transition-all rounded-full border border-amber-100/60"
              onClick={() => setLangOpen(!langOpen)}
            >
              <Languages className="h-4 w-4 text-orange-500" />
              <span className="text-xs font-black uppercase tracking-wider">{currentLang}</span>
              <ChevronDown className="h-3 w-3 opacity-60" />
            </Button>
            {langOpen && (
              <div className="absolute right-0 top-full mt-2 w-32 bg-popover border border-amber-100 rounded-xl shadow-xl p-1 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                {languages.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => changeLang(l.code)}
                    className={cn(
                      "w-full text-left px-3 py-2 rounded-lg text-xs font-bold hover:bg-amber-50/50 transition-colors",
                      currentLang === l.code ? "text-orange-600 bg-orange-50/50" : "text-slate-700 dark:text-slate-300"
                    )}
                  >
                    {l.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Premium Pill-shaped Account CTA */}
          {user ? (
            <div className="hidden sm:flex items-center gap-2">
              <Button asChild size="sm" variant="outline" className="rounded-full border-amber-200 text-slate-700 hover:bg-amber-50/50 shadow-sm font-bold">
                <Link href="/dashboard"><User className="h-4 w-4 mr-1 text-orange-500" /> {user.fullName?.split(' ')[0] || 'Account'}</Link>
              </Button>
              <form action="/auth/signout" method="post">
                <Button type="submit" size="sm" variant="ghost" className="text-slate-500 hover:text-destructive rounded-full font-bold px-3">
                  Logout
                </Button>
              </form>
            </div>
          ) : (
            <Button asChild size="sm" className="hidden sm:inline-flex bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-black rounded-full px-5 py-4 shadow-md transition-all hover:scale-[1.02] active:scale-[0.98] border-none"><Link href="/login">Login</Link></Button>
          )}

          <Button variant="ghost" size="icon" onClick={() => setOpen(!open)} className="lg:hidden rounded-full" aria-label="Menu">
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
            <>
              <Link href="/dashboard" className="px-3 py-2 rounded-md text-sm font-medium text-primary">My Dashboard</Link>
              <form action="/auth/signout" method="post" className="w-full">
                <button type="submit" onClick={() => setOpen(false)} className="w-full text-left px-3 py-2 rounded-md text-sm font-medium text-destructive hover:bg-destructive/5">
                  Sign Out
                </button>
              </form>
            </>
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
