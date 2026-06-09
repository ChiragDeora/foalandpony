import Link from 'next/link'

export default function ShippingPolicyPage() {
  return (
    <main className="shop-page policy-page">
      <h1>Shipping policy</h1>
      <p>We ship across India. Delivery times and rates are shown at checkout.</p>
      <Link href="/shop" className="shop-link-muted">
        ← Shop
      </Link>
    </main>
  )
}
