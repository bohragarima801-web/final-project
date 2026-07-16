"use client"

import { PageHeader } from '@/components/admin/page-header'
import { AdminTabs } from '@/components/admin/admin-tabs'
import { DataTableShell } from '@/components/admin/data-table-shell'
import { KpiCard } from '@/components/admin/kpi-card'
import { Badge } from '@/components/ui/badge'
import { Users, UserCheck, Star, HeartHandshake } from 'lucide-react'

export default function UsersPage() {
  const rows: any[] = []
  return (
    <div className="space-y-6">
      <PageHeader
        title="User Management"
        description="Manage customers, admins, pandits and volunteers."
        breadcrumbs={[{ label: 'Admin', href: '/admin' }, { label: 'Users' }]}
        action={{ label: 'Add User' }}
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard title="Total Users" value="0" icon={Users} />
        <KpiCard title="Customers" value="0" icon={HeartHandshake} />
        <KpiCard title="Pandits" value="0" icon={Star} />
        <KpiCard title="Verified" value="0" icon={UserCheck} />
      </div>
      <AdminTabs tabs={[
        { label: 'All', value: '' },
        { label: 'Customers', value: 'customers' },
        { label: 'Admins', value: 'admins' },
        { label: 'Pandits', value: 'pandits' },
        { label: 'Volunteers', value: 'volunteers' },
      ]} />
      <DataTableShell
        columns={[
          { key: 'name', label: 'Name' },
          { key: 'email', label: 'Email' },
          { key: 'phone', label: 'Phone' },
          { key: 'role', label: 'Role', render: (r) => <Badge variant="secondary">{r.role}</Badge> },
          { key: 'status', label: 'Status' },
          { key: 'createdAt', label: 'Joined' },
        ]}
        rows={rows}
        searchPlaceholder="Search by name, email or phone…"
      />
    </div>
  )
}
