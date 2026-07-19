// Complete admin sidebar with Customizer added
import {
  LayoutDashboard, BarChart3, Users, Star, HeartHandshake,
  Building2, Flame, Ticket, ShoppingBag, HandCoins, Sparkles, Sparkle,
  Newspaper, ImageIcon, MessageSquare, Bell, Megaphone, LineChart,
  Palette, Search, CreditCard, HardDrive, Settings, Lock, DatabaseBackup,
  Code2, Bot, FileText, Package, ClipboardList, Layers, CalendarDays, Wand2,
} from 'lucide-react'

export type AdminNavItem = { title: string; href: string; icon?: any; badge?: string | number }
export type AdminNavSection = { title: string; icon: any; slug: string; href?: string; items?: AdminNavItem[] }

export const ADMIN_NAV: AdminNavSection[] = [
  { title: 'Dashboard', slug: 'dashboard', icon: LayoutDashboard, href: '/admin' },
  { title: 'Analytics', slug: 'analytics', icon: LineChart, href: '/admin/analytics' },
  { title: 'User Management', slug: 'users', icon: Users, items: [
    { title: 'All Users', href: '/admin/users' }, { title: 'Customers', href: '/admin/customers' },
    { title: 'Admins', href: '/admin/users?tab=admins' }, { title: 'Pandits', href: '/admin/users?tab=pandits' },
    { title: 'Volunteers', href: '/admin/users?tab=volunteers' }, { title: 'Roles', href: '/admin/users/roles' },
    { title: 'Permissions', href: '/admin/users/permissions' }, { title: 'Login History', href: '/admin/users/activity' },
  ]},
  { title: 'Temple Management', slug: 'temples', icon: Building2, items: [
    { title: 'All Temples', href: '/admin/temples' }, { title: 'Add Temple', href: '/admin/temples/new' },
    { title: 'Categories', href: '/admin/temples?tab=categories' }, { title: 'Gallery', href: '/admin/temples?tab=gallery' },
    { title: 'Videos', href: '/admin/temples?tab=videos' }, { title: 'Events', href: '/admin/temples?tab=events' },
  ]},
  { title: 'Puja Management', slug: 'pujas', icon: Flame, items: [
    { title: 'All Pujas', href: '/admin/pujas' }, { title: 'Add Puja', href: '/admin/pujas/new' },
    { title: 'Categories', href: '/admin/pujas/categories' }, { title: 'Featured', href: '/admin/pujas?tab=featured' },
    { title: 'VIP Pujas', href: '/admin/pujas?tab=vip' }, { title: 'Upcoming', href: '/admin/pujas?tab=upcoming' },
    { title: 'Live', href: '/admin/pujas?tab=live' }, { title: 'Time Slots', href: '/admin/pujas/slots' },
  ]},
  { title: 'Bookings', slug: 'bookings', icon: Ticket, items: [
    { title: 'All', href: '/admin/bookings' }, { title: 'Pending', href: '/admin/bookings?tab=pending' },
    { title: 'Confirmed', href: '/admin/bookings?tab=confirmed' }, { title: 'Completed', href: '/admin/bookings?tab=completed' },
    { title: 'Cancelled', href: '/admin/bookings?tab=cancelled' }, { title: 'Refund Requests', href: '/admin/bookings?tab=refunds' },
  ]},
  { title: 'Customers', slug: 'customers', icon: HeartHandshake, href: '/admin/customers' },
  { title: 'Products', slug: 'products', icon: ShoppingBag, items: [
    { title: 'All Products', href: '/admin/products' }, { title: 'Add Product', href: '/admin/products/new' },
    { title: 'Categories', href: '/admin/products/categories' }, { title: 'Inventory', href: '/admin/products/inventory' },
    { title: 'Reviews', href: '/admin/products?tab=reviews' }, { title: 'Coupons', href: '/admin/marketing/coupons' },
  ]},
  { title: 'Orders', slug: 'orders', icon: Package, items: [
    { title: 'All', href: '/admin/orders' }, { title: 'Pending', href: '/admin/orders?tab=pending' },
    { title: 'Processing', href: '/admin/orders?tab=processing' }, { title: 'Shipped', href: '/admin/orders?tab=shipped' },
    { title: 'Delivered', href: '/admin/orders?tab=delivered' }, { title: 'Cancelled', href: '/admin/orders?tab=cancelled' },
    { title: 'Returned', href: '/admin/orders?tab=returned' }, { title: 'Refunds', href: '/admin/orders?tab=refunds' },
  ]},

  { title: 'Chadhawa', slug: 'chadhawa', icon: Sparkles, items: [
    { title: 'All', href: '/admin/chadhawa' }, { title: 'Flowers', href: '/admin/chadhawa?tab=flowers' },
    { title: 'Prasad', href: '/admin/chadhawa?tab=prasad' }, { title: 'Bhog', href: '/admin/chadhawa?tab=bhog' },
    { title: 'Deep Daan', href: '/admin/chadhawa?tab=deep-daan' }, { title: 'Gau Seva', href: '/admin/chadhawa?tab=gau-seva' },
  ]},
  { title: 'Astrology', slug: 'astrology', icon: Sparkle, items: [
    { title: 'All Reports', href: '/admin/astrology' }, { title: 'Manage Tools', href: '/admin/tools' }, { title: 'Kundali', href: '/admin/astrology?tab=kundali' },
    { title: 'Milan', href: '/admin/astrology?tab=milan' }, { title: 'Numerology', href: '/admin/astrology?tab=numerology' },
    { title: 'Ratna', href: '/admin/astrology?tab=ratna' }, { title: 'Astrologers', href: '/admin/astrology?tab=astrologers' },
  ]},
  { title: 'Blog & CMS', slug: 'blog', icon: Newspaper, items: [
    { title: 'All Posts', href: '/admin/blog' }, { title: 'Add New', href: '/admin/blog/new' },
    { title: 'Categories', href: '/admin/blog/categories' }, { title: 'Comments', href: '/admin/blog/comments' },
  ]},
  { title: 'Gallery', slug: 'gallery', icon: ImageIcon, href: '/admin/gallery' },
  { title: 'Testimonials', slug: 'testimonials', icon: Star, href: '/admin/testimonials' },
  { title: 'Events', slug: 'events', icon: CalendarDays, href: '/admin/events' },
  { title: 'Media Library', slug: 'media', icon: Layers, href: '/admin/media' },
  { title: 'Support', slug: 'support', icon: MessageSquare, href: '/admin/support' },
  { title: 'Notifications', slug: 'notifications', icon: Bell, href: '/admin/notifications' },
  { title: 'Marketing', slug: 'marketing', icon: Megaphone, items: [
    { title: 'Overview', href: '/admin/marketing' }, 
    { title: 'Social Media', href: '/admin/social' },
    { title: 'Coupons', href: '/admin/marketing/coupons' },
    { title: 'Newsletter', href: '/admin/marketing/newsletter' },
  ]},
  { title: 'Reports', slug: 'reports', icon: FileText, href: '/admin/reports' },
  { title: 'CMS', slug: 'cms', icon: ClipboardList, items: [
    { title: 'Homepage', href: '/admin/cms' }, { title: 'Hero Slider', href: '/admin/cms/hero' },
    { title: 'Custom Pages', href: '/admin/cms/pages' },
  ]},
  { title: '🎨 Customizer', slug: 'customizer', icon: Wand2, items: [
    { title: 'Global CSS', href: '/admin/customizer?tab=global' },
    { title: 'Global JS', href: '/admin/customizer?tab=js' },
    { title: 'Per-Page', href: '/admin/customizer?tab=page' },
    { title: 'Live Preview', href: '/admin/customizer?tab=preview' },
  ]},
  { title: 'SEO', slug: 'seo', icon: Search, href: '/admin/seo' },
  { title: 'Payment Settings', slug: 'payments', icon: CreditCard, href: '/admin/payments' },
  { title: 'Storage', slug: 'storage', icon: HardDrive, href: '/admin/storage' },
  { title: 'Website Settings', slug: 'settings', icon: Palette, href: '/admin/settings' },
  { title: 'Security', slug: 'security', icon: Lock, href: '/admin/security' },
  { title: 'Backup', slug: 'backup', icon: DatabaseBackup, href: '/admin/backup' },
  { title: 'Developer', slug: 'developer', icon: Code2, href: '/admin/developer' },
  { title: 'AI Assistant', slug: 'ai', icon: Bot, items: [
    { title: 'AI Chat', href: '/admin/ai' }, { title: 'Content', href: '/admin/ai?tab=content' },
    { title: 'Blog', href: '/admin/ai?tab=blog' }, { title: 'SEO', href: '/admin/ai?tab=seo' },
    { title: 'Image Prompts', href: '/admin/ai?tab=image' }, { title: 'Support', href: '/admin/ai?tab=support' },
  ]},
]
