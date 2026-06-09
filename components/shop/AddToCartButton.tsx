'use client'

import { useState, useTransition } from 'react'
import { addToCart } from '@/lib/data/cart'

export function AddToCartButton({
  variantId,
  disabled,
}: {
  variantId: string
  disabled?: boolean
}) {
  const [pending, startTransition] = useTransition()
  const [message, setMessage] = useState<string | null>(null)

  return (
    <div className="add-to-cart">
      <button
        type="button"
        className="shop-btn shop-btn-primary shop-btn-wide"
        disabled={disabled || pending}
        onClick={() => {
          setMessage(null)
          startTransition(async () => {
            try {
              await addToCart(variantId, 1)
              setMessage('Added to cart')
            } catch (e) {
              setMessage(e instanceof Error ? e.message : 'Could not add to cart')
            }
          })
        }}
      >
        {pending ? 'Adding…' : 'Add to cart'}
      </button>
      {message && <p className="add-to-cart-msg">{message}</p>}
    </div>
  )
}
