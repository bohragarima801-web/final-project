'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Logo } from '@/components/logo'
import { siteConfig } from '@/lib/site-config'
import { Facebook, Instagram, Youtube, Twitter, Mail, Phone } from 'lucide-react'

const columns: { title: string; links: { label: string; href: string }[] }[] = [
  {
    title: 'Services',
    links: [
      { label: 'Online Puja', href: '/pujas' },
      { label: 'VIP Puja', href: '/vip-pujas' },
      { label: 'Chadhawa', href: '/chadhawa' },
      { label: 'Astrology', href: '/astro' },
    ],
  },
  {
    title: 'Explore',
    links: [
      { label: 'Temples', href: '/temples' },
      { label: 'Gallery', href: '/gallery' },
      { label: 'Events', href: '/events' },
      { label: 'Blog', href: '/blog' },
      { label: 'Products', href: '/products' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About Us', href: '/about' },
      { label: 'Contact', href: '/contact' },
      { label: 'Support', href: '/support' },
      { label: 'FAQ', href: '/faq' },
      { label: 'Careers', href: '/careers' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Terms of Service', href: '/terms' },
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Refund Policy', href: '/refunds' },
      { label: 'Shipping Policy', href: '/shipping' },
      { label: 'Sitemap', href: '/sitemap' },
    ],
  },
]

interface FooterProps {
  mapUrl?: string
}

export function Footer({ mapUrl }: FooterProps) {
  return (
    <footer className="border-t border-border/60 bg-muted/30">
      <div className="container py-14">
        <div className="grid gap-10 lg:grid-cols-6">
          <div className="lg:col-span-2">
            <Logo />
            <p className="mt-4 text-sm text-slate-600 dark:text-slate-400 max-w-sm">
              {siteConfig.description}
            </p>
            
            {/* Newsletter Subscription */}
            <div className="mt-6 bg-white dark:bg-slate-900 p-4 rounded-2xl border shadow-sm">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-2">Subscribe to our Newsletter</h4>
              <form 
                onSubmit={async (e) => {
                  e.preventDefault()
                  const email = (e.target as any).email.value
                  if(!email) return
                  try {
                    const res = await fetch('/api/newsletter', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email }) })
                    const data = await res.json()
                    if(data.ok) {
                      alert('Successfully subscribed!')
                      ;(e.target as HTMLFormElement).reset()
                    } else {
                      alert(data.error || 'Subscription failed')
                    }
                  } catch (err) {
                    alert('Network error')
                  }
                }}
                className="flex gap-2"
              >
                <input type="email" name="email" placeholder="Enter your email" required className="flex-1 rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" />
                <button type="submit" className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-xl text-sm font-bold transition-colors">Subscribe</button>
              </form>
            </div>

            <div className="mt-6 space-y-2 text-sm text-slate-600 dark:text-slate-400">
              <div className="flex items-center gap-2"><Mail className="h-4 w-4" /> {siteConfig.contact.email}</div>
              <div className="flex items-center gap-2"><Phone className="h-4 w-4" /> {siteConfig.contact.phone}</div>
            </div>
            <div className="mt-5 flex items-center gap-3">
              <a href={siteConfig.socials.facebook} className="text-muted-foreground hover:text-primary"><Facebook className="h-5 w-5" /></a>
              <a href={siteConfig.socials.instagram} className="text-muted-foreground hover:text-primary"><Instagram className="h-5 w-5" /></a>
              <a href={siteConfig.socials.youtube} className="text-muted-foreground hover:text-primary"><Youtube className="h-5 w-5" /></a>
              <a href={siteConfig.socials.twitter} className="text-muted-foreground hover:text-primary"><Twitter className="h-5 w-5" /></a>
            </div>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="text-sm font-semibold mb-3">{col.title}</h4>
              <ul className="space-y-2">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="text-sm text-muted-foreground hover:text-primary">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Dynamic Google Map Section */}
        {mapUrl && (
          <div className="mt-10 rounded-3xl overflow-hidden border shadow-sm h-64 md:h-80 w-full relative">
            <iframe
              src={mapUrl}
              className="absolute inset-0 w-full h-full border-0"
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        )}

        <div className="mt-10 pt-6 border-t border-border/60 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} DivyaYagyam. All rights reserved. • हरि ओम् 🙏
          </p>
          <p className="text-xs text-muted-foreground">Made with devotion in India 🇮🇳</p>
        </div>
      </div>
    </footer>
  )
}
