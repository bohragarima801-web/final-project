const getSafeUrl = () => {
  const envUrl = process.env.NEXT_PUBLIC_APP_URL
  if (envUrl && (envUrl.startsWith('http://') || envUrl.startsWith('https://'))) {
    try {
      new URL(envUrl)
      return envUrl
    } catch (_) {
      // Ignore invalid URLs
    }
  }
  return 'https://devyajnam.com'
}

export const siteConfig = {
  name: 'दिव्ययज्ञम्',
  tagline: 'दिव्ययज्ञम् — Sanatan Seva Online',
  description:
    'Book online pujas, offer chadhawa, donate to temples, order abhimantrit prasad, and access astrology services — all in one sacred platform.',
  url: getSafeUrl(),
  ogImage: '/og.jpg',
  keywords: [
    'दिव्ययज्ञम्', 'Devyajnam', 'Online Puja', 'VIP Puja', 'Temple Booking', 'Sanatan',
    'Prasad', 'Donation', 'Chadhawa', 'Astrology', 'Kundali',
  ],
  contact: {
    email: 'seva@devyajnam.com',
    phone: '+91-99999-99999',
    whatsapp: '+91-99999-99999',
  },
  socials: {
    facebook: '#',
    instagram: '#',
    youtube: '#',
    twitter: '#',
  },
}

export type SiteConfig = typeof siteConfig
