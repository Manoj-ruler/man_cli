export default function NotFound() {
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
      gap: '16px',
      textAlign: 'center',
      padding: '2rem',
    }}>
      {/* Terminal prompt 404 */}
      <div style={{
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: '14px',
        color: '#6B6882',
        marginBottom: '8px',
      }}>
        ~ ?? find this page
      </div>
      <div style={{
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: '13px',
        color: '#C8F55A',
        marginBottom: '24px',
      }}>
        # result: page not found (exit code 404)
      </div>

      <h1 style={{
        fontFamily: "'Syne', sans-serif",
        fontSize: 'clamp(80px, 15vw, 140px)',
        fontWeight: 800,
        margin: 0,
        lineHeight: 1,
        background: 'linear-gradient(135deg, #FF2D78 0%, #7B61FF 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
      }}>
        404
      </h1>

      <p style={{
        color: '#6B6882',
        maxWidth: '360px',
        lineHeight: 1.65,
        margin: 0,
        fontSize: '16px',
      }}>
        This page doesn&apos;t exist. Maybe you mistyped the URL, or the page was moved.
      </p>

      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center', marginTop: '8px' }}>
        <a
          href="/"
          style={{
            padding: '12px 28px',
            background: '#FF2D78',
            color: '#fff',
            border: 'none',
            borderRadius: '9999px',
            cursor: 'pointer',
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 600,
            fontSize: '15px',
            textDecoration: 'none',
            boxShadow: '0 0 20px rgba(255,45,120,0.3)',
          }}
        >
          Back to home
        </a>
        <a
          href="/blog"
          style={{
            padding: '12px 28px',
            background: 'transparent',
            color: '#FF2D78',
            border: '1px solid rgba(255,45,120,0.5)',
            borderRadius: '9999px',
            textDecoration: 'none',
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 600,
            fontSize: '15px',
          }}
        >
          Read the docs
        </a>
      </div>
    </div>
  )
}
