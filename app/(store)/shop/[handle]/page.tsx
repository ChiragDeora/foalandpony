import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { PortableText } from '@portabletext/react'
import { getProductBySlug } from '@/lib/sanity/products'
import { urlFor } from '@/lib/sanity/client'

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

  const heroImage = product.colours?.find((c) => c.image)?.image
  const heroUrl = heroImage ? urlFor(heroImage).width(1100).height(1100).fit('crop').url() : null

  return (
    <div className="shop-page product-detail-wrap">
      <Link href="/shop" className="shop-link-muted">← All frames</Link>

      <div className="product-detail">
        <div className="product-detail-gallery">
          {heroUrl ? (
            <Image src={heroUrl} alt={product.name} fill sizes="(max-width: 1100px) 90vw, 540px" />
          ) : (
            <div className="product-detail-placeholder">No photo yet</div>
          )}
        </div>

        <div className="product-detail-info">
          <span className="shop-page-kicker">{AGE_LABEL[product.ageBand]}</span>
          <h1>{product.name}</h1>
          {product.tagline && <p className="product-detail-tagline">{product.tagline}</p>}

          {product.sizeCode && (
            <div className="product-detail-size">
              <span className="product-detail-size-lbl">Size code</span>
              <span className="product-detail-size-val">{product.sizeCode}</span>
            </div>
          )}

          {product.colours && product.colours.length > 0 && (
            <div className="product-detail-colours">
              <span className="product-detail-section-lbl">
                {product.colours.length} colour{product.colours.length === 1 ? '' : 's'}
              </span>
              <div className="product-detail-swatches">
                {product.colours.map((c, i) => (
                  <span key={i} className="product-detail-swatch" title={c.name}>
                    <span className="product-detail-swatch-dot" style={{ background: c.hex }} />
                    <span className="product-detail-swatch-name">{c.name}</span>
                  </span>
                ))}
              </div>
            </div>
          )}

          {product.description && (
            <div className="product-detail-desc">
              <PortableText value={product.description} />
            </div>
          )}

          <div className="product-detail-ctas">
            <a
              href={`https://wa.me/919999999999?text=${encodeURIComponent(
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
      </div>
    </div>
  )
}
