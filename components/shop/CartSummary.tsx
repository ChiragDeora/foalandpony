import Link from 'next/link'
import type { HttpTypes } from '@medusajs/types'
import { formatVariantPrice } from '@/lib/util/money'

export function CartSummary({ cart }: { cart: HttpTypes.StoreCart }) {
  const subtotal = cart.item_subtotal ?? cart.subtotal ?? 0

  return (
    <aside className="cart-summary">
      <h2>Summary</h2>
      <div className="cart-summary-row">
        <span>Subtotal</span>
        <span>{formatVariantPrice(subtotal)}</span>
      </div>
      <p className="cart-summary-note">Shipping and taxes calculated at checkout.</p>
      <Link href="/checkout" className="shop-btn shop-btn-primary shop-btn-wide">
        Proceed to checkout
      </Link>
      <Link href="/shop" className="shop-link-muted">
        Continue shopping
      </Link>
    </aside>
  )
}
