import { sanityClient, isSanityConfigured } from './client'
import { HOMEPAGE_QUERY } from './queries'
import type { Homepage } from './types'

/**
 * Homepage image content, edited in the Studio "Homepage" singleton.
 *
 * Returns null when Sanity is unconfigured/unreachable or the doc is empty, so
 * the homepage falls back to the photos shipped in /public. Same degrade-gracefully
 * pattern as the product fetchers.
 */
export async function getHomepage(): Promise<Homepage | null> {
  if (!isSanityConfigured) return null
  try {
    const data = await sanityClient.fetch<Homepage | null>(HOMEPAGE_QUERY, {}, {
      next: { tags: ['homepage'], revalidate: 60 },
    })
    return data ?? null
  } catch {
    return null
  }
}
