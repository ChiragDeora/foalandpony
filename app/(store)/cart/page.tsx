import Link from 'next/link'

/**
 * Cart is parked for now.
 *
 * The brand-presence site funnels parents to a stockist or WhatsApp enquiry
 * (no transactional checkout yet). When we're ready to enable purchases,
 * wire this back up.
 */
export default function CartPage() {
  return (
    <div className="shop-page">
      <div className="shop-empty-card">
        <div className="shop-empty-eyebrow">Almost open.</div>
        <h2 className="shop-empty-title">
          Direct-to-doorstep <em>coming soon.</em>
        </h2>
        <p className="shop-empty-body">
          For now, we route every order through a Foal &amp; Pony stockist for a
          proper fitting. Reach us on WhatsApp and we&apos;ll point you at the
          closest one or take the enquiry directly.
        </p>
        <div className="shop-empty-ctas">
          <a
            href="https://wa.me/919999999999"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary"
          >
            Ask on WhatsApp
          </a>
          <Link href="/shop" className="btn btn-ghost">Back to frames</Link>
        </div>
      </div>
    </div>
  )
}
