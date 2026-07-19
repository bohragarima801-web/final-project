'use client'

import { useEffect } from 'react'

export function TranslationProvider() {
  useEffect(() => {
    if (typeof window === 'undefined') return

    // 1. Read language from localStorage
    const lang = localStorage.getItem('lang') || 'hi'

    // 2. Set the Google Translate Cookie
    if (lang === 'hi') {
      // Clear cookie for base language
      document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/"
      document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=." + window.location.hostname
    } else {
      document.cookie = `googtrans=/hi/${lang}; path=/`
      document.cookie = `googtrans=/hi/${lang}; path=/; domain=.${window.location.hostname}`
    }

    // 3. Inject Google Translate CSS to hide UI frames
    let style = document.getElementById('__google_translate_css')
    if (!style) {
      style = document.createElement('style')
      style.id = '__google_translate_css'
      style.textContent = `
        .skiptranslate, iframe.skiptranslate, .goog-te-banner-frame, #goog-gt-tt, .goog-te-balloon-frame {
          display: none !important;
          visibility: hidden !important;
        }
        body {
          top: 0 !important;
        }
      `
      document.head.appendChild(style)
    }

    // 4. Inject Google Translate element placeholder container (hidden)
    let container = document.getElementById('google_translate_element')
    if (!container) {
      container = document.createElement('div')
      container.id = 'google_translate_element'
      container.style.display = 'none'
      document.body.appendChild(container)
    }

    // 5. Initialize Translate callback
    ;(window as any).googleTranslateElementInit = () => {
      new (window as any).google.translate.TranslateElement({
        pageLanguage: 'hi',
        includedLanguages: 'hi,en,ta,te,kn,gu,mr,bn',
        autoDisplay: false
      }, 'google_translate_element')
    }

    // 6. Load Translate script
    const scriptId = '__google_translate_script'
    let script = document.getElementById(scriptId) as HTMLScriptElement | null
    if (!script) {
      script = document.createElement('script')
      script.id = scriptId
      script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit'
      script.async = true
      document.body.appendChild(script)
    }
  }, [])

  return null
}
