import Link from 'next/link'
import { cn } from '@/lib/utils'

export function Logo({ className, showText = true }: { className?: string; showText?: boolean }) {
  return (
    <Link href="/" className={cn('flex items-center gap-2 group', className)}>
      <div className="relative flex h-10 w-10 items-center justify-center rounded-full om-gradient shadow-md group-hover:scale-105 transition-transform">
        <span className="text-white text-xl font-bold" style={{ fontFamily: 'serif' }}>ॐ</span>
      </div>
      {showText && (
        <div className="flex flex-col leading-none">
          <span className="text-lg font-bold text-om-gradient">Devyajnam</span>
          <span className="text-[10px] text-muted-foreground tracking-wider uppercase">Sanatan Seva</span>
        </div>
      )}
    </Link>
  )
}
