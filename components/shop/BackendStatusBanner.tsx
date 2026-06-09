/**
 * Dev-only diagnostic banner.
 * In production we hide it entirely — the shop empty state below handles the
 * "no products" case with intentional, brand-aligned copy.
 */
import Link from 'next/link'
import { isMedusaConfigured } from '@/lib/config'

export function BackendStatusBanner({ connected }: { connected: boolean }) {
  if (connected) return null
  if (process.env.NODE_ENV === 'production') return null

  return (
    <div className="shop-banner shop-banner-warn" role="status">
      <p className="shop-banner-title">Dev only · store backend not connected</p>
      {!isMedusaConfigured ? (
        <ol className="shop-banner-steps">
          <li>Copy <code>.env.example</code> → <code>.env.local</code></li>
          <li>Add <code>NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY</code> from Medusa Admin</li>
          <li>Run <code>npm run db:up</code> then <code>cd medusa &amp;&amp; yarn dev</code></li>
        </ol>
      ) : (
        <p>
          Medusa is configured but not reachable. Start the API on port <code>9000</code>.
        </p>
      )}
      <Link href="/" className="shop-link-muted">← Back to homepage</Link>
    </div>
  )
}
