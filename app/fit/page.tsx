'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { InteractiveSizeChart } from '@/components/shop/InteractiveSizeChart'

/* Local icon set */
function Ic({ name, size = 22 }: { name: string; size?: number }) {
  const s = size
  const common = {
    width: s,
    height: s,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 2,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  }
  switch (name) {
    case 'arrow':
      return <svg {...common}><path d="M5 12h14M13 6l6 6-6 6" /></svg>
    case 'ruler':
      return <svg {...common}><path d="M3 9l6-6 12 12-6 6z" /><path d="M7 9l2 2M10 6l2 2M13 9l2 2M16 6l2 2" /></svg>
    case 'whatsapp':
      return <svg {...common}><path d="M21 12a9 9 0 11-17.5-3L3 21l5.4-1.4A9 9 0 0021 12z" /><path d="M9 10c.5 2 1.8 3.7 4 4.5l1.6-1.3 2.6.9c.2 1.6-1.5 2.4-3 2.1A8 8 0 017 11c-.3-1.5.5-3.1 2-3l.9 2.5z" /></svg>
    case 'face':
      return <svg {...common}><circle cx="12" cy="12" r="9" /><circle cx="9" cy="11" r=".8" fill="currentColor" /><circle cx="15" cy="11" r=".8" fill="currentColor" /><path d="M9 15c1 1.2 5 1.2 6 0" /></svg>
    case 'eye':
      return <svg {...common}><path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z" /><circle cx="12" cy="12" r="3" /></svg>
    case 'temple':
      return <svg {...common}><path d="M3 12c4 0 6-2 9-2s5 2 9 2" /><circle cx="12" cy="10" r="1.4" /></svg>
    case 'check':
      return <svg {...common}><polyline points="20 6 9 17 4 12" /></svg>
    default: return null
  }
}

const ageGroups = [
  {
    key: 'foals',
    range: 'Ages 4 to 7',
    label: 'Ages 4 – 7',
    color: '#E2F3DC',
    accent: '#3F8B4D',
    lens: '44 – 46 mm',
    bridge: '15 – 18 mm',
    total: '103 – 110 mm',
    temple: '130 – 136 mm',
    head: '49 – 52 cm',
    models: ['LUNA', 'SCOUT', 'RIVER', 'JUMPER', 'PIPPIN', 'DAISY', 'FERN'],
    note: 'Smallest frames in the range. Look for Special Nose Pad or Flexible Side models.',
  },
  {
    key: 'trotters',
    range: 'Ages 8 to 12',
    label: 'Ages 8 – 12',
    color: '#E4F0FB',
    accent: '#2E83BD',
    lens: '46 – 48 mm',
    bridge: '15 – 18 mm',
    total: '107 – 114 mm',
    temple: '136 – 137 mm',
    head: '52 – 55 cm',
    models: ['FABLE', 'OLIVER', 'HARPER', 'PIXIE', 'CLOVER', 'BECKETT', 'SAWYER', 'SKIPPER', 'ARCHER', 'STAR', 'WILLOW'],
    note: 'Widest selection. Soft Flex, Medium Flex and Polarised Clip-on options.',
  },
  {
    key: 'ponies',
    range: 'Ages 13+',
    label: 'Ages 13+',
    color: '#F1E6FB',
    accent: '#7245A0',
    lens: '49 – 50 mm',
    bridge: '16 – 17 mm',
    total: '114 – 117 mm',
    temple: '136 – 138 mm',
    head: '54 – 57 cm',
    models: ['ARCHER', 'STAR', 'ELLE', 'WILLOW'],
    note: 'Closer to adult sizing. ARCHER, STAR and WILLOW overlap with 8–12.',
  },
]

const tech = [
  {
    key: 'nose',
    color: '#E2F3DC',
    accent: '#3F8B4D',
    title: 'Special Nose Pad',
    sub: 'Ages 4 – 7 only · LUNA, SCOUT',
    body: 'Best for first-time wearers. The soft pad grips gently without pinching, keeping frames in place even during nap time or active play. Ideal for flat or low nose bridges.',
  },
  {
    key: 'flex',
    color: '#E4F0FB',
    accent: '#2E83BD',
    title: 'Flexible Side',
    sub: 'Ages 4 – 14+ · 12 models',
    body: 'Temples bend past 90° and snap back to shape without memory loss. Soft Flex (■400) is slightly more pliable; Medium Flex (■375) has a firmer hold. Best all-round choice for active kids.',
  },
  {
    key: 'polar',
    color: '#FFEBCC',
    accent: '#B96E00',
    title: 'Polarised Clip-on',
    sub: 'Ages 4 – 14+ · PIPPIN, DAISY, SAWYER, SKIPPER, WILLOW',
    body: 'Prescription frame with a detachable polarised polycarbonate clip-on. Converts to sunglasses in seconds. Best for kids who spend time outdoors or in bright sunlight.',
  },
]

const tips = [
  'The frame should sit level, not tilting up or down on one side.',
  'Temples should rest lightly on the ears, not dig in or sit above them.',
  'The nose pad (or bridge) should sit flush, with no gaps or pressure marks.',
  'Aim for around 5 mm clearance between the lash line and the lens.',
  'When in doubt, visit a Foal & Pony stockist for a professional fitting.',
]

export default function FitPage() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div>
      {/* NAV (same shell as homepage) */}
      <nav className="nav">
        <div className="nav-inner">
          <Link href="/" className="nav-logo" onClick={() => setMenuOpen(false)}>
            <Image src="/assets/foalandpony_wordmark.png" alt="Foal & Pony" width={160} height={42} priority />
          </Link>
          <ul className={`nav-links ${menuOpen ? 'open' : ''}`}>
            <li><Link href="/shop" onClick={() => setMenuOpen(false)}>Shop</Link></li>
            <li><Link href="/collections" onClick={() => setMenuOpen(false)}>Collections</Link></li>
            <li><Link href="/fit" onClick={() => setMenuOpen(false)}>Find your fit</Link></li>
          </ul>
          <div className="nav-actions">
            <Link href="/cart" className="nav-cart" onClick={() => setMenuOpen(false)}>Cart</Link>
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

      {/* ====== HERO ====== */}
      <header className="fit-hero">
        <div className="container fit-hero-grid">
          <div>
            <span className="eyebrow">One guide, every age.</span>
            <h1 className="fit-h1">
              Find the right fit, <em>first try.</em>
            </h1>
            <p className="fit-lede">
              Every Foal &amp; Pony frame uses a three-number sizing code. Once you can
              read it, picking the right pair takes under a minute. Here&apos;s the
              whole map.
            </p>
            <div className="fit-jump">
              <a href="#dim" className="fit-jump-link">Read the code</a>
              <a href="#age" className="fit-jump-link">By age</a>
              <a href="#measure" className="fit-jump-link">Measure</a>
              <a href="#tech" className="fit-jump-link">Pick the tech</a>
            </div>
          </div>
          <div className="fit-hero-art" style={{ width: '100%', position: 'relative', height: '360px', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 20px 48px -15px rgba(31,58,92,.18)' }}>
            <Image
              src="/assets/photos/portrait-mid.png"
              alt="Indian child wearing Foal & Pony mid-sized eyeglasses"
              fill
              sizes="(max-width: 1100px) 90vw, 540px"
              style={{ objectFit: 'cover', objectPosition: 'center 30%' }}
            />
          </div>
        </div>
      </header>

      {/* ====== STEP 1: READ THE NUMBERS ====== */}
      <section className="section" id="dim">
        <div className="container fit-dim-grid">
          <div>
            <span className="eyebrow">Read the numbers.</span>
            <h2 className="fit-h2">
              Three numbers, all you need <em>to read a frame.</em>
            </h2>
            <p className="fit-p">
              Every Foal &amp; Pony frame is stamped with a three-number code in
              millimetres. The numbers tell you exactly how wide each lens is, how far
              apart they sit, and how long the arms are.
            </p>
            <dl className="dim-list">
              <div><dt><span className="dot a">A</span> Lens width</dt><dd>One lens opening, in mm. E.g. 45 mm.</dd></div>
              <div><dt><span className="dot b">B</span> Bridge</dt><dd>The gap between the two lenses, in mm. E.g. 16 mm.</dd></div>
              <div><dt><span className="dot c">C</span> Total width</dt><dd>Lens × 2 + bridge. Compare to your child&apos;s face width.</dd></div>
              <div><dt><span className="dot d">D</span> Temple</dt><dd>The arm, from hinge to tip. E.g. 130 mm.</dd></div>
            </dl>
          </div>
          <div className="dim-card">
            <div className="dim-code">
              <span>45</span><i>·</i><span>16</span><i>·</i><span>130</span>
            </div>
            <div className="dim-row">
              <span>Lens</span><strong>45 mm</strong>
            </div>
            <div className="dim-row">
              <span>Bridge</span><strong>16 mm</strong>
            </div>
            <div className="dim-row">
              <span>Temple</span><strong>130 mm</strong>
            </div>
            <div className="dim-total">
              Total frame width<br />
              <strong>45 + 45 + 16 = 106 mm</strong>
              <span>Measure your child&apos;s face and compare to this number.</span>
            </div>
          </div>
        </div>
      </section>

      {/* ====== STEP 2: AGE GROUPS ====== */}
      <section className="section fit-ages" id="age">
        <div className="container">
          <div className="s-head">
            <div>
              <span className="eyebrow">Find your age group.</span>
              <h2 className="fit-h2">
                Pick the age, the size <em>follows.</em>
              </h2>
            </div>
            <p className="fit-p" style={{ maxWidth: 460 }}>
              Each model is built for a specific age band. Start here, then double-check
              against total frame width.
            </p>
          </div>

          <InteractiveSizeChart />
        </div>
      </section>

      {/* ====== STEP 3: HOW TO MEASURE ====== */}
      <section className="section" id="measure">
        <div className="container">
          <div className="s-head">
            <div>
              <span className="eyebrow">Three measurements.</span>
              <h2 className="fit-h2">
                A soft tape, your kid, <em>and a minute.</em>
              </h2>
            </div>
            <p className="fit-p" style={{ maxWidth: 460 }}>
              The single most reliable check is total frame width against face width.
              The other two confirm the fit.
            </p>
          </div>
          <div className="measure-grid">
            <MeasureStep
              n="01"
              ic="face"
              title="Face width"
              body="Measure temple to temple across the widest part of the face. This should match the total frame width (C), or be very slightly less."
            />
            <MeasureStep
              n="02"
              ic="eye"
              title="Bridge / PD"
              body="Measure the pupillary distance (the gap between the centres of both pupils). This should be close to the bridge measurement (B)."
            />
            <MeasureStep
              n="03"
              ic="temple"
              title="Temple"
              body="The arm (D) should reach comfortably behind the ear without pressing into the skull. If the tip pokes out beyond the ear, it's too long."
            />
          </div>
        </div>
      </section>

      {/* ====== STEP 4: TECHNOLOGY ====== */}
      <section className="section fit-tech" id="tech">
        <div className="container">
          <div className="s-head">
            <div>
              <span className="eyebrow">Pick the technology.</span>
              <h2 className="fit-h2">
                Three constructions, <em>one easy choice.</em>
              </h2>
            </div>
            <p className="fit-p" style={{ maxWidth: 460 }}>
              Once size is sorted, pick the construction that matches your kid&apos;s
              age, nose bridge and time outdoors.
            </p>
          </div>
          <div className="tech-grid">
            {tech.map(t => (
              <div
                key={t.key}
                className="tech-card"
                style={{ background: t.color, color: t.accent } as React.CSSProperties}
              >
                <div className="tech-dot" style={{ background: t.accent }}>
                  <Ic name="check" size={16} />
                </div>
                <h3 className="tech-title">{t.title}</h3>
                <span className="tech-sub">{t.sub}</span>
                <p className="tech-body">{t.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ====== QUICK TIPS ====== */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="tips-card">
            <div>
              <span className="eyebrow">Quick fit tips.</span>
              <h2 className="fit-h2" style={{ fontSize: '38px' }}>
                The five-second <em>sanity check.</em>
              </h2>
              <p className="fit-p" style={{ marginTop: 12 }}>
                Once the frame is on, run down this list. If anything fails, the size or
                fit needs a tweak.
              </p>
            </div>
            <ul className="tips-list">
              {tips.map((t, i) => (
                <li key={i}>
                  <span className="tips-tick"><Ic name="check" size={14} /></span>
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ====== FINAL CTA ====== */}
      <section className="finale">
        <div className="container">
          <Image
            src="/assets/foal.png"
            alt=""
            width={160}
            height={160}
            className="finale-mascot"
          />
          <span className="eyebrow">Still on the fence?</span>
          <h2>
            We&apos;ll help you pick. <em>For free.</em>
          </h2>
          <p>
            Send us your kid&apos;s age and a face-width measurement on WhatsApp. We&apos;ll
            recommend the right model, or point you to your nearest stockist for a
            proper fitting.
          </p>
          <div className="hero-ctas">
            <a href="https://wa.me/919999999999" target="_blank" rel="noopener noreferrer" className="btn btn-primary">
              Ask on WhatsApp <Ic name="whatsapp" size={18} />
            </a>
            <Link href="/shop" className="btn btn-ghost">
              Browse the collection <Ic name="arrow" size={18} />
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  )
}


function MeasureStep({ n, ic, title, body }: { n: string; ic: string; title: string; body: string }) {
  return (
    <div className="measure-step">
      <div className="measure-step-top">
        <span className="measure-n">{n}</span>
        <span className="measure-ic"><Ic name={ic} size={22} /></span>
      </div>
      <h3 className="measure-title">{title}</h3>
      <p className="measure-body">{body}</p>
    </div>
  )
}

function SiteFooter() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <Image src="/assets/foalandpony_wordmark.png" alt="Foal & Pony" width={180} height={48} />
            <p>Premium eyewear for little adventurers. Fun, durable, made with love by Stallion Eyewear. Little eyes, big adventures.</p>
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
              <li><Link href="/policies/warranty">Warranty</Link></li>
              <li><Link href="/policies/care">Care guide</Link></li>
              <li><Link href="/policies/shipping">Shipping &amp; returns</Link></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Company</h4>
            <ul>
              <li><Link href="/#why">Why Foal &amp; Pony</Link></li>
              <li><Link href="/#schools">For schools</Link></li>
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
  )
}
