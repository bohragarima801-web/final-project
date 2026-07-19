'use client'

import { useEffect, useState } from 'react'
import { PageHeader } from '@/components/admin/page-header'
import { DataTableShell } from '@/components/admin/data-table-shell'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { ShieldAlert, ShieldCheck, Loader2, Plus, Ban, CheckCircle } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function SubAdminsPage() {
  const [admins, setAdmins] = useState<any[]>([])
  const [roles, setRoles] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // Form State
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [roleId, setRoleId] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function loadData() {
    try {
      setLoading(true)
      const res = await fetch('/api/admin/users/admins')
      const data = await res.json()
      if (data.ok) {
        setAdmins(data.admins)
        setRoles(data.roles)
      }
    } catch (err) {
      toast.error('Failed to load sub-admins')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  async function toggleStatus(id: string, currentStatus: string) {
    const newAction = currentStatus === 'SUSPENDED' ? 'activate' : 'suspend'
    const confirmMsg = newAction === 'suspend' 
      ? 'Are you sure you want to SUSPEND this admin? They will lose access immediately.'
      : 'Are you sure you want to RE-ACTIVATE this admin?'
      
    if (!confirm(confirmMsg)) return

    try {
      const res = await fetch('/api/admin/users/admins', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, action: newAction })
      })
      const data = await res.json()
      if (data.ok) {
        toast.success(`Admin ${newAction}d successfully`)
        loadData()
      } else {
        toast.error(data.error || 'Failed to update status')
      }
    } catch (err) {
      toast.error('Network error')
    }
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    if (!email || !password || !roleId) {
      toast.error('Email, password, and role are required')
      return
    }

    try {
      setIsSubmitting(true)
      const res = await fetch('/api/admin/users/admins', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, fullName, roleId })
      })
      const data = await res.json()
      if (data.ok) {
        toast.success('Sub-Admin created successfully!')
        setIsDialogOpen(false)
        setFullName('')
        setEmail('')
        setPassword('')
        setRoleId('')
        loadData()
      } else {
        toast.error(data.error || 'Failed to create sub-admin')
      }
    } catch (err) {
      toast.error('Network error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Sub-Admins"
        description="Create and manage other administrators, assign their roles, and suspend their access when needed."
        breadcrumbs={[{ label: 'Users', href: '/admin/users' }, { label: 'Sub-Admins' }]}
        action={{ 
          label: 'Create Admin', 
          icon: Plus,
          onClick: () => setIsDialogOpen(true) 
        }}
      />

      {/* CREATE ADMIN DIALOG */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Sub-Admin</DialogTitle>
            <DialogDescription>Assign a role and provide login credentials. They can change their password later.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreate} className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label>Full Name</Label>
              <Input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="e.g. Rahul Sharma" required />
            </div>
            <div className="space-y-2">
              <Label>Email Address</Label>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@domain.com" required />
            </div>
            <div className="space-y-2">
              <Label>Password</Label>
              <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required />
            </div>
            <div className="space-y-2">
              <Label>Assigned Role (Authority)</Label>
              <select 
                className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                value={roleId}
                onChange={(e) => setRoleId(e.target.value)}
                required
              >
                <option value="">-- Select Role --</option>
                {roles.map(r => (
                  <option key={r.id} value={r.id}>{r.name} ({r.slug})</option>
                ))}
              </select>
            </div>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <ShieldCheck className="h-4 w-4 mr-2" />}
              Create Administrator
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-10 w-10 animate-spin text-orange-600" />
        </div>
      ) : (
        <DataTableShell
          columns={[
            {
              key: 'name',
              label: 'Admin Details',
              render: (r) => (
                <div className="flex flex-col text-xs">
                  <span className="font-bold">{r.fullName || 'Unknown'}</span>
                  <span className="text-[10px] text-muted-foreground">{r.email}</span>
                </div>
              )
            },
            {
              key: 'role',
              label: 'Assigned Role',
              render: (r) => (
                <Badge variant="outline" className="font-mono text-[10px] bg-blue-50 text-blue-700 border-blue-200">
                  {r.role?.name || 'No Role'}
                </Badge>
              )
            },
            {
              key: 'status',
              label: 'Status',
              render: (r) => (
                <Badge variant={r.status === 'SUSPENDED' ? 'destructive' : 'success'}>
                  {r.status}
                </Badge>
              )
            },
            {
              key: 'actions',
              label: 'Access Control',
              render: (r) => (
                <Button 
                  size="sm" 
                  variant={r.status === 'SUSPENDED' ? 'outline' : 'destructive'} 
                  className={r.status === 'SUSPENDED' ? 'text-green-600 border-green-200 hover:bg-green-50' : 'h-8 px-3'}
                  onClick={() => toggleStatus(r.id, r.status)}
                >
                  {r.status === 'SUSPENDED' ? (
                    <><CheckCircle className="h-3 w-3 mr-1" /> Re-Activate</>
                  ) : (
                    <><Ban className="h-3 w-3 mr-1" /> Suspend Access</>
                  )}
                </Button>
              )
            }
          ]}
          rows={admins}
          searchPlaceholder="Search admins by name or email..."
        />
      )}
    </div>
  )
}
