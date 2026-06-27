'use client'

import Image from 'next/image'
import Link from 'next/link'
import type { ProductShape } from '@/lib/sanity/shapes'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'

export type ShapeGroup = {
  key: ProductShape
  label: string
  href: string
  blurb: string
  models: string[]
  image: string | null
  bg: string
  accent: string
  swatches: string[]
}

function Icon({ name, size = 22 }: { name: string; size?: number }) {
  const common = {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 2,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  }
  switch (name) {
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
          <circle cx="17.5" cy="6.5" r=".8" fill="currentColor" />
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

export function CollectionsView({ groups }: { groups: ShapeGroup[] }) {
  return (
    <div>
      <Navbar />

      {/* ============ COLLECTIONS ============ */}
      <section className="section" style={{ background: 'var(--paper)' }}>
        <div className="container">
          <div className="s-head">
            <div>
              <span className="eyebrow">Shop the collections.</span>
              <h2>
                Frames they&apos;ll love,<br />
                <em>sized for their face shape.</em>
              </h2>
            </div>
            <p>
              Every frame is built around a face shape. Pick the right silhouette
              and the fit takes care of itself.
            </p>
          </div>
          <div className="ages-grid">
            {groups.map(g => (
              <Link key={g.key} href={g.href} className="age-card">
                <div className="age-img age-img-photo" style={{ ['--age-bg' as string]: g.bg }}>
                  {g.image ? (
                    <Image
                      src={g.image}
                      alt={`Foal & Pony ${g.label.toLowerCase()} frames`}
                      fill
                      sizes="(max-width: 1100px) 90vw, 380px"
                      className="age-photo"
                    />
                  ) : null}
                  <div className="age-swatches">
                    {g.swatches.map((c, j) => (
                      <span key={j} className="age-swatch" style={{ background: c }} />
                    ))}
                  </div>
                </div>
                <div className="age-body">
                  <h3>{g.label}</h3>
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

      <Footer />
    </div>
  )
}
