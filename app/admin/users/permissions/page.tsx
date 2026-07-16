'use client';

import { PageHeader } from '@/components/admin/page-header'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Shield, Users, ArrowLeft, Save } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

export default function PermissionsPage() {
  const [permissions, setPermissions] = useState({
    admin: { view: true, edit: true, delete: true },
    bookings: { view: true, edit: true, delete: false },
    users: { view: true, edit: false, delete: false },
    products: { view: false, edit: false, delete: false },
  })

  const handleToggle = (module: string, action: string) => {
    setPermissions(prev => ({
      ...prev,
      [module]: {
        ...prev[module],
        [action]: !prev[module][action]
      }
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Saving permissions:', permissions)
    // API call here
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="User Permissions"
        description="Manage role-based access control."
        breadcrumbs={[
          { label: 'Admin', href: '/admin' },
          { label: 'Users', href: '/admin/users' },
          { label: 'Permissions' }
        ]}
      />

      <form onSubmit={handleSubmit}>
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Module Permissions</CardTitle>
                <CardDescription>Configure what each role can access.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <div className="grid grid-cols-4 gap-4 p-4 font-medium border-b bg-muted">
                    <div>Module</div>
                    <div>View</div>
                    <div>Edit</div>
                    <div>Delete</div>
                  </div>
                  
                  {Object.entries(permissions).map(([module, actions]) => (
                    <div key={module} className="grid grid-cols-4 gap-4 p-4 border-b last:border-0 items-center">
                      <div className="capitalize">{module}</div>
                      <Checkbox
                        checked={actions.view}
                        onCheckedChange={() => handleToggle(module, 'view')}
                      />
                      <Checkbox
                        checked={actions.edit}
                        onCheckedChange={() => handleToggle(module, 'edit')}
                      />
                      <Checkbox
                        checked={actions.delete}
                        onCheckedChange={() => handleToggle(module, 'delete')}
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Role Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Badge variant="default">Admin</Badge>
                  <p className="text-sm text-muted-foreground">Full access to all modules.</p>
                </div>
                <div className="space-y-2">
                  <Badge variant="secondary">Manager</Badge>
                  <p className="text-sm text-muted-foreground">Limited access to specific modules.</p>
                </div>
                <div className="space-y-2">
                  <Badge variant="outline">Staff</Badge>
                  <p className="text-sm text-muted-foreground">Read-only access for most modules.</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button type="submit" className="w-full">
                  <Save className="mr-2 h-4 w-4" />
                  Save Permissions
                </Button>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/admin/users">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Users
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  )
}
