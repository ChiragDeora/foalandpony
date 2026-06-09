'use server'

import { sdk, isMedusaConfigured, withTimeout } from '@/lib/config'
import { getRegion } from '@/lib/data/regions'
import { DEFAULT_COUNTRY_CODE } from '@/lib/constants'
import type { HttpTypes } from '@medusajs/types'

const PRODUCT_FIELDS =
  '*variants.calculated_price,+variants.inventory_quantity,*variants.images,+metadata,+tags,+collection'

export async function listProducts({
  limit = 24,
  offset = 0,
  collectionId,
  q,
}: {
  limit?: number
  offset?: number
  collectionId?: string
  q?: string
} = {}): Promise<{ products: HttpTypes.StoreProduct[]; count: number; connected: boolean }> {
  if (!isMedusaConfigured) {
    return { products: [], count: 0, connected: false }
  }

  const region = await getRegion(DEFAULT_COUNTRY_CODE)
  if (!region) {
    return { products: [], count: 0, connected: false }
  }

  try {
    const query: Record<string, string | number> = {
      limit,
      offset,
      region_id: region.id,
      fields: PRODUCT_FIELDS,
    }
    if (collectionId) query.collection_id = collectionId
    if (q) query.q = q

    const { products, count } = await withTimeout((signal) =>
      sdk.client.fetch<{
        products: HttpTypes.StoreProduct[]
        count: number
      }>('/store/products', { method: 'GET', query, cache: 'no-store', signal })
    )

    return { products: products ?? [], count: count ?? 0, connected: true }
  } catch {
    return { products: [], count: 0, connected: false }
  }
}

export async function getProductByHandle(
  handle: string
): Promise<{ product: HttpTypes.StoreProduct | null; connected: boolean }> {
  if (!isMedusaConfigured) {
    return { product: null, connected: false }
  }

  const region = await getRegion(DEFAULT_COUNTRY_CODE)
  if (!region) return { product: null, connected: false }

  try {
    const { products } = await withTimeout((signal) =>
      sdk.client.fetch<{
        products: HttpTypes.StoreProduct[]
      }>('/store/products', {
        method: 'GET',
        query: {
          handle,
          limit: 1,
          region_id: region.id,
          fields: PRODUCT_FIELDS,
        },
        cache: 'no-store',
        signal,
      })
    )

    return { product: products?.[0] ?? null, connected: true }
  } catch {
    return { product: null, connected: false }
  }
}
