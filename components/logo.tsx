import Link from 'next/link'
import { cn } from '@/lib/utils'

export function Logo({ 
  className, 
  showText = true,
  logoUrl,
  siteName,
  tagline
}: { 
  className?: string; 
  showText?: boolean;
  logoUrl?: string;
  siteName?: string;
  tagline?: string;
}) {
  const displayTitle = siteName || 'दिव्ययज्ञम्'
  const displayTagline = tagline || 'Sanatan Seva'

  return (
    <Link href="/" className={cn('flex items-center gap-2 group', className)}>
      {logoUrl ? (
        <img 
          src={logoUrl} 
          alt={displayTitle} 
          className="h-10 w-10 rounded-full object-cover border border-amber-200 shadow-md group-hover:scale-105 transition-transform" 
        />
      ) : (
        <div className="relative flex h-10 w-10 items-center justify-center rounded-full om-gradient shadow-md group-hover:scale-105 transition-transform">
          <span className="text-white text-xl font-bold" style={{ fontFamily: 'serif' }}>ॐ</span>
        </div>
      )}
      {showText && (
        <div className="flex flex-col leading-none">
          <span className="text-lg font-bold text-om-gradient">{displayTitle}</span>
          <span className="text-[10px] text-muted-foreground tracking-wider uppercase">{displayTagline}</span>
        </div>
      )}
    </Link>
  )
}
