import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'
import { siteConfig } from '@/lib/site-config'
import { Toaster } from 'sonner'
import { CustomInjector } from '@/components/custom-injector'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
  title: { default: `${siteConfig.name} — ${siteConfig.tagline}`, template: `%s | ${siteConfig.name}` },
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  metadataBase: new URL(siteConfig.url),
  openGraph: { title: siteConfig.name, description: siteConfig.description, url: siteConfig.url, siteName: siteConfig.name, type: 'website' },
  twitter: { card: 'summary_large_image', title: siteConfig.name, description: siteConfig.description },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#FF8C21' },
    { media: '(prefers-color-scheme: dark)', color: '#1a0f08' },
  ],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var originalFetch = window.fetch;
                  var currentFetch = originalFetch;
                  
                  function defineFetch(obj) {
                    Object.defineProperty(obj, 'fetch', {
                      configurable: true,
                      enumerable: true,
                      get: function() { return currentFetch; },
                      set: function(v) { currentFetch = v; }
                    });
                  }

                  try {
                    defineFetch(window);
                  } catch (e) {
                    try {
                      defineFetch(Window.prototype);
                    } catch (err) {
                      console.warn('[AI Studio Shim] Failed to define on Window.prototype:', err);
                    }
                  }
                } catch (e) {
                  console.warn('[AI Studio Shim] Failed to install fetch shim:', e);
                }
              })();
            `
          }}
        />
      </head>
      <body className={inter.className} suppressHydrationWarning>
        <Providers>
          {children}
          <div id="__dvj_slot" />
          <Toaster position="top-right" richColors closeButton />
          <CustomInjector />
        </Providers>
      </body>
    </html>
  )
}
