import { PageHeader } from '@/components/admin/page-header'
import { AdminTabs } from '@/components/admin/admin-tabs'
import { EmptyState } from '@/components/admin/empty-state'
import { ImageIcon } from 'lucide-react'

export default function GalleryPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Gallery" description="Upload and organize photos, videos, albums."
        breadcrumbs={[{ label: 'Admin', href: '/admin' }, { label: 'Gallery' }]}
        action={{ label: 'Upload Media' }} />
      <AdminTabs tabs={[
        { label: 'All' }, { label: 'Photos', value: 'photos' }, { label: 'Videos', value: 'videos' },
        { label: 'Albums', value: 'albums' }, { label: 'Festivals', value: 'festivals' },
      ]} />
      <EmptyState icon={ImageIcon} title="Gallery is empty" description="Upload photos and videos to showcase temples, events and festivals." />
    </div>
  )
}
