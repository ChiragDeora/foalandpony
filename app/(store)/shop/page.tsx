import { listProducts } from '@/lib/data/products'
import { getCollectionByHandle } from '@/lib/data/collections'
import { ProductGrid } from '@/components/shop/ProductGrid'
import { CollectionFilters } from '@/components/shop/CollectionFilters'
import { BackendStatusBanner } from '@/components/shop/BackendStatusBanner'

type Props = {
  searchParams: Promise<{ collection?: string }>
}

export default async function ShopPage({ searchParams }: Props) {
  const params = await searchParams
  const collectionHandle = params.collection

  let collectionId: string | undefined
  if (collectionHandle) {
    const col = await getCollectionByHandle(collectionHandle)
    collectionId = col?.id
  }

  const { products, connected } = await listProducts({ collectionId, limit: 48 })

  return (
    <div className="shop-page">
      <div className="shop-page-header">
        <div>
          <span className="shop-page-kicker">The collection.</span>
          <h1>Frames they&apos;ll <em style={{ fontStyle: 'italic', color: 'var(--orange)' }}>actually</em> wear.</h1>
        </div>
        <p>
          Nineteen models, a hundred-plus colours, three age bands. Every frame
          designed for Indian kids, by Stallion Eyewear.
        </p>
      </div>

      <BackendStatusBanner connected={connected} />
      <CollectionFilters active={collectionHandle} />
      <ProductGrid products={products} />
    </div>
  )
}
