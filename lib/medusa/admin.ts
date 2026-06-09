import Medusa from '@medusajs/js-sdk'

const backendUrl =
  process.env.MEDUSA_BACKEND_URL ?? 'http://localhost:9000'

/** Server-only Medusa client with secret API key for customer sync. */
export function createMedusaAdminClient() {
  const apiKey = process.env.MEDUSA_SECRET_API_KEY
  if (!apiKey) return null

  return new Medusa({
    baseUrl: backendUrl,
    apiKey,
  })
}
