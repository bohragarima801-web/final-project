import { PageHeader } from '@/components/admin/page-header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ROLE_LABELS, DEFAULT_PERMISSIONS } from '@/lib/rbac'
import { ShieldCheck } from 'lucide-react'

export default function RolesPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Roles"
        description="9 built-in roles with granular permissions."
        breadcrumbs={[{ label: 'Users', href: '/admin/users' }, { label: 'Roles' }]}
        action={{ label: 'Create Role' }}
      />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {(Object.keys(ROLE_LABELS) as Array<keyof typeof ROLE_LABELS>).map((slug) => (
          <Card key={slug}>
            <CardHeader>
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-primary" />
                <CardTitle className="text-base">{ROLE_LABELS[slug]}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground uppercase mb-2">Permissions</p>
              <div className="flex flex-wrap gap-1">
                {(DEFAULT_PERMISSIONS[slug] || []).slice(0, 6).map((p) => (
                  <Badge key={p} variant="secondary" className="text-[10px]">{p}</Badge>
                ))}
                {DEFAULT_PERMISSIONS[slug] && DEFAULT_PERMISSIONS[slug].length > 6 && (
                  <Badge variant="outline" className="text-[10px]">+{DEFAULT_PERMISSIONS[slug].length - 6}</Badge>
                )}
              </div>
              <div className="mt-4 flex justify-end">
                <Button variant="outline" size="sm">Edit</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
