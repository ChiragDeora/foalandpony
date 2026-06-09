import Link from 'next/link'

export function ShopFooter() {
  return (
    <footer className="shop-footer">
      <div className="shop-footer-inner">
        <div>
          <p className="shop-footer-brand">Foal &amp; Pony</p>
          <p className="shop-footer-tagline">Premium kids eyewear</p>
        </div>
        <div className="shop-footer-links">
          <Link href="/shop">Shop</Link>
          <Link href="/policies/shipping">Shipping</Link>
          <Link href="/policies/returns">Returns</Link>
          <Link href="/policies/privacy">Privacy</Link>
        </div>
        <p className="shop-footer-copy">
          A brand by Stallion Eyewear · © {new Date().getFullYear()} · BUILT BY GARIHC
        </p>
      </div>
    </footer>
  )
}
