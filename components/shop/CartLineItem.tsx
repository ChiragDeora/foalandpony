'use client'

import Image from 'next/image'
import { useTransition } from 'react'
import type { HttpTypes } from '@medusajs/types'
import { updateLineItem, removeLineItem } from '@/lib/data/cart'
import { formatVariantPrice } from '@/lib/util/money'

export function CartLineItem({ item }: { item: HttpTypes.StoreCartLineItem }) {
  const [pending, startTransition] = useTransition()
  const title = item.product_title ?? item.title ?? 'Item'
  const thumb = item.thumbnail
  const unit = item.unit_price ?? 0

  return (
    <li className={`cart-line${pending ? ' pending' : ''}`}>
      <div className="cart-line-image">
        {thumb ? (
          <Image src={thumb} alt={title} width={80} height={80} />
        ) : (
          <span>👓</span>
        )}
      </div>
      <div className="cart-line-body">
        <h3>{title}</h3>
        {item.variant_title && <p className="cart-line-variant">{item.variant_title}</p>}
        <p className="cart-line-price">{formatVariantPrice(unit)}</p>
        <div className="cart-line-actions">
          <label>
            Qty
            <input
              type="number"
              min={1}
              defaultValue={item.quantity}
              disabled={pending}
              onChange={(e) => {
                const qty = parseInt(e.target.value, 10)
                if (qty > 0 && item.id) {
                  startTransition(() => updateLineItem(item.id, qty))
                }
              }}
            />
          </label>
          <button
            type="button"
            className="shop-btn shop-btn-ghost"
            disabled={pending}
            onClick={() => item.id && startTransition(() => removeLineItem(item.id))}
          >
            Remove
          </button>
        </div>
      </div>
    </li>
  )
}
