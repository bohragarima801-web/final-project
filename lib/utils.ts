import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number | string, currency = 'INR') {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(isNaN(num) ? 0 : num)
}

export function formatDate(date: Date | string, opts?: Intl.DateTimeFormatOptions) {
  const d = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    ...opts,
  }).format(d)
}

export function slugify(str: string) {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function truncate(str: string, len = 100) {
  if (!str) return ''
  return str.length > len ? str.slice(0, len).trimEnd() + '…' : str
}

export const DEFAULT_PLACEHOLDER_IMAGE = 'https://images.unsplash.com/photo-1609766418204-94aae0ecfdfc?w=400'

export function convertGoogleDriveUrl(url: string) {
  if (!url) return url
  // Match standard share links e.g. https://drive.google.com/file/d/1A2B3C/view
  const match = url.match(/\/file\/d\/([^\/]+)/)
  if (match && match[1]) {
    return `https://drive.google.com/uc?export=view&id=${match[1]}`
  }
  // Match alternative share links e.g. https://drive.google.com/open?id=1A2B3C
  const openMatch = url.match(/open\?id=([^&]+)/)
  if (openMatch && openMatch[1]) {
    return `https://drive.google.com/uc?export=view&id=${openMatch[1]}`
  }
  return url
}
