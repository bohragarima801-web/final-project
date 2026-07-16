'use client'

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html>
      <body style={{ fontFamily: 'system-ui', padding: '40px', textAlign: 'center' }}>
        <h1 style={{ fontSize: 28, marginBottom: 12 }}>Application Error</h1>
        <p style={{ color: '#888', marginBottom: 24 }}>{error?.message || 'Fatal error'}</p>
        <button
          onClick={reset}
          style={{ background: '#FF8C21', color: 'white', border: 0, padding: '10px 20px', borderRadius: 6, cursor: 'pointer' }}
        >
          Reload
        </button>
      </body>
    </html>
  )
}
