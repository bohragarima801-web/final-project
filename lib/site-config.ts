export const siteConfig = {
  name: 'Divyayagyam',
  tagline: 'दिव्ययज्ञम् — सनातन सेवा',
  description:
    'Book online pujas, offer chadhawa, donate to temples, order abhimantrit prasad, and access astrology services — all in one sacred platform.',
  url: process.env.NEXT_PUBLIC_APP_URL || 'https://divyayagyam.com',
  ogImage: '/og.jpg',
  keywords: [
    'Devyajnam', 'Online Puja', 'VIP Puja', 'Temple Booking', 'Sanatan',
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
