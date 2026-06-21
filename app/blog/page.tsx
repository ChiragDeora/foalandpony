import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'

/* BLOG DISABLED, coming soon. Original blog index preserved in git history. */
export default function BlogPage() {
  return (
    <div className="fp-page">
      <Navbar />
      <section
        style={{
          minHeight: 'calc(100vh - 68px)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          padding: '80px 24px',
          background: '#F5F3ED',
        }}
      >
        <span className="fp-tag fp-tag-orange" style={{ marginBottom: 20 }}>Blog</span>
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
          Stories &amp; tips for parents are on the way. Check back shortly!
        </p>
      </section>
      <Footer />
    </div>
  )
}
