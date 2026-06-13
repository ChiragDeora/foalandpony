'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useCart } from '@/lib/cart/cart-context'

const navLinks = [
  { href: '/shop', label: 'Shop' },
  { href: '/collections', label: 'Collections' },
  { href: '/fit', label: 'Find your fit' },
  { href: '/cart', label: 'Cart' },
]

export function ShopNav() {
  const [open, setOpen] = useState(false)
  const { itemCount } = useCart()

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
            {link.href === '/cart' && itemCount > 0 && (
              <span className="shop-cart-badge">{itemCount}</span>
            )}
          </Link>
        ))}
      </nav>
    </>
  )
}
