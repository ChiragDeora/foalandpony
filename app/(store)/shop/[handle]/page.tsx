import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getProductByHandle } from '@/lib/data/products'
import { VariantSelector } from '@/components/shop/VariantSelector'
import { BackendStatusBanner } from '@/components/shop/BackendStatusBanner'

type Props = {
  params: Promise<{ handle: string }>
}

export default async function ProductPage({ params }: Props) {
  const { handle } = await params
  const { product, connected } = await getProductByHandle(handle)

  if (!product && connected) notFound()
  if (!product) {
    return (
      <div className="shop-page">
        <BackendStatusBanner connected={false} />
        <p className="shop-empty">Product not found or store is offline.</p>
        <Link href="/shop" className="shop-link-muted">
          ← Back to shop
        </Link>
      </div>
    )
  }

  const image = product.thumbnail ?? product.images?.[0]?.url

  return (
    <div className="shop-page product-detail">
      <BackendStatusBanner connected={connected} />
      <Link href="/shop" className="shop-link-muted">
        ← All products
      </Link>

      <div className="product-detail-grid">
        <div className="product-detail-image">
          {image ? (
            <Image
              src={image}
              alt={product.title ?? ''}
              width={600}
              height={600}
              className="product-detail-img"
            />
          ) : (
            <div className="product-card-placeholder product-detail-placeholder">👓</div>
          )}
        </div>
        <div className="product-detail-info">
          <h1>{product.title}</h1>
          {product.description && (
            <p className="product-description">{product.description}</p>
          )}
          <VariantSelector product={product} />
        </div>
      </div>
    </div>
  )
}
