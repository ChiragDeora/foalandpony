'use client'

import Link from 'next/link'
import { useCart } from '@/lib/cart/cart-context'
import { CheckoutForm, type InitialContact, type InitialShipping } from './CheckoutForm'
import { CartSummary } from './CartSummary'

type Props = {
  initialContact?: InitialContact
  initialShipping?: InitialShipping
}

export function CheckoutView({ initialContact, initialShipping }: Props) {
  const { items, subtotal } = useCart()

  if (items.length === 0) {
    return (
      <>
        <p className="shop-empty">Add items to your cart before checkout.</p>
        <Link href="/shop" className="shop-btn shop-btn-primary">
          Go to shop
        </Link>
      </>
    )
  }

  return (
    <div className="checkout-layout">
      <CheckoutForm initialContact={initialContact} initialShipping={initialShipping} />
      <CartSummary subtotal={subtotal} showCheckoutCta={false} />
    </div>
  )
}
