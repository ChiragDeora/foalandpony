/**
 * Sanity's image CDN already resizes + serves modern formats via the `?w=&auto=format`
 * params we add in the GROQ queries. Routing those URLs back through Next's own
 * image optimizer (`/_next/image`) just double-processes them - and on a dev server,
 * nine concurrent remote fetches can time out (500s).
 *
 * So we mark Sanity-hosted `<Image>`s `unoptimized`: the browser fetches the already
 * sized/optimized image straight from Sanity's CDN. Local `/public` fallbacks are NOT
 * Sanity URLs, so they keep using Next's optimizer (fast, from disk).
 */
export function isSanityImage(url?: string | null): boolean {
  return typeof url === 'string' && url.startsWith('https://cdn.sanity.io')
}
