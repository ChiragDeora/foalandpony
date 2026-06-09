'use client'

import Link from 'next/link'
import { useState } from 'react'

const navLinks = [
  { href: '/shop', label: 'Shop' },
  { href: '/#why', label: 'Why us' },
  { href: '/#ages', label: 'Collections' },
  { href: '/fit', label: 'Find your fit' },
  { href: '/#schools', label: 'For schools' },
  { href: '/cart', label: 'Cart' },
  { href: '/account', label: 'Account' },
]

export function ShopNav({ cartCount }: { cartCount: number }) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        type="button"
        className="shop-mobile-toggle"
        aria-expanded={open}
        aria-label="Toggle menu"
        onClick={() => setOpen(!open)}
      >
        {open ? '✕' : '☰'}
      </button>
      <nav className={`shop-nav${open ? ' open' : ''}`} aria-label="Store">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="shop-nav-link"
            onClick={() => setOpen(false)}
          >
            {link.label}
            {link.href === '/cart' && cartCount > 0 && (
              <span className="shop-cart-badge">{cartCount}</span>
            )}
          </Link>
        ))}
      </nav>
    </>
  )
}
