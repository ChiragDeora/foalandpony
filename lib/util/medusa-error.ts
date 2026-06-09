export default function medusaError(error: unknown): never {
  if (error && typeof error === 'object' && 'message' in error) {
    throw new Error(String((error as { message: string }).message))
  }
  throw new Error('Medusa request failed')
}
