'use client'

import { useEffect, useState } from 'react'
import { PageHeader } from '@/components/admin/page-header'
import { KpiCard } from '@/components/admin/kpi-card'
import { DataTableShell } from '@/components/admin/data-table-shell'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Users, UserCheck, UserX, Calendar, Trash2 } from 'lucide-react'
import { toast } from 'sonner'

export default function UsersPage() {
  const [rows, setRows] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const loadUsers = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/admin/users')
      const json = await res.json()
      if (json.ok) {
        setRows(json.data || [])
      } else {
        toast.error(json.error || 'Failed to load users')
      }
    } catch (err) {
      console.error('Error fetching users:', err)
      toast.error('Network error loading users')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadUsers()
  }, [])

  // Delete handler
  const handleDelete = async (id: string, email: string) => {
    if (!confirm(`Are you sure you want to delete user "${email}"? This will irreversibly remove their account and profiles.`)) return
    try {
      const res = await fetch(`/api/admin/users?id=${id}`, { method: 'DELETE' })
      const json = await res.json()
      if (json.ok) {
        toast.success(`User "${email}" deleted`)
        setRows(prev => prev.filter(r => r.id !== id))
      } else {
        toast.error(json.error || 'Failed to delete user')
      }
    } catch (err) {
      toast.error('Network error during user deletion')
    }
  }

  // Bulk Actions
  const handleBulkDelete = async (ids: string[]) => {
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete', ids })
      })
      const json = await res.json()
      if (json.ok) {
        toast.success(`Successfully deleted ${ids.length} users`)
        setRows(prev => prev.filter(r => !ids.includes(r.id)))
      } else {
        toast.error(json.error || 'Failed to bulk delete')
      }
    } catch (err) {
      toast.error('Network error during bulk delete')
    }
  }

  const handleBulkStatusChange = async (ids: string[], status: string) => {
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'status', ids, status })
      })
      const json = await res.json()
      if (json.ok) {
        toast.success(`Updated status for ${ids.length} users`)
        setRows(prev => prev.map(r => ids.includes(r.id) ? { ...r, status } : r))
      } else {
        toast.error(json.error || 'Failed to update status')
      }
    } catch (err) {
      toast.error('Network error during bulk status update')
    }
  }

  // Live Counts
  const totalCount = rows.length
  const activeCount = rows.filter(r => r.status === 'ACTIVE').length
  const inactiveCount = rows.filter(r => r.status !== 'ACTIVE').length
  const newThisMonthCount = rows.filter(r => {
    const d = new Date(r.createdAt)
    const now = new Date()
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
  }).length

  const columns = [
    { 
      key: 'fullName', 
      label: 'Name', 
      render: (r: any) => (
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-full bg-amber-500/10 text-amber-600 flex items-center justify-center font-bold text-xs uppercase">
            {(r.fullName || r.email || 'U').charAt(0)}
          </div>
          <span className="font-semibold text-foreground">{r.fullName || 'Unnamed User'}</span>
        </div>
      )
    },
    { 
      key: 'email', 
      label: 'Email Address', 
      render: (r: any) => <span className="font-mono text-xs">{r.email}</span> 
    },
    { 
      key: 'role', 
      label: 'Role', 
      render: (r: any) => (
        <Badge variant="outline" className="capitalize bg-muted text-foreground/80 font-semibold border-none">
          {r.role?.name || 'User'}
        </Badge>
      )
    },
    { 
      key: 'status', 
      label: 'Status', 
      render: (r: any) => (
        <Badge variant={r.status === 'ACTIVE' ? 'default' : 'secondary'} className={r.status === 'ACTIVE' ? 'bg-emerald-500 hover:bg-emerald-600 text-white border-none' : 'bg-amber-100 text-amber-800 border-none'}>
          {r.status}
        </Badge>
      )
    },
    { 
      key: 'createdAt', 
      label: 'Joined Date', 
      render: (r: any) => (
        <span className="text-muted-foreground text-xs font-medium">
          {new Date(r.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
        </span>
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      sortable: false,
      render: (r: any) => (
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8 text-rose-600 hover:text-rose-700 hover:bg-rose-50"
          onClick={() => handleDelete(r.id, r.email)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      )
    }
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title="Registered Users"
        description="Verify and update platform users, roles, permissions and account security states."
        breadcrumbs={[{ label: 'Admin', href: '/admin' }, { label: 'Users' }]}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard title="Total Platform Users" value={String(totalCount)} icon={Users} />
        <KpiCard title="Active Users" value={String(activeCount)} icon={UserCheck} iconClass="text-emerald-500" />
        <KpiCard title="Suspended/Inactive" value={String(inactiveCount)} icon={UserX} iconClass="text-rose-500" />
        <KpiCard title="New This Month" value={String(newThisMonthCount)} icon={Calendar} iconClass="text-blue-500" />
      </div>

      <DataTableShell
        columns={columns}
        rows={rows}
        searchPlaceholder="Search users by name, email, phone..."
        emptyMessage={loading ? "Loading users..." : "No users found in database."}
        onBulkDelete={handleBulkDelete}
        onBulkStatusChange={handleBulkStatusChange}
        statusOptions={['ACTIVE', 'INACTIVE', 'SUSPENDED', 'PENDING']}
      />
    </div>
  )
}
