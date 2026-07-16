'use client'

import { useEffect, useState } from 'react'
import { PageHeader } from '@/components/admin/page-header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { AdminTabs } from '@/components/admin/admin-tabs'
import { toast } from 'sonner'
import { Loader2, Save, Eye, Code2, Trash2 } from 'lucide-react'
import { useSearchParams } from 'next/navigation'

export default function CustomizerPage() {
  const params = useSearchParams()
  const tab = params.get('tab') || 'global'

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [globalCss, setGlobalCss] = useState('')
  const [globalJs, setGlobalJs] = useState('')
  const [pageCustom, setPageCustom] = useState<Record<string, { html?: string; css?: string; js?: string }>>({})
  const [selectedPath, setSelectedPath] = useState('/')
  const [previewUrl, setPreviewUrl] = useState('/')

  useEffect(() => {
    fetch('/api/customizer').then(r => r.json()).then(j => {
      if (j.ok) {
        setGlobalCss(j.data.globalCss || '')
        setGlobalJs(j.data.globalJs || '')
        setPageCustom(j.data.pageCustom || {})
      }
      setLoading(false)
    })
  }, [])

  async function saveAll() {
    setSaving(true)
    try {
      const res = await fetch('/api/customizer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ globalCss, globalJs, pageCustom }),
      })
      const j = await res.json()
      if (!j.ok) throw new Error(j.error)
      toast.success('✅ Customizations saved and applied site-wide')
    } catch (err: any) {
      toast.error(err?.message || 'Save failed')
    } finally { setSaving(false) }
  }

  const pageEntry = pageCustom[selectedPath] || {}
  function updatePageEntry(patch: Partial<{ html: string; css: string; js: string }>) {
    setPageCustom({ ...pageCustom, [selectedPath]: { ...pageEntry, ...patch } })
  }
  function deletePageEntry(path: string) {
    const cp = { ...pageCustom }; delete cp[path]; setPageCustom(cp)
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="🎨 Live Customizer"
        description="Inject custom CSS/JS globally or per-page. Changes apply instantly across the site."
        breadcrumbs={[{ label: 'Admin', href: '/admin' }, { label: 'Customizer' }]}
        action={{ label: saving ? 'Saving…' : 'Save & Apply', icon: Save, onClick: saveAll }}
      />

      <AdminTabs tabs={[
        { label: 'Global CSS', value: 'global' },
        { label: 'Global JS', value: 'js' },
        { label: 'Per-Page', value: 'page' },
        { label: 'Preview', value: 'preview' },
      ]} />

      {loading ? (
        <div className="flex items-center gap-2 text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" /> Loading customizations…</div>
      ) : (
        <>
          {tab === 'global' && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2"><Code2 className="h-4 w-4" /> Global CSS</CardTitle>
                <p className="text-xs text-muted-foreground">Applies to every page on the site (marketing + dashboard + admin).</p>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={globalCss}
                  onChange={(e) => setGlobalCss(e.target.value)}
                  rows={20}
                  className="font-mono text-xs"
                  placeholder={`/* e.g. */\nbody { font-feature-settings: 'ss01'; }\n.container { max-width: 1400px; }`}
                />
              </CardContent>
            </Card>
          )}

          {tab === 'js' && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2"><Code2 className="h-4 w-4" /> Global JavaScript</CardTitle>
                <p className="text-xs text-muted-foreground">Runs on every page. ⚠️ Use with caution.</p>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={globalJs}
                  onChange={(e) => setGlobalJs(e.target.value)}
                  rows={20}
                  className="font-mono text-xs"
                  placeholder={`// e.g. analytics, chat widgets, etc.\nconsole.log('Devyajnam custom JS loaded');`}
                />
              </CardContent>
            </Card>
          )}

          {tab === 'page' && (
            <div className="grid gap-4 lg:grid-cols-3">
              <Card>
                <CardHeader><CardTitle className="text-base">Pages</CardTitle></CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex gap-2">
                    <Input value={selectedPath} onChange={(e) => setSelectedPath(e.target.value)} placeholder="/pujas" />
                    <Button size="sm" onClick={() => setPageCustom({ ...pageCustom, [selectedPath]: pageCustom[selectedPath] || {} })}>Add</Button>
                  </div>
                  <p className="text-[11px] text-muted-foreground">Enter path like <code>/pujas</code>, <code>/about</code>, <code>/dashboard</code>.</p>
                  <div className="border rounded-md divide-y max-h-96 overflow-auto">
                    {Object.keys(pageCustom).length === 0 ? (
                      <p className="p-3 text-xs text-muted-foreground text-center">No page overrides yet.</p>
                    ) : Object.keys(pageCustom).map((p) => (
                      <div key={p} className={`flex items-center justify-between p-2 text-xs cursor-pointer ${selectedPath === p ? 'bg-primary/5' : 'hover:bg-muted/50'}`}
                        onClick={() => setSelectedPath(p)}>
                        <code>{p}</code>
                        <button onClick={(e) => { e.stopPropagation(); deletePageEntry(p) }} className="opacity-60 hover:opacity-100 hover:text-destructive">
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="lg:col-span-2">
                <CardHeader className="flex-row items-center justify-between">
                  <CardTitle className="text-base flex items-center gap-2"><Code2 className="h-4 w-4" /> Editing <Badge variant="outline">{selectedPath}</Badge></CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div><Label className="text-xs">Custom CSS</Label>
                    <Textarea value={pageEntry.css || ''} onChange={(e) => updatePageEntry({ css: e.target.value })}
                      rows={6} className="font-mono text-xs" placeholder="h1 { color: crimson; }" />
                  </div>
                  <div><Label className="text-xs">Custom JavaScript</Label>
                    <Textarea value={pageEntry.js || ''} onChange={(e) => updatePageEntry({ js: e.target.value })}
                      rows={6} className="font-mono text-xs" placeholder="// runs when this page loads" />
                  </div>
                  <div><Label className="text-xs">HTML (injected into #__dvj_slot if present on page)</Label>
                    <Textarea value={pageEntry.html || ''} onChange={(e) => updatePageEntry({ html: e.target.value })}
                      rows={6} className="font-mono text-xs" placeholder="<div>custom widget…</div>" />
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {tab === 'preview' && (
            <Card>
              <CardHeader className="flex-row items-center gap-2">
                <CardTitle className="text-base flex items-center gap-2"><Eye className="h-4 w-4" /> Live Preview</CardTitle>
                <Input value={previewUrl} onChange={(e) => setPreviewUrl(e.target.value)} className="max-w-xs h-8 text-xs" />
                <Button size="sm" onClick={saveAll}>Save first</Button>
              </CardHeader>
              <CardContent>
                <iframe src={previewUrl} className="w-full h-[600px] rounded-md border bg-background" />
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  )
}
