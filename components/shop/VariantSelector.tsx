'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import type { HttpTypes } from '@medusajs/types'
import { AddToCartButton } from './AddToCartButton'
import { formatVariantPrice } from '@/lib/util/money'

export function VariantSelector({ product }: { product: HttpTypes.StoreProduct }) {
  const variants = product.variants ?? []
  const [selectedId, setSelectedId] = useState(variants[0]?.id ?? '')

  const selected = useMemo(
    () => variants.find((v) => v.id === selectedId) ?? variants[0],
    [variants, selectedId]
  )

  const price = selected?.calculated_price?.calculated_amount
  const currency = selected?.calculated_price?.currency_code ?? 'inr'

  if (!variants.length) {
    return <p className="shop-empty">No variants available for this product.</p>
  }

  return (
    <div className="variant-selector">
      <p className="product-price-lg">{formatVariantPrice(price, currency)}</p>

      {variants.length > 1 && (
        <div className="variant-options">
          <span className="variant-label">Options</span>
          <div className="variant-pills">
            {variants.map((v) => {
              const label =
                v.options?.map((o) => o.value).join(' / ') ||
                v.title ||
                v.sku ||
                'Variant'
              return (
                <button
                  key={v.id}
                  type="button"
                  className={`variant-pill${v.id === selected?.id ? ' active' : ''}`}
                  onClick={() => setSelectedId(v.id)}
                >
                  {label}
                </button>
              )
            })}
          </div>
        </div>
      )}

      <AddToCartButton variantId={selected?.id ?? ''} disabled={!selected?.id} />
      <Link href="/cart" className="shop-link-muted">
        View cart →
      </Link>
    </div>
  )
}
