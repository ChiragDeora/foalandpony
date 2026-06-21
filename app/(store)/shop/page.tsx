/* SHOP DISABLED, uncomment to enable post-launch. Original grid preserved in git history. */

export default function ShopPage() {
  return (
    <section
      style={{
        minHeight: '72vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '80px 24px',
        background: '#F5F3ED',
      }}
    >
      <span className="fp-tag fp-tag-orange" style={{ marginBottom: 20 }}>Shop</span>
      <h1
        style={{
          fontFamily: 'var(--fp-heading-font)',
          fontWeight: 900,
          fontSize: 'clamp(36px, 6vw, 64px)',
          color: '#1A2B4A',
          marginBottom: 14,
        }}
      >
        Coming soon
      </h1>
      <p style={{ color: '#7A7A7A', fontSize: 18, maxWidth: 420, lineHeight: 1.6, fontFamily: 'var(--fp-body-font)' }}>
        Our frames are almost ready. Check back shortly!
      </p>
    </section>
  )
}
