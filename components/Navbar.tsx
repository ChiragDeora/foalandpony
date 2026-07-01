'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'

const NAV_LINKS = [
  { href: '/shop', label: 'Shop' },
  { href: '/collections', label: 'Collections' },
  { href: '/#care', label: 'Kids Eye Care' },
  { href: '/blog', label: 'Blog' },
  { href: '/partner', label: 'Partner with us' },
]

function KidsZoneButton({ inDrawer = false }: { inDrawer?: boolean }) {
  return (
    <Link
      href="/games"
      className={`fp-kidszone-btn${inDrawer ? ' fp-kidszone-btn-drawer' : ''}`}
      aria-label="Kids Zone - games"
    >
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M7 8.5h10a4.2 4.2 0 0 1 4 4.4 3 3 0 0 1-5.4 1.8l-.5-.7H8.9l-.5.7A3 3 0 0 1 3 12.9a4.2 4.2 0 0 1 4-4.4z" />
        <path d="M7 11.5v2.4M5.8 12.7h2.4" />
        <circle cx="16.2" cy="12" r=".9" fill="currentColor" />
        <circle cx="18" cy="13.6" r=".9" fill="currentColor" />
      </svg>
      Kids Zone
    </Link>
  )
}

export function Navbar() {
  const [drawerOpen, setDrawerOpen] = useState(false)

  useEffect(() => {
    if (drawerOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [drawerOpen])

  // Original navy wordmark, single unified look.
  const logo = { src: '/images/logo/navy-wordmark.png', w: 1174, h: 745, h_px: 40 }

  return (
    <>
      <nav className="fp-nav">
        <div className="fp-nav-inner">
          {/* Logo */}
          <Link href="/" className="fp-nav-logo" onClick={() => setDrawerOpen(false)}>
            <Image
              src={logo.src}
              alt="Foal & Pony"
              width={logo.w}
              height={logo.h}
              priority
              style={{ height: logo.h_px, width: 'auto' }}
            />
          </Link>

          {/* Desktop links */}
          <div className="fp-nav-links">
            {NAV_LINKS.map(l => (
              <Link key={l.href} href={l.href} className="fp-nav-link">
                {l.label}
              </Link>
            ))}
          </div>

          {/* Desktop right actions */}
          <div className="fp-nav-actions">
            {/* CART DISABLED - enable post launch */}
            <KidsZoneButton />
            {/* Hamburger */}
            <button
              className="fp-nav-burger"
              onClick={() => setDrawerOpen(true)}
              aria-label="Open menu"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="4" y1="7" x2="20" y2="7" />
                <line x1="4" y1="12" x2="20" y2="12" />
                <line x1="4" y1="17" x2="20" y2="17" />
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile drawer */}
      {drawerOpen && (
        <>
          <div className="fp-drawer-overlay" style={{ display: 'block' }} onClick={() => setDrawerOpen(false)} />
          <div className="fp-drawer fp-drawer-open" style={{ display: 'flex' }}>
            <div className="fp-drawer-header">
              <Image
                src="/images/logo/navy-wordmark.png"
                alt="Foal & Pony"
                width={1174}
                height={745}
                style={{ height: 34, width: 'auto' }}
              />
              <button className="fp-drawer-close" onClick={() => setDrawerOpen(false)} aria-label="Close menu">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              {NAV_LINKS.map(l => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="fp-drawer-link"
                  onClick={() => setDrawerOpen(false)}
                >
                  {l.label}
                </Link>
              ))}
            </div>

            <div className="fp-drawer-toggle-wrap" onClick={() => setDrawerOpen(false)}>
              <KidsZoneButton inDrawer />
            </div>
          </div>
        </>
      )}
    </>
  )
}
