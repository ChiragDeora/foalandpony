/**
 * Sanity env config.
 *
 * Vars are optional at build time so deploys succeed before the Sanity project
 * is created. When missing, the storefront fetchers short-circuit and the
 * `/shop` page renders the empty state. The embedded Studio at `/studio` will
 * show a configuration screen until the projectId is set.
 */

export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-10-01'

// Fallbacks ensure the build doesn't crash. `isSanityConfigured` (in
// lib/sanity/client.ts) is the runtime gate that prevents API calls when
// these are still placeholders.
export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'placeholder'
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
