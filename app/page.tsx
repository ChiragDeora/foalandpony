'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'


/* Inline icon set — quirky outline strokes, drawn here so we don't ship a UI lib */
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

const ageGroups = [
  {
    key: 'foals',
    href: '/shop?age=4-7',
    range: 'Ages 4 to 7',
    blurb: 'First-glasses friendly. Special nose pads grip without pinching, even at nap time.',
    models: ['LUNA', 'SCOUT', 'RIVER', 'JUMPER', 'PIPPIN', 'DAISY', 'FERN'],
    bg: '#FCE9D2',
    accent: '#B96E00',
    swatches: ['#E89B5C', '#F7C56B', '#D2766E', '#7BABE0'],
    photo: '/assets/photos/portrait-tiny.png',
  },
  {
    key: 'trotters',
    href: '/shop?age=8-12',
    range: 'Ages 8 to 12',
    blurb: 'Our widest spread. Soft flex, medium flex, and polarised clip-on options for outdoor days.',
    models: ['FABLE', 'OLIVER', 'HARPER', 'PIXIE', 'CLOVER', 'BECKETT', 'SAWYER', 'SKIPPER', 'ARCHER', 'STAR', 'WILLOW'],
    bg: '#DCEEFB',
    accent: '#2E83BD',
    swatches: ['#2E83BD', '#1F3A5C', '#6DBE7A', '#E89B5C'],
    photo: '/assets/photos/portrait-mid.png',
  },
  {
    key: 'ponies',
    href: '/shop?age=13',
    range: 'Ages 13 and up',
    blurb: 'Bigger frames closer to adult sizing, without losing the playful colour range.',
    models: ['ARCHER', 'STAR', 'ELLE', 'WILLOW'],
    bg: '#E7E0F4',
    accent: '#7245A0',
    swatches: ['#1F3A5C', '#7245A0', '#D2766E', '#3F8B4D'],
    photo: '/assets/photos/portrait-teen.png',
  },
]

const tests = [
  { ic: 'drop', title: 'The drop test', body: 'Two metres of concrete. Fifty drops in a row. No splinters.' },
  { ic: 'refresh', title: 'The bend test', body: '10,000 hinge cycles to 180°. Snaps right back, every time.' },
  { ic: 'splash', title: 'The everything-else test', body: 'Sand. Pool water. Pasta sauce. Backpack bottoms. All survived.' },
]

const fitSpecs = [
  { key: 'lens', mark: 'A', label: 'Lens', value: '44-50 mm', color: '#3F8B4D' },
  { key: 'bridge', mark: 'B', label: 'Bridge', value: '15-18 mm', color: '#2E83BD' },
  { key: 'total', mark: 'C', label: 'Total width', value: '103-117 mm', color: '#B96E00' },
  { key: 'temple', mark: 'D', label: 'Temple', value: '130-138 mm', color: '#7245A0' },
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

function AgeFrameSilhouette({ shape, color }: { shape: 'round' | 'square' | 'rectangle'; color: string }) {
  if (shape === 'round') {
    return (
      <svg viewBox="0 0 320 160" className="age-frame-svg" aria-hidden>
        <circle cx="80" cy="80" r="56" fill="none" stroke={color} strokeWidth="6" />
        <circle cx="240" cy="80" r="56" fill="none" stroke={color} strokeWidth="6" />
        <path d="M136 76 q24 -14 48 0" stroke={color} strokeWidth="6" fill="none" strokeLinecap="round" />
        <path d="M24 78 q-12 -4 -22 -2" stroke={color} strokeWidth="6" fill="none" strokeLinecap="round" />
        <path d="M296 78 q12 -4 22 -2" stroke={color} strokeWidth="6" fill="none" strokeLinecap="round" />
      </svg>
    )
  }
  if (shape === 'square') {
    return (
      <svg viewBox="0 0 320 160" className="age-frame-svg" aria-hidden>
        <rect x="22" y="36" width="116" height="92" rx="18" fill="none" stroke={color} strokeWidth="6" />
        <rect x="182" y="36" width="116" height="92" rx="18" fill="none" stroke={color} strokeWidth="6" />
        <path d="M138 70 q22 -14 44 0" stroke={color} strokeWidth="6" fill="none" strokeLinecap="round" />
        <path d="M22 78 q-12 -4 -22 -2" stroke={color} strokeWidth="6" fill="none" strokeLinecap="round" />
        <path d="M298 78 q12 -4 22 -2" stroke={color} strokeWidth="6" fill="none" strokeLinecap="round" />
      </svg>
    )
  }
  // rectangle
  return (
    <svg viewBox="0 0 320 160" className="age-frame-svg" aria-hidden>
      <rect x="18" y="48" width="128" height="68" rx="14" fill="none" stroke={color} strokeWidth="6" />
      <rect x="174" y="48" width="128" height="68" rx="14" fill="none" stroke={color} strokeWidth="6" />
      <path d="M146 76 q14 -8 28 0" stroke={color} strokeWidth="6" fill="none" strokeLinecap="round" />
      <path d="M18 82 q-12 -4 -22 -2" stroke={color} strokeWidth="6" fill="none" strokeLinecap="round" />
      <path d="M302 82 q12 -4 22 -2" stroke={color} strokeWidth="6" fill="none" strokeLinecap="round" />
    </svg>
  )
}

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div>
      {/* ============ NAV ============ */}
      <nav className="nav">
        <div className="nav-inner">
          <Link href="/" className="nav-logo" onClick={() => setMenuOpen(false)}>
            <Image src="/assets/foalandpony_wordmark.png" alt="Foal & Pony" width={160} height={42} priority />
          </Link>
          <ul className={`nav-links ${menuOpen ? 'open' : ''}`}>
            <li><Link href="/shop" onClick={() => setMenuOpen(false)}>Shop</Link></li>
            <li><a href="#why" onClick={() => setMenuOpen(false)}>Why us</a ></li>
            <li><a href="#ages" onClick={() => setMenuOpen(false)}>Collections</a></li>
            <li><Link href="/fit" onClick={() => setMenuOpen(false)}>Find your fit</Link></li>
            <li><a href="#schools" onClick={() => setMenuOpen(false)}>For schools</a></li>
          </ul>
          <div className="nav-actions">
            <Link href="/cart" className="nav-cart" aria-label="Cart">
              <Icon name="cart" size={20} /> Cart
            </Link>
            <Link href="/shop" className="nav-shop">Shop now</Link>
            <button
              className="nav-burger"
              onClick={() => setMenuOpen(v => !v)}
              aria-label="Toggle menu"
            >
              {menuOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>
      </nav>

      {/* ============ HERO ============ */}
      <header className="hero">
        <div className="hero-orb-1" aria-hidden />
        <div className="hero-orb-2" aria-hidden />
        <div className="container hero-grid">
          <div className="hero-copy">
            <span className="hero-tag">
              <span className="hero-tag-dot">★</span>
              Optometrist-designed eyewear
            </span>
            <h1>
              Glasses that <span className="squiggle">survive</span> being a kid.
            </h1>
            <p className="lede">
              Premium children&apos;s eyewear from Stallion. Built to bend through playgrounds,
              soccer goals and the occasional faceplant. Beautiful enough they actually want
              to wear them.
            </p>
            <div className="hero-ctas">
              <Link href="/shop" className="btn btn-primary">
                Shop the collection <span className="btn-arrow"><Icon name="arrow" size={18} /></span>
              </Link>
              <Link href="/fit" className="btn btn-ghost">Find your fit</Link>
            </div>
            <div className="hero-trust">
              <span className="hero-stars">★★★★★</span>
              <span><strong>4.9 / 5</strong> family rated</span>
              <span><strong>Free</strong> shipping across India</span>
            </div>
          </div>

          <div className="hero-visual">
            <Image
              src="/assets/photos/kid-jumping.jpeg"
              alt="Kid mid-jump wearing Foal & Pony glasses"
              fill
              priority
              className="hero-photo"
              sizes="(max-width: 1100px) 90vw, 540px"
            />
            <Image
              src="/assets/foal.png"
              alt=""
              width={240}
              height={240}
              className="hero-mascot-float"
              priority
            />
            <div className="badge-float badge-tr">
              <span className="b-icon"><Icon name="hinge" size={18} /></span>
              <span>
                Bends, never snaps
                <span className="b-sub">Memory-flex hinges</span>
              </span>
            </div>
            <div className="badge-float badge-br">
              <span className="b-icon"><Icon name="badge" size={18} /></span>
              <span>
                Drop-tested
                <span className="b-sub">2 m onto concrete</span>
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* ============ TRUST BAR ============ */}
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

      {/* ============ FEATURE SPOTLIGHT ============ */}
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
              We obsessed over every gram, hinge and colour so you get one thing: frames
              that keep up, and stay on, all day long.
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

      {/* ============ SHOP BY AGE ============ */}
      <section className="section" id="ages" style={{ background: 'var(--paper)' }}>
        <div className="container">
          <div className="s-head">
            <div>
              <span className="eyebrow">Sized for them, not you.</span>
              <h2>
                Frames they&apos;ll love,<br />
                <em>sized for who they are.</em>
              </h2>
            </div>
            <p>
              Every frame is proportioned for a specific age range. Pick the right group
              and the fit takes care of itself.
            </p>
          </div>
          <div className="ages-grid">
            {ageGroups.map(g => (
              <Link key={g.key} href={g.href} className="age-card">
                <div className="age-img age-img-photo" style={{ ['--age-bg' as string]: g.bg }}>
                  <Image
                    src={g.photo}
                    alt={`Child wearing Foal & Pony frames, ${g.range.toLowerCase()}`}
                    fill
                    sizes="(max-width: 1100px) 90vw, 380px"
                    className="age-photo"
                  />
                  <div className="age-swatches">
                    {g.swatches.map((c, j) => (
                      <span key={j} className="age-swatch" style={{ background: c }} />
                    ))}
                  </div>
                </div>
                <div className="age-body">
                  <h3>{g.range}</h3>
                  <p>{g.blurb}</p>
                  <div className="age-models">
                    {g.models.slice(0, 6).map(m => <span key={m} className="age-model">{m}</span>)}
                    {g.models.length > 6 && <span className="age-model">+{g.models.length - 6}</span>}
                  </div>
                  <span className="age-cta">
                    Browse the collection <Icon name="arrow" size={16} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

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

      {/* ============ FIND YOUR FIT ============ */}
      <section className="section fit" id="fit">
        <div className="container">
          <div className="fit-card">
            <div className="fit-text">
              <span className="eyebrow">Find your fit.</span>
              <h2>
                The right size, <em>first time.</em>
              </h2>
              <p>
                No more guesswork. Match your child&apos;s age and a couple of measurements
                to the perfect frame in under a minute, using our visual size guide.
              </p>
              <div className="fit-steps">
                <span className="fit-step"><b>1</b> Pick their age</span>
                <span className="fit-step"><b>2</b> Measure face width</span>
                <span className="fit-step"><b>3</b> Match a frame</span>
              </div>
              <Link href="/fit" className="btn btn-primary">
                Open the size guide <span className="btn-arrow"><Icon name="ruler" size={18} /></span>
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

      {/* ============ SCHOOLS / B2B ============ */}
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

      {/* ============ FINAL CTA ============ */}
      <section className="finale">
        <div className="container">
          <Image
            src="/assets/foal.png"
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
            <Link href="/shop" className="btn btn-primary">
              Shop the collection <span className="btn-arrow"><Icon name="arrow" size={18} /></span>
            </Link>
            <Link href="/fit" className="btn btn-ghost">Find your fit</Link>
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
                <a href="https://wa.me/919999999999" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
                  <Icon name="whatsapp" size={18} />
                </a>
                <a href="mailto:hello@foalandpony.com" aria-label="Email">
                  <Icon name="mail" size={18} />
                </a>
              </div>
            </div>
            <div className="footer-col">
              <h4>Shop</h4>
              <ul>
                <li><Link href="/shop">All frames</Link></li>
                <li><Link href="/shop?age=4-7">Ages 4–7</Link></li>
                <li><Link href="/shop?age=8-12">Ages 8–12</Link></li>
                <li><Link href="/shop?age=13">Ages 13+</Link></li>
              </ul>
            </div>
            <div className="footer-col">
              <h4>Help</h4>
              <ul>
                <li><Link href="/fit">Find your fit</Link></li>
                <li><Link href="/policies/care">Care guide</Link></li>
                <li><Link href="/policies/shipping">Shipping &amp; returns</Link></li>
                <li><Link href="/contact">Contact us</Link></li>
              </ul>
            </div>
            <div className="footer-col">
              <h4>Company</h4>
              <ul>
                <li><a href="#why">Why Foal &amp; Pony</a></li>
                <li><a href="#schools">For schools &amp; clinics</a></li>
                <li><Link href="/about">Our story</Link></li>
                <li><Link href="/contact">Contact</Link></li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <span>© {new Date().getFullYear()} Foal &amp; Pony. All rights reserved.</span>
            <span>A brand by <strong>Stallion Eyewear</strong> · BUILT BY GARIHC</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
