import Image from 'next/image'
import Link from 'next/link'
import type { HttpTypes } from '@medusajs/types'
import { formatVariantPrice } from '@/lib/util/money'

function getThumbnail(product: HttpTypes.StoreProduct) {
  return product.thumbnail ?? product.images?.[0]?.url ?? null
}

function getFromPrice(product: HttpTypes.StoreProduct) {
  const variant = product.variants?.[0]
  const price = variant?.calculated_price?.calculated_amount
  const currency = variant?.calculated_price?.currency_code ?? 'inr'
  return formatVariantPrice(price, currency)
}

export function ProductCard({ product }: { product: HttpTypes.StoreProduct }) {
  const thumb = getThumbnail(product)
  const handle = product.handle ?? product.id

  return (
    <article className="product-card">
      <Link href={`/shop/${handle}`} className="product-card-link">
        <div className="product-card-image">
          {thumb ? (
            <Image src={thumb} alt={product.title ?? 'Product'} fill sizes="(max-width:768px) 100vw, 33vw" />
          ) : (
            <div className="product-card-placeholder">👓</div>
          )}
        </div>
        <div className="product-card-body">
          <h3>{product.title}</h3>
          <p className="product-card-price">{getFromPrice(product)}</p>
        </div>
      </Link>
    </article>
  )
}
