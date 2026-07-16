import { AdminSidebar } from '@/components/layouts/admin-sidebar'
import { getAdminSession } from '@/lib/admin-session'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { ThemeToggle } from '@/components/theme-toggle'
import { Button } from '@/components/ui/button'
import { Bell, Search, LogOut } from 'lucide-react'
import { Input } from '@/components/ui/input'

export const dynamic = 'force-dynamic'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const h = await headers()
  // Retrieve the pathname from various standard and custom headers to be fully compatible with Vercel and local environments
  const pathname = (
    h.get('x-pathname') || 
    h.get('x-invoke-path') || 
    h.get('x-matched-path') || 
    h.get('x-forwarded-uri') ||
    h.get('x-original-url') ||
    ''
  )
  const referer = h.get('referer') || ''

  console.log(`[DEBUG AdminLayout] Pathname check: x-pathname="${h.get('x-pathname')}", x-invoke-path="${h.get('x-invoke-path')}", x-matched-path="${h.get('x-matched-path')}", resolved pathname="${pathname}", referer="${referer}"`)

  // Check if we are on the login page using multiple extremely reliable matches
  const isLoginPage = 
    pathname === '/admin/login' || 
    pathname.startsWith('/admin/login/') ||
    pathname.toLowerCase().includes('/admin/login') ||
    pathname.includes('login') ||
    referer.toLowerCase().includes('/admin/login')

  // Login page: render bare (no sidebar, no auth check)
  if (isLoginPage) {
    console.log('[DEBUG AdminLayout] Rendering login page bare, skipping authentication and redirect.')
    return <>{children}</>
  }

  console.log('[DEBUG AdminLayout] Fetching session...')
  const session = await getAdminSession()
  if (!session) {
    console.warn('[DEBUG AdminLayout] No active session found. Redirecting to /admin/login')
    redirect('/admin/login')
  }

  return (
    <div className="min-h-screen flex bg-muted/20">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b border-border/60 bg-background flex items-center justify-between px-6 sticky top-0 z-10 gap-4">
          <div className="relative hidden md:block flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search anything… (Ctrl+K)" className="pl-9 h-9 bg-muted/40" />
          </div>
          <div className="flex items-center gap-2">
            <Button size="icon" variant="ghost" aria-label="Notifications"><Bell className="h-4 w-4" /></Button>
            <ThemeToggle />
            <div className="flex items-center gap-2 pl-2 border-l ml-1">
              <div className="h-8 w-8 rounded-full om-gradient flex items-center justify-center text-white text-xs font-bold">
                {session.email.charAt(0).toUpperCase()}
              </div>
              <div className="hidden lg:flex flex-col leading-none">
                <span className="text-xs font-medium">{session.email}</span>
                <span className="text-[10px] text-muted-foreground">super_admin</span>
              </div>
              <form action="/api/admin/logout" method="post">
                <Button type="submit" size="icon" variant="ghost" aria-label="Logout" title="Logout">
                  <LogOut className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </div>
        </header>
        <main className="flex-1 p-6 lg:p-8 min-w-0 overflow-x-auto">{children}</main>
      </div>
    </div>
  )
}
