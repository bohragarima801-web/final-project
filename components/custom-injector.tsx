'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

export function CustomInjector() {
  const pathname = usePathname()

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const res = await fetch('/api/customizer', { cache: 'no-store' })
        const j = await res.json()
        if (cancelled || !j?.ok) return
        const { globalCss, globalJs, pageCustom } = j.data || {}

        // Global CSS
        let styleEl = document.getElementById('__dvj_global_css') as HTMLStyleElement | null
        if (!styleEl) {
          styleEl = document.createElement('style')
          styleEl.id = '__dvj_global_css'
          document.head.appendChild(styleEl)
        }
        styleEl.textContent = globalCss || ''

        // Page-specific CSS
        const pageKey = pathname || '/'
        const pageData = (pageCustom || {})[pageKey]
        let pageStyle = document.getElementById('__dvj_page_css') as HTMLStyleElement | null
        if (!pageStyle) {
          pageStyle = document.createElement('style')
          pageStyle.id = '__dvj_page_css'
          document.head.appendChild(pageStyle)
        }
        pageStyle.textContent = pageData?.css || ''

        // Global JS (executed once per navigation)
        try {
          if (globalJs) new Function(globalJs)()
        } catch (err) { console.warn('[customizer:globalJs]', err) }

        // Page JS
        try {
          if (pageData?.js) new Function(pageData.js)()
        } catch (err) { console.warn('[customizer:pageJs]', err) }

        // Page HTML injection into #__dvj_slot if present
        if (pageData?.html) {
          const slot = document.getElementById('__dvj_slot')
          if (slot) slot.innerHTML = pageData.html
        }
      } catch (err) {
        console.warn('[customizer] load failed', err)
      }
    }
    load()
    return () => { cancelled = true }
  }, [pathname])

  return null
}
