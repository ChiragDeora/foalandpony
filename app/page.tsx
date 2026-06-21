'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Navbar } from '@/components/Navbar'
import { useTheme } from '@/context/ThemeContext'


/* Inline icon set, quirky outline strokes, drawn here so we don't ship a UI lib */
function Icon({ name, size = 22 }: { name: string; size?: number }) {
  const s = size
  const stroke = 'currentColor'
  const common = {
    width: s,
    height: s,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke,
    strokeWidth: 2,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  }
  switch (name) {
    case 'hinge':
      return (
        <svg {...common}>
          <path d="M3 12c4-5 14-5 18 0" />
          <circle cx="3" cy="12" r="1.6" />
          <circle cx="21" cy="12" r="1.6" />
          <path d="M8 9l-1 6M16 9l1 6" />
        </svg>
      )
    case 'feather':
      return (
        <svg {...common}>
          <path d="M20 4c-6 0-12 6-12 12v4h4c6 0 12-6 12-12V4z" />
          <path d="M4 20l8-8" />
          <path d="M14 8l-4 4" />
        </svg>
      )
    case 'shield':
      return (
        <svg {...common}>
          <path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z" />
          <path d="M9 12l2 2 4-4" />
        </svg>
      )
    case 'smile':
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
          <path d="M8 14c1.5 2 6.5 2 8 0" />
          <circle cx="9" cy="10" r=".8" fill={stroke} />
          <circle cx="15" cy="10" r=".8" fill={stroke} />
        </svg>
      )
    case 'drop':
      return (
        <svg {...common}>
          <path d="M12 3l1 4 4 1-4 1-1 4-1-4-4-1 4-1z" />
          <path d="M5 19l3 2M19 19l-3 2M12 21v-3" />
        </svg>
      )
    case 'refresh':
      return (
        <svg {...common}>
          <path d="M3 12a9 9 0 0114-7l3 2" />
          <path d="M21 4v4h-4" />
          <path d="M21 12a9 9 0 01-14 7l-3-2" />
          <path d="M3 20v-4h4" />
        </svg>
      )
    case 'weight':
      return (
        <svg {...common}>
          <path d="M6 7h12l-1 12H7z" />
          <path d="M9 7a3 3 0 016 0" />
        </svg>
      )
    case 'badge':
      return (
        <svg {...common}>
          <circle cx="12" cy="10" r="6" />
          <path d="M9 14l-2 7 5-3 5 3-2-7" />
        </svg>
      )
    case 'ruler':
      return (
        <svg {...common}>
          <path d="M3 9l6-6 12 12-6 6z" />
          <path d="M7 9l2 2M10 6l2 2M13 9l2 2M16 6l2 2" />
        </svg>
      )
    case 'sun':
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M4.9 19.1L7 17M17 7l2.1-2.1" />
        </svg>
      )
    case 'splash':
      return (
        <svg {...common}>
          <path d="M5 12c2 0 3-2 3-2s1 2 3 2 3-2 3-2 1 2 3 2 3-2 3-2" />
          <path d="M5 17c2 0 3-2 3-2s1 2 3 2 3-2 3-2 1 2 3 2 3-2 3-2" />
          <path d="M5 7c2 0 3-2 3-2s1 2 3 2 3-2 3-2 1 2 3 2 3-2 3-2" />
        </svg>
      )
    case 'cart':
      return (
        <svg {...common}>
          <circle cx="9" cy="20" r="1.5" />
          <circle cx="17" cy="20" r="1.5" />
          <path d="M3 4h2l2.4 11.5a2 2 0 002 1.5h7.6a2 2 0 002-1.6L20 8H6" />
        </svg>
      )
    case 'arrow':
      return (
        <svg {...common}>
          <path d="M5 12h14M13 6l6 6-6 6" />
        </svg>
      )
    case 'instagram':
      return (
        <svg {...common}>
          <rect x="3" y="3" width="18" height="18" rx="5" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="17.5" cy="6.5" r=".8" fill={stroke} />
        </svg>
      )
    case 'whatsapp':
      return (
        <svg {...common}>
          <path d="M21 12a9 9 0 11-17.5-3L3 21l5.4-1.4A9 9 0 0021 12z" />
          <path d="M9 10c.5 2 1.8 3.7 4 4.5l1.6-1.3 2.6.9c.2 1.6-1.5 2.4-3 2.1A8 8 0 017 11c-.3-1.5.5-3.1 2-3l.9 2.5z" />
        </svg>
      )
    case 'mail':
      return (
        <svg {...common}>
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <path d="M3 7l9 6 9-6" />
        </svg>
      )
    default:
      return null
  }
}

const features = [
  { num: '01', title: 'Bends, never breaks', body: 'Spring-back temples flex past 90° and snap right back. Goodbye snapped arms and emergency optician runs.' },
  { num: '02', title: 'Practically weightless', body: 'Around 12 grams of TR-90 construction. So light, kids forget they have them on, which means they actually keep them on.' },
  { num: '03', title: 'Eyes well looked-after', body: 'UV-blocking lens compatibility plus polarised clip-ons for sunny days. Growing eyes, properly shielded.' },
  { num: '04', title: 'Fits little faces', body: 'Built from the ground up for child proportions. Soft-grip nose pads stay put through every cartwheel, scoot and slide.' },
]

const tests = [
  { ic: 'drop', title: 'The drop test', body: 'Two metres of concrete. Fifty drops in a row. No splinters.' },
  { ic: 'refresh', title: 'The bend test', body: '10,000 hinge cycles to 180°. Snaps right back, every time.' },
  { ic: 'splash', title: 'The everything-else test', body: 'Sand. Pool water. Pasta sauce. Backpack bottoms. All survived.' },
]

const testimonials = [
  {
    body: 'Third pair of glasses in a year, until these. Six months of football and they still look new. We are genuinely shocked.',
    name: 'Priya M.',
    meta: 'Mum of two, ages 7 and 9',
  },
  {
    body: 'He picked the orange ones himself and now he won\'t take them off. That is the real magic. He wants to wear them.',
    name: 'Daniel R.',
    meta: 'Dad, son age 5',
  },
  {
    body: 'They look like proper designer frames but shrug off everything my daughter does to them. Worth every rupee.',
    name: 'Aisha K.',
    meta: 'Mum, daughter age 8',
  },
]

/* ─── Kids floating decorations: clouds, stars, sparkles, confetti ─── */
function Star({ fill, size }: { fill: string; size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} aria-hidden>
      <path d="M12 2l2.5 6.4L21 9l-5 4.2L17.6 20 12 16.3 6.4 20 8 13.2 3 9l6.5-.6z" />
    </svg>
  )
}
function Sparkle({ fill, size }: { fill: string; size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} aria-hidden>
      <path d="M12 0c1.1 5.6 5.3 9.8 12 12-6.7 2.2-10.9 6.4-12 12-1.1-5.6-5.3-9.8-12-12 6.7-2.2 10.9-6.4 12-12z" />
    </svg>
  )
}
function Balloon({ color, size, style }: { color: string; size: number; style?: React.CSSProperties }) {
  return (
    <div className="kd kd-balloon" style={style} aria-hidden>
      <svg width={size} height={size * 1.5} viewBox="0 0 40 60" fill="none">
        <ellipse cx="20" cy="20" rx="17" ry="20" fill={color} />
        <ellipse cx="14" cy="13" rx="5" ry="7" fill="rgba(255,255,255,.35)" />
        <path d="M20 40 l-3 4 6 0 z" fill={color} />
        <path d="M20 44 q4 8 -1 16" stroke="rgba(31,58,92,.35)" strokeWidth="1.5" fill="none" />
      </svg>
    </div>
  )
}
function KidsDecor() {
  return (
    <div className="kids-decor" aria-hidden>
      {/* clouds drifting across the top, above the kids' heads */}
      <div className="kd kd-cloud kd-drift" style={{ width: 156, height: 56, top: '5%', left: '5%' }} />
      <div className="kd kd-cloud kd-drift" style={{ width: 116, height: 42, top: '3%', left: '38%', animationDelay: '-4s', animationDuration: '20s' }} />
      <div className="kd kd-cloud kd-drift" style={{ width: 138, height: 50, top: '9%', right: '22%', animationDelay: '-8s' }} />
      <div className="kd kd-cloud kd-drift" style={{ width: 96, height: 36, top: '4%', right: '4%', animationDelay: '-12s', animationDuration: '22s' }} />
      {/* twinkling stars, spread across top strip + right side, clear of the text block */}
      <div className="kd kd-twinkle" style={{ top: '13%', left: '10%' }}><Star fill="#FFC23C" size={48} /></div>
      <div className="kd kd-twinkle" style={{ top: '9%', left: '30%' }}><Star fill="#3FA9F5" size={28} /></div>
      <div className="kd kd-twinkle" style={{ top: '18%', right: '30%', animationDelay: '.6s' }}><Star fill="#FF6FB5" size={38} /></div>
      <div className="kd kd-twinkle" style={{ bottom: '18%', right: '24%', animationDelay: '1s' }}><Star fill="#57C84D" size={32} /></div>
      <div className="kd kd-twinkle" style={{ top: '38%', right: '40%', animationDelay: '1.8s' }}><Star fill="#A368E8" size={26} /></div>
      <div className="kd kd-twinkle" style={{ top: '52%', right: '7%', animationDelay: '1.4s' }}><Star fill="#FF5A5A" size={34} /></div>
      {/* spinning sparkles */}
      <div className="kd kd-spin" style={{ top: '8%', left: '20%' }}><Sparkle fill="#A368E8" size={34} /></div>
      <div className="kd kd-spin" style={{ top: '24%', right: '18%' }}><Sparkle fill="#3FA9F5" size={42} /></div>
      <div className="kd kd-spin" style={{ bottom: '14%', right: '34%', animationDuration: '24s' }}><Sparkle fill="#FFC23C" size={28} /></div>
      {/* balloons bobbing up and down */}
      <Balloon color="#57C84D" size={44} style={{ top: '13%', left: '6%' }} />
      <Balloon color="#FF5A5A" size={52} style={{ top: '12%', right: '10%' }} />
      <Balloon color="#A368E8" size={38} style={{ top: '34%', right: '44%', animationDelay: '-3.5s' }} />
      {/* confetti dots twinkling slowly */}
      <span className="kd kd-twinkle-slow" style={{ width: 16, height: 16, borderRadius: '50%', background: '#FFC23C', top: '7%', left: '24%' }} />
      <span className="kd kd-twinkle-slow" style={{ width: 17, height: 17, borderRadius: '50%', background: '#2EC6C6', top: '26%', right: '16%', animationDelay: '.6s' }} />
      <span className="kd kd-twinkle-slow" style={{ width: 14, height: 14, borderRadius: '50%', background: '#FF5A5A', bottom: '30%', right: '7%', animationDelay: '1.6s' }} />
      <span className="kd kd-twinkle-slow" style={{ width: 16, height: 16, borderRadius: '50%', background: '#57C84D', top: '54%', right: '36%', animationDelay: '2.1s' }} />
      <span className="kd kd-twinkle-slow" style={{ width: 18, height: 18, borderRadius: '50%', background: '#3FA9F5', bottom: '42%', right: '20%', animationDelay: '.3s' }} />
      <span className="kd kd-twinkle-slow" style={{ width: 15, height: 15, borderRadius: '50%', background: '#A368E8', top: '20%', right: '46%', animationDelay: '1s' }} />
      {/* left of the text (far-left margin) */}
      <div className="kd kd-twinkle" style={{ top: '42%', left: '2%' }}><Star fill="#57C84D" size={30} /></div>
      <div className="kd kd-spin" style={{ top: '62%', left: '3%', animationDuration: '20s' }}><Sparkle fill="#A368E8" size={26} /></div>
      <span className="kd kd-twinkle-slow" style={{ width: 14, height: 14, borderRadius: '50%', background: '#FF6FB5', top: '54%', left: '2%' }} />
      {/* below the text */}
      <div className="kd kd-twinkle" style={{ bottom: '6%', left: '13%' }}><Star fill="#FFC23C" size={28} /></div>
      <span className="kd kd-twinkle-slow" style={{ width: 16, height: 16, borderRadius: '50%', background: '#3FA9F5', bottom: '9%', left: '30%', animationDelay: '1s' }} />
      <div className="kd kd-spin" style={{ bottom: '5%', left: '40%', animationDuration: '22s' }}><Sparkle fill="#FF5A5A" size={24} /></div>
    </div>
  )
}
/* ─── Lighter decoration set for lower sections (different from the hero) ─── */
function FinaleDecor() {
  return (
    <div className="kids-decor" aria-hidden style={{ zIndex: 1 }}>
      <div className="kd kd-cloud kd-drift" style={{ width: 124, height: 46, top: '10%', left: '7%' }} />
      <div className="kd kd-cloud kd-drift" style={{ width: 92, height: 34, top: '16%', right: '9%', animationDelay: '-6s', animationDuration: '20s' }} />
      <div className="kd kd-twinkle" style={{ top: '22%', left: '22%' }}><Star fill="#FFC23C" size={30} /></div>
      <div className="kd kd-twinkle" style={{ bottom: '26%', right: '18%', animationDelay: '1s' }}><Star fill="#FF6FB5" size={26} /></div>
      <div className="kd kd-spin" style={{ top: '30%', right: '26%' }}><Sparkle fill="#3FA9F5" size={28} /></div>
      <Balloon color="#57C84D" size={42} style={{ bottom: '6%', left: '6%' }} />
      <Balloon color="#A368E8" size={34} style={{ top: '14%', right: '34%', animationDelay: '-2.5s' }} />
    </div>
  )
}
/* ─── Kids wavy section divider ─── */
function KidsWave({ color = '#FF8C00', flip = false }: { color?: string; flip?: boolean }) {
  return (
    <div className="kids-wave" style={flip ? { transform: 'scaleY(-1)' } : undefined} aria-hidden>
      <svg viewBox="0 0 1200 48" preserveAspectRatio="none">
        <path d="M0,30 C120,8 240,8 360,26 C480,44 600,44 720,26 C840,8 960,8 1080,26 C1140,35 1170,36 1200,30 L1200,48 L0,48 Z" fill={color} />
      </svg>
    </div>
  )
}

export default function Home() {
  const { theme } = useTheme()
  const isKids = theme === 'kids'

  return (
    <div>
      {/* ============ NAV ============ */}
      <Navbar />

      {/* ============ HERO ============ */}
      <header className="hero">
        <div className="hero-orb-1" aria-hidden />
        <div className="hero-orb-2" aria-hidden />
        {isKids && <KidsDecor />}
        <div className="container hero-grid">
          <div className="hero-copy">
            <h1>
              Glasses that <span className="squiggle">survive</span> being a kid.
            </h1>
            <p className="lede">
              Premium children&apos;s eyewear from Stallion. Built to bend through playgrounds,
              soccer goals and the occasional faceplant. Comfortable enough they actually want
              to wear them.
            </p>
            <div className="hero-ctas">
              {/* <Link href="/shop" className="btn btn-primary">Shop the collection <span className="btn-arrow"><Icon name="arrow" size={18} /></span></Link> */}
              <Link href="/collections" className="btn btn-primary">
                See the collection <span className="btn-arrow"><Icon name="arrow" size={18} /></span>
              </Link>
              {/* <Link href="/fit" className="btn btn-ghost">Find your fit</Link> */}
            </div>
            <div className="hero-trust">
              <span className="hero-stars">★★★★★</span>
              <span><strong>4.9 / 5</strong> family rated</span>
              <span><strong>Free</strong> shipping across India</span>
            </div>
          </div>

          {isKids ? (
            <div className="hero-kids-cast">
              <div className="hkc-grass-band" aria-hidden>
                <Image src="/images/grass.png" alt="" width={2508} height={627} priority className="hkc-grass-img" />
                <Image src="/images/grass.png" alt="" width={2508} height={627} priority className="hkc-grass-img hkc-grass-flip" />
              </div>
              <Image
                src="/assets/photos/kid-jumping-cutout.png"
                alt="Girl mid-jump wearing Foal & Pony glasses"
                width={955}
                height={1186}
                priority
                className="hkc-kid hkc-girl"
              />
              <Image
                src="/assets/photos/boy-jumping.png"
                alt="Boy mid-jump wearing Foal & Pony glasses"
                width={1086}
                height={1448}
                priority
                className="hkc-kid hkc-boy"
              />
              <Image
                src="/images/logo/foal-flip.png"
                alt=""
                width={859}
                height={907}
                priority
                className="hkc-mascot hkc-foal"
              />
              <Image
                src="/images/logo/pony-flip.png"
                alt=""
                width={895}
                height={977}
                priority
                className="hkc-mascot hkc-pony"
              />
            </div>
          ) : (
            <div className="hero-visual hero-visual-cutout">
              <Image
                src="/assets/photos/kid-jumping-cutout.png"
                alt="Kid mid-jump wearing Foal & Pony glasses"
                fill
                priority
                className="hero-photo hero-photo-cutout"
                sizes="(max-width: 1100px) 90vw, 540px"
              />
              <Image
                src="/images/logo/foal-jump.png"
                alt=""
                width={240}
                height={240}
                className="hero-mascot-float hero-mascot-foal"
                priority
              />
              <Image
                src="/images/logo/pony.png"
                alt=""
                width={260}
                height={260}
                className="hero-mascot-float hero-mascot-pony"
                priority
              />
            </div>
          )}
        </div>
      </header>

      {isKids && <KidsWave color="#FFF3DF" />}

      {/* ============ TRUST BAR, Premium only ============ */}
      {theme === 'premium' && (
        <section className="trust">
          <div className="container trust-row">
            <div className="trust-item">
              <span className="trust-ic"><Icon name="drop" /></span>
              <div>
                <div className="trust-num">2 m</div>
                <div className="trust-lbl">Drop-tested onto concrete</div>
              </div>
            </div>
            <div className="trust-item">
              <span className="trust-ic"><Icon name="refresh" /></span>
              <div>
                <div className="trust-num">10,000×</div>
                <div className="trust-lbl">Hinge bend cycles</div>
              </div>
            </div>
            <div className="trust-item">
              <span className="trust-ic"><Icon name="weight" /></span>
              <div>
                <div className="trust-num">12 g</div>
                <div className="trust-lbl">Barely-there weight</div>
              </div>
            </div>
            <div className="trust-item">
              <span className="trust-ic"><Icon name="badge" /></span>
              <div>
                <div className="trust-num">19</div>
                <div className="trust-lbl">Models · 100+ colours</div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ============ PLAY BREAK, Kids only (playful hook right under hero) ============ */}
      {theme === 'kids' && (
        <section className="section" id="play-cta">
          <div className="container">
            <div className="play-card">
              <div className="play-blob play-blob-1" aria-hidden />
              <div className="play-blob play-blob-2" aria-hidden />
              <div className="play-blob play-blob-3" aria-hidden />
              <div className="play-card-text">
                <span className="eyebrow">Pssst, over here!</span>
                <h2>
                  Glasses on? <em>Game on.</em>
                </h2>
                <p>
                  Take a play break with Brick Breaker, 25 levels of bright, bouncy,
                  brick-smashing fun. No sign-up. Just play.
                </p>
                <div className="hero-ctas">
                  <Link href="/games" className="btn btn-primary">
                    Play &amp; win <span className="btn-arrow"><Icon name="arrow" size={18} /></span>
                  </Link>
                </div>
              </div>
              <div className="play-card-art">
                <div className="bb-preview" aria-hidden>
                  <div className="bb-bricks">
                    <div className="bb-row"><i style={{ background: '#FF8C00' }} /><i style={{ background: '#FF8C00' }} /><i style={{ background: '#FF8C00' }} /><i style={{ background: '#FF8C00' }} /><i style={{ background: '#FF8C00' }} /></div>
                    <div className="bb-row"><i style={{ background: '#4CAF50' }} /><i style={{ background: '#4CAF50' }} /><i style={{ background: '#4CAF50' }} /><i style={{ background: '#4CAF50' }} /><i style={{ background: '#4CAF50' }} /></div>
                    <div className="bb-row"><i style={{ background: '#1E88E5' }} /><i style={{ background: '#1E88E5' }} /><i style={{ background: '#1E88E5' }} /><i style={{ background: '#1E88E5' }} /><i style={{ background: '#1E88E5' }} /></div>
                  </div>
                  <span className="bb-ball" />
                  <span className="bb-paddle" />
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ============ FEATURE SPOTLIGHT, Premium only ============ */}
      {theme === 'premium' && (
        <section className="section" id="why">
          <div className="container">
            <div className="s-head">
              <div>
                <span className="eyebrow">Why parents love us.</span>
                <h2>
                  Built different,<br /> because <em>kids are.</em>
                </h2>
              </div>
              <p>
                We obsessed over every gram, hinge, colour and comfort so you get one thing:
                frames that keep up, and stay on, all day long.
              </p>
            </div>
            <div className="features-grid">
              {features.map((f, i) => (
                <div key={i} className="feat">
                  <span className="feat-num">{f.num}</span>
                  <h3>{f.title}</h3>
                  <p>{f.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ============ TORTURE TEST ============ */}
      <section className="torture">
        <div className="container torture-grid">
          <div>
            <span className="eyebrow">Built for real kids.</span>
            <h2>
              We test them the way <em>your kid will.</em>
            </h2>
            <p className="lede">
              Every Foal &amp; Pony frame goes through our torture lab. Dropped, bent,
              frozen, sat on, and re-tested. Before it ever gets near a playground.
            </p>
            <div className="test-list">
              {tests.map((t, i) => (
                <div key={i} className="test-row">
                  <span className="test-ic"><Icon name={t.ic} /></span>
                  <div>
                    <strong>{t.title}</strong>
                    <span>{t.body}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="torture-visual-wrapper" style={{ position: 'relative' }}>
            <div className="torture-visual torture-reel" aria-label="Durability test motion reel">
              <Image
                src="/assets/photos/flexible-hinge.png"
                alt="A close-up demonstration of our flexible, bendable temple arm showing extreme hinge durability"
                fill
                sizes="(max-width: 1100px) 90vw, 540px"
                className="torture-reel-photo"
              />
              <div className="reel-scrim" aria-hidden />
              <div className="reel-frame reel-frame-a">
                <span>Drop test</span>
                <strong>50x Concrete</strong>
              </div>
              <div className="reel-frame reel-frame-b">
                <span>Flex test</span>
                <strong>10k hinge cycles</strong>
              </div>
              <div className="reel-frame reel-frame-c">
                <span>Weight</span>
                <strong>12g TR-90</strong>
              </div>
              <div className="reel-controls" aria-hidden>
                <span className="reel-play">▶</span>
                <span className="reel-track"><i style={{ width: '45%' }} /></span>
                <span className="reel-time">00:08</span>
              </div>
            </div>
            <div className="torture-stamp" style={{ zIndex: 10 }}>
              <span className="big">93%</span>
              <span className="sm">survive the first year break-free</span>
            </div>
          </div>
        </div>
      </section>

      {/* ============ FIND YOUR FIT, hidden until launch ============
      <section className="section fit" id="fit">
        <div className="container">
          <div className="fit-card">
            <div className="fit-text">
              <span className="eyebrow">Find your fit.</span>
              <h2>
                The right size, <em>first time.</em>
              </h2>
              <p>
                No more guesswork. Match your child's age and a couple of measurements
                to the perfect frame in under a minute, using our visual size guide.
              </p>
              <div className="fit-steps">
                <span className="fit-step"><b>1</b> Pick their age</span>
                <span className="fit-step"><b>2</b> Measure face width</span>
                <span className="fit-step"><b>3</b> Match a frame</span>
              </div>
              <Link href="/fit" className="btn btn-primary">
                Open the size guide
              </Link>
            </div>
            <div className="fit-img">
              <Image
                src="/assets/photos/scale-12g.png"
                alt="Foal & Pony ultra-lightweight child frames on a scale showing 12 grams"
                fill
                sizes="(max-width: 1100px) 90vw, 540px"
                style={{ objectFit: 'cover' }}
              />
              <div className="fit-chip">
                <span className="lbl">FRAME WEIGHT</span>
                <span className="val">12 grams</span>
              </div>
            </div>
          </div>
        </div>
      </section>
      */}

      {/* ============ FEATHERLIGHT, 12 g weight ============ */}
      <section className="section fit" id="weight">
        <div className="container">
          <div className="fit-card">
            <div className="fit-text">
              <span className="eyebrow">Barely there.</span>
              <h2>
                Just <em>12 grams</em> on their nose.
              </h2>
              <p>
                Around 12 grams of flexible TR-90, so light your kid forgets they&apos;re
                wearing them, which means they actually keep them on, all day long.
              </p>
              <Link href="/collections" className="btn btn-primary">
                See the collection <span className="btn-arrow"><Icon name="arrow" size={18} /></span>
              </Link>
            </div>
            <div className="fit-img">
              <Image
                src="/assets/photos/scale-12g.png"
                alt="Foal & Pony ultra-light child frames on a scale showing 12 grams"
                fill
                sizes="(max-width: 1100px) 90vw, 540px"
                style={{ objectFit: 'cover' }}
              />
              <div className="fit-chip">
                <span className="lbl">FRAME WEIGHT</span>
                <span className="val">12 grams</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ SOCIAL PROOF ============ */}
      <section className="section proof">
        <div className="container">
          <div className="s-head">
            <span className="eyebrow">Loved by the toughest critics.</span>
            <h2>
              Parent reviewed. <em>Kid-tested.</em>
            </h2>
            <p>
              Real reviews from families across India. Glasses survive school, sport,
              cousin weddings and everything else childhood throws at them.
            </p>
          </div>
          <div className="testi-grid">
            {testimonials.map((t, i) => (
              <div key={i} className="testi">
                <div className="testi-stars">★★★★★</div>
                <div className="testi-body">&ldquo;{t.body}&rdquo;</div>
                <div className="testi-who">
                  <span className="testi-avatar">{t.name.charAt(0)}</span>
                  <div>
                    <div className="testi-name">{t.name}</div>
                    <div className="testi-meta">{t.meta}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ SCHOOLS / B2B, hidden until launch ============
      <section className="section" id="schools">
        <div className="container">
          <div className="schools-card">
            <div>
              <span className="eyebrow">For schools and clinics.</span>
              <h2>
                Eyewear partnerships <em>that scale.</em>
              </h2>
              <p>
                Equip classrooms, vision programs and paediatric clinics with frames built
                to survive real childhoods. At volume, with the paperwork handled.
              </p>
              <div className="schools-ctas">
                <Link href="/contact?topic=bulk" className="btn btn-primary">
                  Bulk orders <span className="btn-arrow"><Icon name="arrow" size={18} /></span>
                </Link>
                <Link href="/contact?topic=partner" className="btn btn-outline">
                  Partner with us
                </Link>
              </div>
            </div>
            <div className="schools-mini">
              <div className="schools-mini-row">
                <strong>Built to outlast budgets</strong>
                <span>Lower replacement rates and bulk-friendly pricing keep programme costs predictable, year after year.</span>
              </div>
              <div className="schools-mini-row">
                <strong>Standards &amp; compliance</strong>
                <span>Impact-tested, UV-rated and certified to children&apos;s safety standards. Documentation included.</span>
              </div>
              <div className="schools-mini-row">
                <strong>Customisable &amp; co-branded</strong>
                <span>Tailored size kits, colour ranges and optional co-branding for your school or clinic.</span>
              </div>
            </div>
          </div>
        </div>
      </section>
      */}

      {/* ============ PARTNER BANNER, shown in both themes ============ */}
      <section className="section" id="partner-cta">
        <div className="container">
          <div className="schools-card">
            <div>
              <span className="eyebrow">Let&apos;s work together.</span>
              <h2>
                Let&apos;s build something <em>together.</em>
              </h2>
              <p>
                Bulk pricing. Priority support. Large-volume orders handled end to end,
                with frames built to survive real childhoods.
              </p>
              <div className="schools-ctas">
                <Link href="/partner" className="btn btn-primary">
                  Partner with us <span className="btn-arrow"><Icon name="arrow" size={18} /></span>
                </Link>
              </div>
            </div>
            <div className="schools-mini">
              <div className="schools-mini-row">
                <strong>Built to outlast budgets</strong>
                <span>Lower replacement rates and volume-friendly pricing keep costs predictable, year after year.</span>
              </div>
              <div className="schools-mini-row">
                <strong>Standards &amp; compliance</strong>
                <span>Impact-tested, UV-rated and certified to children&apos;s safety standards. Documentation included.</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ FINAL CTA ============ */}
      <section className="finale">
        {isKids && <FinaleDecor />}
        <div className="container">
          <Image
            src="/images/logo/foal-jump.png"
            alt=""
            width={180}
            height={180}
            className="finale-mascot"
          />
          <span className="eyebrow">Ready when they are.</span>
          <h2>
            Give their adventures <em>clearer vision.</em>
          </h2>
          <p>
            Durable, beautiful frames your kid will love and you won&apos;t dread replacing.
            Free shipping across India and easy returns, no fuss.
          </p>
          <div className="hero-ctas">
            {/* <Link href="/shop" className="btn btn-primary">Shop the collection</Link> */}
            {/* <Link href="/fit" className="btn btn-ghost">Find your fit</Link> */}
            <Link href="/collections" className="btn btn-primary">
              See the collection <span className="btn-arrow"><Icon name="arrow" size={18} /></span>
            </Link>
          </div>
          <div className="finale-note">
            <Icon name="badge" size={16} /> Free shipping across India · easy returns
          </div>
        </div>
      </section>

      {/* ============ FOOTER ============ */}
      <footer className="footer">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-brand">
              <Image src="/assets/foalandpony_wordmark.png" alt="Foal & Pony" width={180} height={48} />
              <p>
                Premium eyewear for little adventurers. Fun, durable, made with love by
                Stallion Eyewear. Little eyes, big adventures.
              </p>
              <div className="footer-social">
                <a
                  href="https://www.instagram.com/foalandpony.eyewear?igsh=bmNsdXJxOHU0dDRq"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                >
                  <Icon name="instagram" size={18} />
                </a>
                <a href="https://wa.me/919324337504" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
                  <Icon name="whatsapp" size={18} />
                </a>
                <a href="mailto:hello@foalandpony.com" aria-label="Email">
                  <Icon name="mail" size={18} />
                </a>
              </div>
            </div>
            {/* footer Shop column, hidden until launch
            <div className="footer-col">
              <h4>Shop</h4>
              <ul>
                <li><Link href="/shop">All frames</Link></li>
                <li><Link href="/shop?shape=round">Round</Link></li>
                <li><Link href="/shop?shape=square">Square</Link></li>
                <li><Link href="/shop?shape=oval">Oval</Link></li>
              </ul>
            </div>
            */}
            <div className="footer-col">
              <h4>Explore</h4>
              <ul>
                <li><Link href="/collections">Collections</Link></li>
                <li><Link href="/blog">Blog</Link></li>
                <li><Link href="/games">Games</Link></li>
              </ul>
            </div>
            <div className="footer-col">
              <h4>Help</h4>
              <ul>
                {/* <li><Link href="/fit">Find your fit</Link></li> */}
                <li><Link href="/policies/care">Care guide</Link></li>
                <li><Link href="/policies/shipping">Shipping &amp; returns</Link></li>
                <li><Link href="/partner">Partner with us</Link></li>
              </ul>
            </div>
            <div className="footer-col">
              <h4>Company</h4>
              <ul>
                <li><a href="#why">Why Foal &amp; Pony</a></li>
                <li><Link href="/partner">Partner with us</Link></li>
                <li><Link href="/about">Our story</Link></li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <span>© {new Date().getFullYear()} Foal &amp; Pony. All rights reserved.</span>
            <span>
              A brand by <strong>Stallion Eyewear</strong> · BUILT BY{' '}
              <a href="https://garihc.com" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--orange-warm)', fontWeight: 700 }}>GARIHC</a>
            </span>
          </div>
        </div>
      </footer>
    </div>
  )
}
