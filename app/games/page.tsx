import Image from 'next/image'
import Link from 'next/link'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'

const GAMES = [
  {
    slug: 'brick-breaker',
    title: 'Brick Breaker',
    description: 'Smash your way through 25 levels of colourful bricks. Arrow keys or swipe to move.',
    img: null,
    badge: 'Play now',
  },
]

export default function GamesPage() {
  return (
    <div className="fp-page">
      <Navbar />

      {/* Header */}
      <section style={{ padding: '72px 0 56px', background: '#F5F3ED', position: 'relative', overflow: 'hidden' }}>
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          <div className="fp-blob" style={{ width: 360, height: 360, background: 'rgba(255,140,0,0.1)', top: -100, right: -80 }} />
          <div className="fp-blob fp-blob-2" style={{ width: 240, height: 240, background: 'rgba(30,136,229,0.09)', bottom: -60, left: -40 }} />
        </div>
        <div className="fp-container relative z-10">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 32, alignItems: 'center' }}
            className="max-[640px]:grid-cols-1">
            <div>
              <h1 style={{ fontFamily: 'var(--fp-heading-font)', fontWeight: 900, fontSize: 'clamp(36px, 5vw, 64px)', color: '#1A2B4A', marginBottom: 14 }}>
                Play &amp; Win
              </h1>
              <p style={{ color: '#7A7A7A', fontSize: 18, lineHeight: 1.6, maxWidth: 440, fontFamily: 'var(--fp-body-font)' }}>
                Games built for little eyes and quick fingers. No sign-up. Just play.
              </p>
            </div>
            <div className="fp-float">
              <Image src="/images/logo/foal-jump.png" alt="" width={120} height={120} style={{ filter: 'drop-shadow(0 10px 20px rgba(26,43,74,0.2))' }} />
            </div>
          </div>
        </div>
      </section>

      {/* Games grid */}
      <section style={{ padding: '56px 0 96px', background: '#F5F3ED' }}>
        <div className="fp-container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}
            className="max-[1024px]:grid-cols-2 max-[640px]:grid-cols-1">
            {GAMES.map(game => (
              <div key={game.slug} className="fp-game-card" style={{ borderTop: '6px solid #FF8C00' }}>
                {/* Thumbnail */}
                <div style={{ aspectRatio: '16/9', background: 'linear-gradient(135deg, #1A2B4A 0%, #2d4a7a 100%)', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {/* Mini preview */}
                  <div style={{ textAlign: 'center' }}>
                    {[0, 1, 2, 3, 4].map(row => (
                      <div key={row} style={{ display: 'flex', gap: 4, marginBottom: 4, justifyContent: 'center' }}>
                        {[0, 1, 2, 3, 4, 5].map(col => (
                          <div key={col} style={{
                            width: 20, height: 10, borderRadius: 3,
                            background: row < 2 ? '#FF8C00' : row < 4 ? '#4CAF50' : '#1E88E5',
                            opacity: 0.85,
                          }} />
                        ))}
                      </div>
                    ))}
                    <div style={{ marginTop: 12, width: 60, height: 10, borderRadius: 6, background: '#FF8C00', margin: '12px auto 0' }} />
                  </div>
                </div>

                <div style={{ padding: '20px 20px 24px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <h2 style={{ fontFamily: 'var(--fp-heading-font)', fontWeight: 800, fontSize: 22, color: '#1A2B4A' }}>
                    {game.title}
                  </h2>
                  <p style={{ color: '#7A7A7A', fontSize: 14, lineHeight: 1.6, fontFamily: 'var(--fp-body-font)' }}>
                    {game.description}
                  </p>
                  <Link href={`/games/${game.slug}`} className="fp-btn fp-btn-primary" style={{ marginTop: 4, justifyContent: 'center' }}>
                    {game.badge}
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                      <path d="M5 12h14M13 6l6 6-6 6" />
                    </svg>
                  </Link>
                </div>
              </div>
            ))}

            {/* Coming soon placeholder */}
            <div className="fp-game-card" style={{ borderTop: '6px solid #4CAF50', opacity: 0.6 }}>
              <div style={{ aspectRatio: '16/9', background: '#e8e0d4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ color: '#1A2B4A', fontSize: 13, fontWeight: 700, fontFamily: 'var(--fp-body-font)' }}>Coming soon</span>
              </div>
              <div style={{ padding: '20px 20px 24px' }}>
                <h2 style={{ fontFamily: 'var(--fp-heading-font)', fontWeight: 800, fontSize: 22, color: '#1A2B4A' }}>More games</h2>
                <p style={{ color: '#7A7A7A', fontSize: 14, fontFamily: 'var(--fp-body-font)' }}>New games dropping soon. Watch this space.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
