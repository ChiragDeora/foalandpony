'use server'

import { sdk, isMedusaConfigured, withTimeout } from '@/lib/config'
import medusaError from '@/lib/util/medusa-error'
import type { HttpTypes } from '@medusajs/types'
import { DEFAULT_COUNTRY_CODE } from '@/lib/constants'

const regionMap = new Map<string, HttpTypes.StoreRegion>()

export async function listRegions() {
  if (!isMedusaConfigured) return []
  try {
    const { regions } = await withTimeout((signal) =>
      sdk.client.fetch<{ regions: HttpTypes.StoreRegion[] }>(
        '/store/regions',
        { method: 'GET', cache: 'no-store', signal }
      )
    )
    return regions ?? []
  } catch {
    return []
  }
}

export async function getRegion(countryCode: string = DEFAULT_COUNTRY_CODE) {
  if (regionMap.has(countryCode)) {
    return regionMap.get(countryCode) ?? null
  }

  const regions = await listRegions()
  if (!regions.length) return null

  for (const region of regions) {
    region.countries?.forEach((c) => {
      if (c?.iso_2) regionMap.set(c.iso_2.toLowerCase(), region)
    })
  }

  return regionMap.get(countryCode.toLowerCase()) ?? regions[0] ?? null
}

export async function retrieveRegion(id: string) {
  try {
    const { region } = await sdk.client.fetch<{ region: HttpTypes.StoreRegion }>(
      `/store/regions/${id}`,
      { method: 'GET', cache: 'no-store' }
    )
    return region
  } catch (e) {
    medusaError(e)
  }
}
