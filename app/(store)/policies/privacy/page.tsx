import Link from 'next/link'

export default function PrivacyPolicyPage() {
  return (
    <main className="shop-page policy-page">
      <h1>Privacy policy</h1>
      <p>We use Clerk for account login and process orders directly through our storefront.</p>
      <Link href="/shop" className="shop-link-muted">
        ← Shop
      </Link>
    </main>
  )
}
