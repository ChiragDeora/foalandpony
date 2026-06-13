import Image from 'next/image'
import Link from 'next/link'
import { urlFor } from '@/lib/sanity/client'
import type { FoalProduct } from '@/lib/sanity/types'
import { formatInr } from '@/lib/util/money'

function primaryImage(product: FoalProduct) {
  const first = product.colours?.find((c) => c.image)?.image
  if (first) return urlFor(first).width(640).height(640).fit('crop').url()
  if (product.lifestyleImages?.[0]) {
    return urlFor(product.lifestyleImages[0]).width(640).height(640).fit('crop').url()
  }
  return null
}

export function ProductCard({ product }: { product: FoalProduct }) {
  const thumb = primaryImage(product)
  const swatches = product.colours?.slice(0, 5) ?? []

  return (
    <article className="product-card">
      <Link href={`/shop/${product.slug}`} className="product-card-link">
        <div className="product-card-image">
          {thumb ? (
            <Image src={thumb} alt={product.name} fill sizes="(max-width: 768px) 100vw, 33vw" />
          ) : (
            <div className="product-card-placeholder">
              <svg viewBox="0 0 80 40" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                <rect x="6" y="10" width="26" height="22" rx="6" />
                <rect x="48" y="10" width="26" height="22" rx="6" />
                <path d="M32 18q4-3 16 0" />
              </svg>
            </div>
          )}
          {swatches.length > 0 && (
            <div className="product-card-swatches">
              {swatches.map((c, i) => (
                <span
                  key={i}
                  className="product-card-swatch"
                  style={{ background: c.hex }}
                  title={c.name}
                />
              ))}
            </div>
          )}
        </div>
        <div className="product-card-body">
          <h3>{product.name}</h3>
          {product.tagline && <p className="product-card-tagline">{product.tagline}</p>}
          <p className="product-card-price">{formatInr(product.price)}</p>
        </div>
      </Link>
    </article>
  )
}
