'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useTheme } from '@/context/ThemeContext'

function ThemeToggle({ inDrawer = false }: { inDrawer?: boolean }) {
  const { theme, toggleTheme } = useTheme()
  const isKids = theme === 'kids'

  return (
    <button
      onClick={toggleTheme}
      className={`fp-theme-toggle ${inDrawer ? 'w-full justify-center' : ''}`}
      aria-label={`Switch to ${isKids ? 'premium' : 'kids'} theme`}
      title={`Switch to ${isKids ? 'Premium' : 'Kids'} theme`}
    >
      {/* Kids pill */}
      <span className={`fp-toggle-pill ${isKids ? 'active-kids' : 'inactive'}`}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
        Kids
      </span>
      {/* Premium pill */}
      <span className={`fp-toggle-pill ${!isKids ? 'active-premium' : 'inactive'}`}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M3 11l5-8 4 6 3-4 5 6H3z" />
          <path d="M3 11v8a1 1 0 001 1h16a1 1 0 001-1v-8" />
        </svg>
        Premium
      </span>
    </button>
  )
}

const NAV_LINKS = [
  { href: '/shop', label: 'Shop' },
  { href: '/collections', label: 'Collections' },
  { href: '/blog', label: 'Blog' },
  { href: '/games', label: 'Games' },
  { href: '/partner', label: 'Partner with us' },
]

export function Navbar() {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const { theme } = useTheme()

  useEffect(() => {
    if (drawerOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [drawerOpen])

  const isPremium = theme === 'premium'
  // Each wordmark has a different aspect ratio, set intrinsic dims to match so neither distorts.
  const logo = isPremium
    ? { src: '/images/logo/navy-wordmark.png', w: 1174, h: 745, h_px: 40 }
    : { src: '/images/logo/rainbow-wordmark.png', w: 637, h: 154, h_px: 46 }

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
            {/* <Link href="/cart" className="fp-nav-link" aria-label="Cart">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="20" r="1.5" /><circle cx="17" cy="20" r="1.5" />
                <path d="M3 4h2l2.4 11.5a2 2 0 002 1.5h7.6a2 2 0 002-1.6L20 8H6" />
              </svg>
            </Link> */}
            <ThemeToggle />
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
                src="/images/logo/rainbow-wordmark.png"
                alt="Foal & Pony"
                width={637}
                height={154}
                style={{ height: 38, width: 'auto' }}
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

            <div className="fp-drawer-toggle-wrap">
              <ThemeToggle inDrawer />
            </div>
          </div>
        </>
      )}
    </>
  )
}
