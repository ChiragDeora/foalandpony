import Medusa from '@medusajs/js-sdk'

const backendUrl =
  process.env.MEDUSA_BACKEND_URL ?? 'http://localhost:9000'

export const isMedusaConfigured = Boolean(
  process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY
)

/**
 * Fast-fail timeout for Medusa requests.
 * When the backend is unreachable (common in local dev when Medusa isn't
 * running, or briefly in prod during a Render cold start) we want to fall
 * back to the empty state in ~2s instead of hanging for 28s.
 */
const MEDUSA_TIMEOUT_MS =
  Number(process.env.MEDUSA_TIMEOUT_MS) ||
  (process.env.NODE_ENV === 'production' ? 5000 : 2000)

export const sdk = new Medusa({
  baseUrl: backendUrl,
  debug: process.env.NODE_ENV === 'development',
  publishableKey: process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY,
  globalHeaders: {},
})

/**
 * Wrap a Medusa SDK call with an abort timeout. Use anywhere we'd otherwise
 * hang waiting for an unreachable backend. Throws on timeout — callers should
 * already be in a try/catch that falls back gracefully.
 */
export async function withTimeout<T>(
  fn: (signal: AbortSignal) => Promise<T>,
  ms = MEDUSA_TIMEOUT_MS
): Promise<T> {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), ms)
  try {
    return await fn(controller.signal)
  } finally {
    clearTimeout(timer)
  }
}
