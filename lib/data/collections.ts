'use server'

import { sdk, isMedusaConfigured } from '@/lib/config'
import type { HttpTypes } from '@medusajs/types'

export async function listCollections(): Promise<{
  collections: HttpTypes.StoreCollection[]
  connected: boolean
}> {
  if (!isMedusaConfigured) {
    return { collections: [], connected: false }
  }

  try {
    const { collections } = await sdk.client.fetch<{
      collections: HttpTypes.StoreCollection[]
    }>('/store/collections', { method: 'GET', cache: 'no-store' })

    return { collections: collections ?? [], connected: true }
  } catch {
    return { collections: [], connected: false }
  }
}

export async function getCollectionByHandle(handle: string) {
  const { collections } = await listCollections()
  return collections.find((c) => c.handle === handle) ?? null
}
