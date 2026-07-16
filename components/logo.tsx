'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

export function Logo({ className, showText = true }: { className?: string; showText?: boolean }) {
  const [logoUrl, setLogoUrl] = useState('')
  const [siteName, setSiteName] = useState('Devyajnam')

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
        <div className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-full shadow-md group-hover:scale-105 transition-transform bg-white border">
          <img src={logoUrl} alt="Logo" className="h-full w-full object-contain" />
        </div>
      ) : (
        <div className="relative flex h-10 w-10 items-center justify-center rounded-full om-gradient shadow-md group-hover:scale-105 transition-transform">
          <span className="text-white text-xl font-bold" style={{ fontFamily: 'serif' }}>ॐ</span>
        </div>
      )}
      {showText && (
        <div className="flex flex-col leading-none">
          <span className="text-lg font-bold text-om-gradient">{siteName}</span>
          <span className="text-[10px] text-muted-foreground tracking-wider uppercase">Sanatan Seva</span>
        </div>
      )}
    </Link>
  )
}
