import Link from 'next/link'

export default function PrivacyPolicyPage() {
  return (
    <main className="shop-page policy-page">
      <h1>Privacy policy</h1>
      <p>We use Clerk for account login and Medusa for order processing.</p>
      <Link href="/shop" className="shop-link-muted">
        ← Shop
      </Link>
    </main>
  )
}
