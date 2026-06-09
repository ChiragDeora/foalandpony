import { ProductGrid } from '@/components/shop/ProductGrid'
import { CollectionFilters } from '@/components/shop/CollectionFilters'
import { listAllProducts, listProductsByAge } from '@/lib/sanity/products'
import type { AgeBand } from '@/lib/sanity/types'

type Props = {
  searchParams: Promise<{ age?: string }>
}

function asAgeBand(value: string | undefined): AgeBand | undefined {
  if (value === '4-7' || value === '8-12' || value === '13+') return value
  return undefined
}

export default async function ShopPage({ searchParams }: Props) {
  const params = await searchParams
  const age = asAgeBand(params.age)

  const products = age ? await listProductsByAge(age) : await listAllProducts()

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
          Nineteen models, a hundred-plus colours, three age bands. Every frame
          designed for Indian kids, by Stallion Eyewear.
        </p>
      </div>

      <CollectionFilters active={age} />
      <ProductGrid products={products} />
    </div>
  )
}
