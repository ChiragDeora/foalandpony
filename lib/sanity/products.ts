import { sanityClient, isSanityConfigured } from './client'
import {
  ALL_PUBLISHED_PRODUCTS_QUERY,
  PRODUCTS_BY_SHAPE_QUERY,
  PRODUCT_BY_SLUG_QUERY,
  FEATURED_PRODUCTS_QUERY,
} from './queries'
import type { FoalProduct } from './types'
import type { ProductShape } from './shapes'

/**
 * Server-side product fetchers.
 *
 * All fetchers swallow Sanity errors and return an empty list / null. The
 * storefront falls back to the on-brand empty state when nothing comes back,
 * so the site stays alive even when Sanity is unreachable.
 */

export async function listAllProducts(): Promise<FoalProduct[]> {
  if (!isSanityConfigured) return []
  try {
    return await sanityClient.fetch<FoalProduct[]>(ALL_PUBLISHED_PRODUCTS_QUERY, {}, {
      next: { tags: ['products'], revalidate: 60 },
    })
  } catch {
    return []
  }
}

export async function listProductsByShape(shape: ProductShape): Promise<FoalProduct[]> {
  if (!isSanityConfigured) return []
  try {
    return await sanityClient.fetch<FoalProduct[]>(
      PRODUCTS_BY_SHAPE_QUERY,
      { shape },
      { next: { tags: ['products'], revalidate: 60 } }
    )
  } catch {
    return []
  }
}

export async function getProductBySlug(slug: string): Promise<FoalProduct | null> {
  if (!isSanityConfigured) return null
  try {
    const product = await sanityClient.fetch<FoalProduct | null>(
      PRODUCT_BY_SLUG_QUERY,
      { slug },
      { next: { tags: ['products', `product:${slug}`], revalidate: 60 } }
    )
    return product ?? null
  } catch {
    return null
  }
}

export async function listFeaturedProducts(): Promise<FoalProduct[]> {
  if (!isSanityConfigured) return []
  try {
    return await sanityClient.fetch<FoalProduct[]>(FEATURED_PRODUCTS_QUERY, {}, {
      next: { tags: ['products'], revalidate: 60 },
    })
  } catch {
    return []
  }
}
