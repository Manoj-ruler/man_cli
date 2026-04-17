'use client'

import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#080810',
      color: '#F0EDE8',
      fontFamily: "'DM Sans', sans-serif",
      flexDirection: 'column',
      gap: '24px',
      textAlign: 'center',
      padding: '2rem',
    }}>
      <span style={{ fontSize: '64px' }}>⚡</span>
      <h2 style={{
        fontFamily: "'Syne', sans-serif",
        fontSize: '32px',
        fontWeight: 800,
        margin: 0,
        color: '#FF2D78',
      }}>
        Something went wrong
      </h2>
      <p style={{ color: '#6B6882', maxWidth: '480px', lineHeight: 1.6, margin: 0 }}>
        {error.message || 'An unexpected error occurred. Our team has been notified.'}
      </p>
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
        <button
          onClick={reset}
          style={{
            padding: '10px 24px',
            background: '#FF2D78',
            color: '#fff',
            border: 'none',
            borderRadius: '9999px',
            cursor: 'pointer',
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 600,
            fontSize: '14px',
          }}
        >
          Try again
        </button>
        <a
          href="/"
          style={{
            padding: '10px 24px',
            background: 'transparent',
            color: '#FF2D78',
            border: '1px solid rgba(255,45,120,0.5)',
            borderRadius: '9999px',
            textDecoration: 'none',
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 600,
            fontSize: '14px',
          }}
        >
          Go home
        </a>
      </div>
      {error.digest && (
        <p style={{ color: '#6B6882', fontSize: '12px', fontFamily: "'JetBrains Mono', monospace" }}>
          Error ID: {error.digest}
        </p>
      )}
    </div>
  )
}
