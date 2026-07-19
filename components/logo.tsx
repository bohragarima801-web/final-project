'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

export function Logo({ className, showText = true }: { className?: string; showText?: boolean }) {
  const [logoUrl, setLogoUrl] = useState('/logo.jpg')
  const [siteName, setSiteName] = useState('दिव्ययज्ञम्')

  useEffect(() => {
    fetch('/api/customizer')
      .then((r) => r.json())
      .then((j) => {
        if (j?.ok && j.data?.theme) {
          if (j.data.theme['site.logo']) setLogoUrl(j.data.theme['site.logo'])
          if (j.data.theme['site.name']) setSiteName(j.data.theme['site.name'])
        }
      })
      .catch(() => {})
  }, [])

  return (
    <Link href="/" className={cn('flex items-center gap-2 group', className)}>
      {logoUrl ? (
        <div className="relative flex h-11 w-11 items-center justify-center overflow-hidden rounded-xl shadow-md border border-amber-200/60 bg-white group-hover:scale-105 transition-transform">
          <img src={logoUrl} alt="Logo" className="h-full w-full object-cover" />
        </div>
      ) : (
        <div className="relative flex h-11 w-11 items-center justify-center rounded-xl om-gradient shadow-md group-hover:scale-105 transition-transform">
          <span className="text-white text-xl font-bold" style={{ fontFamily: 'serif' }}>ॐ</span>
        </div>
      )}
      {showText && (
        <div className="flex flex-col justify-center -space-y-0.5 leading-none">
          <span className="text-[15px] font-black text-om-gradient tracking-wide" style={{ fontFamily: "'Outfit', 'Noto Sans Devanagari', sans-serif" }}>
            {siteName}
          </span>
          <span className="text-[9px] text-slate-500 font-semibold tracking-widest uppercase">
            Sanatan Seva
          </span>
        </div>
      )}
    </Link>
  )
}
