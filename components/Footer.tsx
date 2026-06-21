import Image from 'next/image'
import Link from 'next/link'

function InstagramIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r=".8" fill="currentColor" />
    </svg>
  )
}

function WhatsAppIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M21 12a9 9 0 11-17.5-3L3 21l5.4-1.4A9 9 0 0021 12z" />
      <path d="M9 10c.5 2 1.8 3.7 4 4.5l1.6-1.3 2.6.9c.2 1.6-1.5 2.4-3 2.1A8 8 0 017 11c-.3-1.5.5-3.1 2-3l.9 2.5z" />
    </svg>
  )
}

function MailIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 7l9 6 9-6" />
    </svg>
  )
}

export function Footer() {
  return (
    <footer className="fp-footer">
      <div className="fp-footer-inner">
        <div className="fp-footer-top">
          {/* Brand column */}
          <div className="fp-footer-logo">
            {/* Navy wordmark in footer (always white/navy theme) */}
            <Image
              src="/images/logo/navy-wordmark.png"
              alt="Foal & Pony"
              width={160}
              height={48}
              style={{ height: 48, width: 'auto', filter: 'brightness(0) invert(1)' }}
            />
            <p className="fp-footer-tagline">
              Premium eyewear for little adventurers. Fun, durable, built to survive real childhoods.
            </p>
            <div className="fp-footer-social">
              <a
                href="https://www.instagram.com/foalandpony.eyewear"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
              >
                <InstagramIcon />
              </a>
              <a href="https://wa.me/919324337504" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
                <WhatsAppIcon />
              </a>
              <a href="mailto:hello@foalandpony.com" aria-label="Email">
                <MailIcon />
              </a>
            </div>
            <Link href="/partner" className="fp-btn fp-btn-primary" style={{ display: 'inline-flex', marginTop: 4 }}>
              Partner with us
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </Link>
          </div>

          {/* Explore */}
          <div className="fp-footer-col">
            <h4>Explore</h4>
            <ul>
              <li><Link href="/collections">Collections</Link></li>
              <li><Link href="/blog">Blog</Link></li>
              <li><Link href="/games">Games</Link></li>
            </ul>
            <div style={{ marginTop: 24 }}>
              <h4>Help</h4>
              <ul>
                <li><Link href="/policies/shipping">Shipping &amp; returns</Link></li>
                <li><Link href="/policies/privacy">Privacy</Link></li>
                <li><Link href="/partner">Contact us</Link></li>
              </ul>
            </div>
          </div>

          {/* Company */}
          <div className="fp-footer-col">
            <h4>Company</h4>
            <ul>
              <li><Link href="/partner">Partner with us</Link></li>
              <li><a href="#why">Why Foal &amp; Pony</a></li>
              <li><Link href="/about">Our story</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="fp-footer-bottom">
          <span>© {new Date().getFullYear()} Foal &amp; Pony. All rights reserved. A brand by Stallion Eyewear.</span>
          <span>
            Built by{' '}
            <a href="https://garihc.com" target="_blank" rel="noopener noreferrer">
              GARIHC
            </a>
          </span>
        </div>
      </div>
    </footer>
  )
}
