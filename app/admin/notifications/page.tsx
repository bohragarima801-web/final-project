'use client'

import { useEffect, useState } from 'react'
import { PageHeader } from '@/components/admin/page-header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { Loader2, Send } from 'lucide-react'

export default function NotificationsPage() {
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [notifications, setNotifications] = useState<any[]>([])
  const [users, setUsers] = useState<any[]>([])

  // Form states
  const [title, setTitle] = useState('')
  const [message, setMessage] = useState('')
  const [userId, setUserId] = useState('')
  const [type, setType] = useState('BOOKING')

  const loadData = async () => {
    try {
      setLoading(true)
      const [resN, resU] = await Promise.all([
        fetch('/api/admin/notifications'),
        fetch('/api/admin/users')
      ])
      const jsonN = await resN.json()
      const jsonU = await resU.json()

      if (jsonN.ok) setNotifications(jsonN.data || [])
      if (jsonU.ok) {
        setUsers(jsonU.data || [])
        if (jsonU.data && jsonU.data.length > 0) {
          setUserId(jsonU.data[0].id)
        }
      }
    } catch (err) {
      console.error('Failed to load notifications page data:', err)
      toast.error('Network error loading data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title || !message || !userId) {
      toast.error('Title, Message, and Targeted User are required!')
      return
    }

    try {
      setSending(true)
      const res = await fetch('/api/admin/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          message,
          userId,
          type,
          isRead: false
        })
      })
      const json = await res.json()
      if (json.ok) {
        toast.success('Notification dispatched successfully!')
        setTitle('')
        setMessage('')
        // Refresh list
        setNotifications(prev => [json.data, ...prev])
      } else {
        toast.error(json.error || 'Failed to dispatch notification')
      }
    } catch (err) {
      toast.error('Network error dispatching notification')
    } finally {
      setSending(false)
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] gap-2">
        <Loader2 className="h-8 w-8 text-amber-500 animate-spin" />
        <p className="text-sm text-muted-foreground">Loading notifications manager…</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <PageHeader 
        title="In-App Notifications Manager" 
        description="Dispatch critical ritual schedules, transaction receipts, or direct notifications to devotee dashboards."
        breadcrumbs={[{ label: 'Admin', href: '/admin' }, { label: 'Notifications' }]} 
      />

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Compose Notification */}
        <Card className="border border-border/60 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base font-bold">Compose Custom Alert</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSend} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="target-user">Targeted Customer / Devotee</Label>
                <select
                  id="target-user"
                  className="w-full bg-background border border-border rounded px-3 py-2 text-sm outline-none"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  required
                >
                  <option value="" disabled>Select User...</option>
                  {users.map(u => (
                    <option key={u.id} value={u.id}>
                      {u.fullName || u.email} ({u.email})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="notify-type">Notification Category</Label>
                <select
                  id="notify-type"
                  className="w-full bg-background border border-border rounded px-3 py-2 text-sm outline-none"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                >
                  <option value="BOOKING">BOOKING</option>
                  <option value="ORDER">ORDER</option>
                  <option value="PAYMENT">PAYMENT</option>
                  <option value="DONATION">DONATION</option>
                  <option value="SUPPORT">SUPPORT</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="notif-title">Notification Title</Label>
                <Input 
                  id="notif-title"
                  placeholder="e.g., 🗓️ Sawan Somvar Puja Starting Soon" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="notif-msg">Body Message</Label>
                <Textarea 
                  id="notif-msg"
                  rows={4} 
                  placeholder="Book your sankalp before the ritual begins..." 
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                />
              </div>

              <Button 
                type="submit" 
                className="w-full bg-amber-500 hover:bg-amber-600 font-semibold"
                disabled={sending}
              >
                {sending ? 'Dispatching…' : (
                  <>
                    <Send className="h-4 w-4 mr-2" /> Send In-App Notification
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Recent Sends */}
        <Card className="border border-border/60 shadow-sm overflow-hidden">
          <CardHeader className="border-b border-border/50 bg-background/50">
            <CardTitle className="text-base font-bold">Recent Dispatches</CardTitle>
          </CardHeader>
          <CardContent className="p-0 divide-y max-h-[500px] overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-sm text-muted-foreground">
                No notifications logged in the database yet.
              </div>
            ) : (
              notifications.map((n) => (
                <div key={n.id} className="p-4 hover:bg-muted/10 transition-colors">
                  <div className="flex items-center justify-between mb-1">
                    <Badge variant="outline" className="text-[10px] font-bold border-none bg-muted text-foreground">
                      {n.type}
                    </Badge>
                    <span className="text-[10px] text-muted-foreground font-mono">
                      {new Date(n.createdAt).toLocaleDateString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <h4 className="font-semibold text-sm text-foreground mb-0.5">{n.title}</h4>
                  <p className="text-xs text-muted-foreground line-clamp-2">{n.message}</p>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
