'use client'

import Link from 'next/link'
import { useCart } from '@/lib/cart/cart-context'
import { CartLineItem } from './CartLineItem'
import { CartSummary } from './CartSummary'

export function CartView() {
  const { items, subtotal, updateQuantity, removeItem } = useCart()

  if (items.length === 0) {
    return (
      <div className="cart-empty">
        <h2>Your cart is empty</h2>
        <p>Add a frame to get started.</p>
        <div className="shop-empty-ctas">
          <Link href="/shop" className="btn btn-primary">
            Back to frames
          </Link>
          <a
            href="https://wa.me/919324337504"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-ghost"
          >
            Ask on WhatsApp
          </a>
        </div>
      </div>
    )
  }

  return (
    <>
      <ul className="cart-line-list">
        {items.map((item) => (
          <CartLineItem
            key={`${item.productId}::${item.colourName ?? ''}`}
            item={item}
            onUpdateQuantity={(qty) => updateQuantity(item.productId, item.colourName, qty)}
            onRemove={() => removeItem(item.productId, item.colourName)}
          />
        ))}
      </ul>
      <CartSummary subtotal={subtotal} />
    </>
  )
}
