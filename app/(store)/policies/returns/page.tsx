import Link from 'next/link'

export default function ReturnsPolicyPage() {
  return (
    <main className="shop-page policy-page">
      <h1>Returns policy</h1>
      <p>Defective frames may be returned within 14 days. Custom lens orders may be non-refundable.</p>
      <Link href="/shop" className="shop-link-muted">
        ← Shop
      </Link>
    </main>
  )
}
