import { PageHeader } from '@/components/admin/page-header'
import { EmptyState } from '@/components/admin/empty-state'
import { Layers } from 'lucide-react'

export default function MediaLibraryPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Media Library" description="All images, videos, PDFs and documents."
        breadcrumbs={[{ label: 'Admin', href: '/admin' }, { label: 'Media' }]}
        action={{ label: 'Upload' }} />
      <EmptyState icon={Layers} title="No media uploaded yet" description="Upload images, videos, PDFs and audio to reuse across the platform." />
    </div>
  )
}
