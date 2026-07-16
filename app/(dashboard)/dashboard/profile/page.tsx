'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { User as UserIcon, Mail, Phone, Calendar, Loader2, Save } from 'lucide-react'
import { toast } from 'sonner'

export default function ProfilePage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [memberSince, setMemberSince] = useState('')

  useEffect(() => {
    async function loadProfile() {
      try {
        const res = await fetch('/api/profile')
        const data = await res.json()
        if (data.ok && data.user) {
          setFullName(data.user.fullName || '')
          setPhone(data.user.phone || '')
          setEmail(data.user.email || '')
          setMemberSince(data.user.createdAt || '')
        } else {
          toast.error('Failed to load profile details')
        }
      } catch {
        toast.error('Network error loading profile')
      } finally {
        setLoading(false)
      }
    }
    loadProfile()
  }, [])

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    try {
      const res = await fetch('/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName, phone }),
      })
      const data = await res.json()
      if (data.ok) {
        toast.success('Profile updated successfully!')
      } else {
        toast.error(data.error || 'Failed to update profile')
      }
    } catch {
      toast.error('Network error updating profile')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">My Profile</h1>
        <p className="text-muted-foreground text-sm">Manage your personal information and contact details.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Edit Profile</CardTitle>
          <CardDescription>Update your personal information and phone number.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUpdate} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName" className="flex items-center gap-1.5">
                <UserIcon className="h-4 w-4 text-muted-foreground" /> Full Name
              </Label>
              <Input
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Enter your full name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-1.5 text-muted-foreground">
                <Mail className="h-4 w-4" /> Email Address (Read-only)
              </Label>
              <Input
                id="email"
                value={email}
                disabled
                className="bg-muted/50 cursor-not-allowed"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="flex items-center gap-1.5">
                <Phone className="h-4 w-4 text-muted-foreground" /> Phone Number
              </Label>
              <Input
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g. +91 9999999999"
              />
            </div>

            {memberSince && (
              <div className="flex items-center gap-2 p-3 rounded-md bg-muted/20 text-xs text-muted-foreground">
                <Calendar className="h-4 w-4 text-primary" />
                <span>
                  Member since:{' '}
                  {new Date(memberSince).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </span>
              </div>
            )}

            <Button type="submit" disabled={saving} className="w-full sm:w-auto">
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving…
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" /> Save Changes
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
