import type { HttpTypes } from '@medusajs/types'
import Link from 'next/link'
import { ProductCard } from './ProductCard'

export function ProductGrid({ products }: { products: HttpTypes.StoreProduct[] }) {
  if (!products.length) {
    return (
      <div className="shop-empty-card">
        <div className="shop-empty-eyebrow">Stocking up.</div>
        <h2 className="shop-empty-title">
          The collection is almost <em>ready to wear.</em>
        </h2>
        <p className="shop-empty-body">
          We&apos;re photographing every frame, every colour. While you wait, get a head
          start on sizing or chat to us about which model suits your kid best.
        </p>
        <div className="shop-empty-ctas">
          <Link href="/fit" className="btn btn-primary">Find your fit</Link>
          <a
            href="https://wa.me/919999999999"
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
    <div className="product-grid">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}
