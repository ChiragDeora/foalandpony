import Link from 'next/link'
import { formatInr } from '@/lib/util/money'

export function CartSummary({
  subtotal,
  showCheckoutCta = true,
}: {
  subtotal: number
  showCheckoutCta?: boolean
}) {
  return (
    <aside className="cart-summary">
      <h2>Summary</h2>
      <div className="cart-summary-row">
        <span>Subtotal</span>
        <span>{formatInr(subtotal)}</span>
      </div>
      <p className="cart-summary-note">Shipping and taxes calculated at checkout.</p>
      {showCheckoutCta && (
        <Link href="/checkout" className="shop-btn shop-btn-primary shop-btn-wide">
          Proceed to checkout
        </Link>
      )}
      <Link href="/shop" className="shop-link-muted">
        Continue shopping
      </Link>
    </aside>
  )
}
