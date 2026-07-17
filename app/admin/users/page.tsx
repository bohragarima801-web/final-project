'use client'

import { useEffect, useState } from 'react'
import { PageHeader } from '@/components/admin/page-header'
import { AdminTabs } from '@/components/admin/admin-tabs'
import { DataTableShell } from '@/components/admin/data-table-shell'
import { KpiCard } from '@/components/admin/kpi-card'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Users, UserCheck, Star, HeartHandshake, Loader2, Plus, Edit2, Trash2 } from 'lucide-react'
import { toast } from 'sonner'

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [acting, setActing] = useState(false)
  const [activeTab, setActiveTab] = useState('')

  // Form states
  const [showAddForm, setShowAddForm] = useState(false)
  const [actionType, setActionType] = useState<'create' | 'edit' | null>(null)
  const [activeUser, setActiveUser] = useState<any>(null)

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [roleSlug, setRoleSlug] = useState('devotee')
  const [password, setPassword] = useState('')

  async function loadUsers() {
    try {
      const res = await fetch('/api/admin/users')
      const data = await res.json()
      if (data.ok) {
        setUsers(data.data || [])
      }
    } catch {
      toast.error('Failed to load user records')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadUsers()
  }, [])

  function startCreate() {
    setActiveUser(null)
    setActionType('create')
    setName('')
    setEmail('')
    setPhone('')
    setRoleSlug('devotee')
    setPassword('')
    setShowAddForm(true)
  }

  function startEdit(user: any) {
    setActiveUser(user)
    setActionType('edit')
    setName(user.name)
    setEmail(user.email)
    setPhone(user.phone === 'N/A' ? '' : user.phone)
    setRoleSlug(user.roleSlug || 'devotee')
    setShowAddForm(true)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setActing(true)

    try {
      const payload: Record<string, any> = {
        action: actionType,
        name,
        email,
        phone,
        roleSlug,
      }

      if (actionType === 'create') {
        payload.newPassword = password
      } else if (actionType === 'edit') {
        payload.userId = activeUser.id
      }

      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (data.ok) {
        toast.success(data.message || 'Operation complete!')
        setShowAddForm(false)
        setActionType(null)
        loadUsers()
      } else {
        toast.error(data.error || 'Failed to complete')
      }
    } catch {
      toast.error('Network error during request')
    } finally {
      setActing(false)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to permanently delete this user?')) return
    try {
      const res = await fetch(`/api/admin/users?id=${id}`, {
        method: 'DELETE',
      })
      const data = await res.json()
      if (data.ok) {
        toast.success('User deleted successfully')
        loadUsers()
      } else {
        toast.error(data.error || 'Delete failed')
      }
    } catch {
      toast.error('Network error deleting user')
    }
  }

  // Filter users by active tab
  const filteredUsers = users.filter((u) => {
    if (!activeTab) return true
    if (activeTab === 'customers') return u.roleSlug === 'devotee'
    if (activeTab === 'admins') return u.roleSlug === 'admin'
    if (activeTab === 'pandits') return u.roleSlug === 'pandit'
    if (activeTab === 'volunteers') return u.roleSlug === 'volunteer'
    return true
  })

  // KPI calculations
  const totalCount = users.length
  const customerCount = users.filter((u) => u.roleSlug === 'devotee').length
  const panditCount = users.filter((u) => u.roleSlug === 'pandit').length

  return (
    <div className="space-y-6">
      <PageHeader
        title="User Management"
        description="Manage all administrative roles, verified pandits, and devotee user accounts."
        breadcrumbs={[{ label: 'Admin', href: '/admin' }, { label: 'Users' }]}
        action={{
          label: showAddForm ? 'Cancel' : 'Add User',
          icon: Plus,
          onClick: showAddForm ? () => setShowAddForm(false) : startCreate,
        }}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard title="Total Users" value={totalCount.toString()} icon={Users} />
        <KpiCard title="Customers" value={customerCount.toString()} icon={HeartHandshake} />
        <KpiCard title="Pandits" value={panditCount.toString()} icon={Star} />
        <KpiCard title="Verified" value={totalCount.toString()} icon={UserCheck} />
      </div>

      {showAddForm && (actionType === 'create' || actionType === 'edit') && (
        <Card className="border-2 border-primary/20">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              {actionType === 'create' ? <Plus className="h-5 w-5 text-primary" /> : <Edit2 className="h-5 w-5 text-primary" />}
              {actionType === 'create' ? 'Create New User Account' : 'Edit User Profile Details'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2 max-w-2xl">
              <div className="space-y-2">
                <Label htmlFor="usrName">Full Name *</Label>
                <Input id="usrName" value={name} onChange={(e) => setName(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="usrEmail">Email Address *</Label>
                <Input id="usrEmail" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="usrPhone">Phone / WhatsApp Number</Label>
                <Input id="usrPhone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="e.g. +919999999999" />
              </div>
              <div className="space-y-2">
                <Label>System Role *</Label>
                <Select value={roleSlug} onValueChange={setRoleSlug}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="devotee">Devotee (Customer)</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="pandit">Pandit (Priest)</SelectItem>
                    <SelectItem value="volunteer">Volunteer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {actionType === 'create' && (
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="usrPass">Account Password *</Label>
                  <Input id="usrPass" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} placeholder="Minimum 6 characters" />
                </div>
              )}
              <div className="sm:col-span-2 pt-2">
                <Button type="submit" disabled={acting}>
                  {acting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {actionType === 'create' ? 'Register User' : 'Save Profile Changes'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <AdminTabs
        tabs={[
          { label: 'All', value: '' },
          { label: 'Customers', value: 'customers' },
          { label: 'Admins', value: 'admins' },
          { label: 'Pandits', value: 'pandits' },
          { label: 'Volunteers', value: 'volunteers' },
        ]}
        value={activeTab}
        onChange={setActiveTab}
      />

      {loading ? (
        <div className="flex h-48 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <DataTableShell
          columns={[
            { key: 'name', label: 'Name' },
            { key: 'email', label: 'Email' },
            { key: 'phone', label: 'Phone' },
            {
              key: 'role',
              label: 'Role',
              render: (r) => (
                <Badge variant={r.roleSlug === 'admin' ? 'default' : r.roleSlug === 'pandit' ? 'success' : 'secondary'}>
                  {r.role}
                </Badge>
              ),
            },
            { key: 'status', label: 'Status' },
            { key: 'createdAt', label: 'Joined' },
            {
              key: 'actions',
              label: 'Actions',
              render: (r) => (
                <div className="flex items-center gap-1.5">
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8 px-2 text-xs flex gap-1"
                    onClick={() => startEdit(r)}
                  >
                    <Edit2 className="h-3 w-3" /> Edit
                  </Button>
                  <Button
                    size="icon"
                    variant="destructive"
                    className="h-8 w-8"
                    onClick={() => handleDelete(r.id)}
                    title="Delete User"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              ),
            },
          ]}
          rows={filteredUsers}
          searchPlaceholder="Search by name, email or phone…"
        />
      )}
    </div>
  )
}
