"use client"

import { PageHeader } from '@/components/admin/page-header'
import { DataTableShell } from '@/components/admin/data-table-shell'
import { Badge } from '@/components/ui/badge'

export default function CouponsPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Coupons" description="Create and manage discount codes."
        breadcrumbs={[{ label: 'Marketing', href: '/admin/marketing' }, { label: 'Coupons' }]}
        action={{ label: 'New Coupon' }} />
      <DataTableShell
        columns={[
          { key: 'code', label: 'Code', render: (r) => <code className="font-mono text-xs bg-muted px-1.5 py-0.5 rounded">{r.code}</code> },
          { key: 'discountType', label: 'Type' }, { key: 'discountValue', label: 'Value' },
          { key: 'usedCount', label: 'Used' }, { key: 'maxUses', label: 'Limit' },
          { key: 'isActive', label: 'Active', render: (r) => <Badge variant={r.isActive ? 'default' : 'secondary'}>{r.isActive ? 'Yes' : 'No'}</Badge> },
        ]}
        rows={[]}
      />
    </div>
  )
}
