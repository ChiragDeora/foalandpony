import { createClient } from 'next-sanity'
import imageUrlBuilder from '@sanity/image-url'
import { apiVersion, dataset, projectId } from '@/sanity/env'

// Sanity's image source type — loose object the SDK accepts.
type SanityImageSource = Parameters<ReturnType<typeof imageUrlBuilder>['image']>[0]

export const sanityClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true, // CDN is fine for product reads; revalidate via tag/path
  perspective: 'published',
})

const builder = imageUrlBuilder(sanityClient)
export function urlFor(source: SanityImageSource) {
  return builder.image(source)
}

/** True when the env vars are set so we can show better empty states in dev. */
export const isSanityConfigured = Boolean(
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID &&
    process.env.NEXT_PUBLIC_SANITY_DATASET
)
