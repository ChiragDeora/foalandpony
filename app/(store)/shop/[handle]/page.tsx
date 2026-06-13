import Link from 'next/link'
import { notFound } from 'next/navigation'
import { PortableText } from '@portabletext/react'
import { getProductBySlug } from '@/lib/sanity/products'
import { formatInr } from '@/lib/util/money'
import { AddToCart } from '@/components/shop/AddToCart'
import { ProductGallery } from '@/components/shop/ProductGallery'
import { ProductColourProvider } from '@/components/shop/ProductColourContext'

type Props = {
  params: Promise<{ handle: string }>
}

const AGE_LABEL = {
  '4-7': 'Ages 4 to 7',
  '8-12': 'Ages 8 to 12',
  '13+': 'Ages 13 and up',
} as const

export default async function ProductPage({ params }: Props) {
  const { handle } = await params
  const product = await getProductBySlug(handle)
  if (!product) notFound()

  return (
    <div className="shop-page product-detail-wrap">
      <Link href="/shop" className="shop-link-muted">← All frames</Link>

      <div className="product-detail">
        <ProductColourProvider>
          <ProductGallery product={product} />

          <div className="product-detail-info">
            <span className="shop-page-kicker">{AGE_LABEL[product.ageBand]}</span>
            <h1>{product.name}</h1>
            {product.tagline && <p className="product-detail-tagline">{product.tagline}</p>}
            <p className="product-detail-price">{formatInr(product.price)}</p>

            {product.sizeCode && (
              <div className="product-detail-size">
                <span className="product-detail-size-lbl">Size code</span>
                <span className="product-detail-size-val">{product.sizeCode}</span>
              </div>
            )}

            <AddToCart product={product} />

            {product.description && (
              <div className="product-detail-desc">
                <PortableText value={product.description} />
              </div>
            )}

            <div className="product-detail-ctas">
              <a
                href={`https://wa.me/919324337504?text=${encodeURIComponent(
                  `Hi! I'd like to ask about the ${product.name} frame.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
              >
                Ask on WhatsApp
              </a>
              <Link href="/fit" className="btn btn-ghost">Find your fit</Link>
            </div>
          </div>
        </ProductColourProvider>
      </div>
    </div>
  )
}
