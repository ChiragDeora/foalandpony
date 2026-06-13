import { ProductGrid } from '@/components/shop/ProductGrid'
import { CollectionFilters } from '@/components/shop/CollectionFilters'
import { listAllProducts, listProductsByShape } from '@/lib/sanity/products'
import { isProductShape } from '@/lib/sanity/shapes'

type Props = {
  searchParams: Promise<{ shape?: string }>
}

export default async function ShopPage({ searchParams }: Props) {
  const params = await searchParams
  const shape = isProductShape(params.shape) ? params.shape : undefined

  const products = shape ? await listProductsByShape(shape) : await listAllProducts()

  return (
    <div className="shop-page">
      <div className="shop-page-header">
        <div>
          <span className="shop-page-kicker">The collection.</span>
          <h1>
            Frames they&apos;ll{' '}
            <em style={{ fontStyle: 'italic', color: 'var(--orange)' }}>actually</em> wear.
          </h1>
        </div>
        <p>
          Nineteen models, a hundred-plus colours, every face shape covered. Every frame
          designed for Indian kids, by Stallion Eyewear.
        </p>
      </div>

      <CollectionFilters active={shape} />
      <ProductGrid products={products} />
    </div>
  )
}
