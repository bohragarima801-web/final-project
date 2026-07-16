import { prisma } from '@/lib/prisma'

export async function ensureDefaultCategoriesAndTemples() {
  try {
    // 1. Ensure Puja Categories exist
    const defaultPujaCats = [
      { id: 'shiva', name: 'Shiva Pujas', slug: 'shiva', description: 'Sacred rituals dedicated to Lord Shiva' },
      { id: 'devi', name: 'Devi Pujas', slug: 'devi', description: 'Shakti and Durga Puja rituals' },
      { id: 'vishnu', name: 'Vishnu Pujas', slug: 'vishnu', description: 'Rituals dedicated to Lord Vishnu, Laxmi, and Krishna' },
      { id: 'ganesh', name: 'Ganesh Pujas', slug: 'ganesh', description: 'Obstacle-removing pujas for Lord Ganesha' },
      { id: 'navagraha', name: 'Navagraha', slug: 'navagraha', description: 'Planetary peace and dosha shanti pujas' }
    ]

    for (const cat of defaultPujaCats) {
      const existing = await prisma.pujaCategory.findUnique({ where: { slug: cat.slug } })
      if (!existing) {
        await prisma.pujaCategory.create({
          data: {
            id: cat.id,
            name: cat.name,
            slug: cat.slug,
            description: cat.description,
            isActive: true
          }
        })
      }
    }

    // 2. Ensure Product Categories exist
    const defaultProductCats = [
      { id: 'prasad', name: 'Prasad', slug: 'prasad', description: 'Holy offerings and dry fruits prasad' },
      { id: 'rudraksha', name: 'Rudraksha', slug: 'rudraksha', description: 'Authentic Himalayan rudraksha beads and malas' },
      { id: 'idols', name: 'Idols', slug: 'idols', description: 'Beautiful brass and marble deities' },
      { id: 'books', name: 'Spiritual Books', slug: 'books', description: 'Bhagavad Gita, Puranas, and chalisa books' }
    ]

    for (const cat of defaultProductCats) {
      const existing = await prisma.productCategory.findUnique({ where: { slug: cat.slug } })
      if (!existing) {
        await prisma.productCategory.create({
          data: {
            id: cat.id,
            name: cat.name,
            slug: cat.slug,
            description: cat.description,
            isActive: true
          }
        })
      }
    }

    // 3. Ensure Temples exist
    const defaultTemples = [
      { id: 'kashi', name: 'Kashi Vishwanath', slug: 'kashi', deity: 'Shiva', city: 'Varanasi', state: 'Uttar Pradesh', address: 'Lahori Tola, Varanasi', isFeatured: true },
      { id: 'somnath', name: 'Somnath Temple', slug: 'somnath', deity: 'Shiva', city: 'Veraval', state: 'Gujarat', address: 'Prabhas Patan, Somnath', isFeatured: true },
      { id: 'baidyanath', name: 'Baidyanath Dham', slug: 'baidyanath', deity: 'Shiva', city: 'Deoghar', state: 'Jharkhand', address: 'Deoghar Sadar, Deoghar', isFeatured: false },
      { id: 'mahakal', name: 'Ujjain Mahakal', slug: 'mahakal', deity: 'Shiva', city: 'Ujjain', state: 'Madhya Pradesh', address: 'Jaisinghpura, Ujjain', isFeatured: true }
    ]

    for (const t of defaultTemples) {
      const existing = await prisma.temple.findUnique({ where: { slug: t.slug } })
      if (!existing) {
        await prisma.temple.create({
          data: {
            id: t.id,
            name: t.name,
            slug: t.slug,
            deity: t.deity,
            city: t.city,
            state: t.state,
            address: t.address,
            isFeatured: t.isFeatured,
            isActive: true
          }
        })
      }
    }

    console.log('[DEBUG DataDefaults] Successfully initialized categories and temples.')
  } catch (error) {
    console.error('[DEBUG DataDefaults] Error initializing defaults:', error)
  }
}
