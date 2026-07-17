'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'
import { Loader2, ShieldCheck, ArrowLeft } from 'lucide-react'

export default function AdminLoginPage() {
  const router = useRouter()
  const params = useSearchParams()
  const [email, setEmail] = useState('admin@devyajnam.com')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()
      if (!res.ok || !data.ok) throw new Error(data?.error || 'Login failed')
      toast.success('🌼 स्वागतम! Welcome Admin')
      router.push(params.get('redirect') || '/admin')
      router.refresh()
    } catch (err: any) {
      toast.error(err?.message || 'Login failed')
    } finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-primary/5 via-background to-accent/10">
      <div className="absolute top-6 left-6">
        <Link href="/" className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1">
          <ArrowLeft className="h-3 w-3" /> Back to site
        </Link>
      </div>

      <Card className="w-full max-w-md shadow-2xl border-2 border-primary/20">
        <CardHeader className="text-center pb-4">
          <div className="mx-auto h-16 w-16 rounded-2xl om-gradient flex items-center justify-center mb-3 shadow-lg">
            <ShieldCheck className="h-8 w-8 text-white" />
          </div>
          <CardTitle className="text-2xl">Devyajnam Admin</CardTitle>
          <CardDescription>Sanatan Seva Control Center</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@devyajnam.com"
                required
                autoComplete="email"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                autoComplete="current-password"
              />
            </div>
            <Button type="submit" className="w-full h-11" disabled={loading}>
              {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Signing in…</> : '🔐 Sign in to Admin Panel'}
            </Button>
          </form>

          <div className="mt-6 p-3 rounded-lg bg-muted/50 border border-dashed">
            <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">Default Credentials</p>
            <div className="mt-2 text-xs space-y-1 font-mono">
              <div>Email: <code className="bg-background px-1.5 py-0.5 rounded">admin@devyajnam.com</code></div>
              <div>Password: <code className="bg-background px-1.5 py-0.5 rounded">Admin@12345</code></div>
            </div>
            <p className="mt-2 text-[10px] text-muted-foreground">⚠️ Change these in <code>.env</code> for production (ADMIN_EMAIL / ADMIN_PASSWORD)</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
