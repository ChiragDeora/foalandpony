'use server'

import { revalidatePath } from 'next/cache'
import { sdk, isMedusaConfigured, withTimeout } from '@/lib/config'
import { getAuthHeaders, getCartId, setCartId, removeCartId } from '@/lib/data/cookies'
import { getRegion } from '@/lib/data/regions'
import medusaError from '@/lib/util/medusa-error'
import { DEFAULT_COUNTRY_CODE } from '@/lib/constants'
import type { HttpTypes } from '@medusajs/types'

const CART_FIELDS =
  '*items, *region, *items.product, *items.variant, *items.thumbnail, +items.total'

export async function retrieveCart(): Promise<HttpTypes.StoreCart | null> {
  if (!isMedusaConfigured) return null
  const id = await getCartId()
  if (!id) return null

  const headers = { ...(await getAuthHeaders()) }

  try {
    const { cart } = await withTimeout((signal) =>
      sdk.client.fetch<{ cart: HttpTypes.StoreCart }>(
        `/store/carts/${id}`,
        {
          method: 'GET',
          query: { fields: CART_FIELDS },
          headers,
          cache: 'no-store',
          signal,
        }
      )
    )
    return cart
  } catch {
    return null
  }
}

export async function getOrSetCart() {
  const region = await getRegion(DEFAULT_COUNTRY_CODE)
  if (!region) throw new Error('Store region not configured. Start Medusa and seed data.')

  let cart = await retrieveCart()
  const headers = { ...(await getAuthHeaders()) }

  if (!cart) {
    const { cart: newCart } = await sdk.store.cart.create(
      { region_id: region.id },
      {},
      headers
    )
    cart = newCart
    await setCartId(cart.id)
  } else if (cart.region_id !== region.id) {
    const { cart: updated } = await sdk.store.cart.update(
      cart.id,
      { region_id: region.id },
      {},
      headers
    )
    cart = updated
  }

  return cart
}

export async function addToCart(variantId: string, quantity = 1) {
  const cart = await getOrSetCart()
  const headers = { ...(await getAuthHeaders()) }

  await sdk.store.cart
    .createLineItem(cart.id, { variant_id: variantId, quantity }, {}, headers)
    .catch(medusaError)

  revalidatePath('/cart')
  revalidatePath('/shop')
}

export async function updateLineItem(lineId: string, quantity: number) {
  const cartId = await getCartId()
  if (!cartId) throw new Error('No cart')

  const headers = { ...(await getAuthHeaders()) }
  await sdk.store.cart
    .updateLineItem(cartId, lineId, { quantity }, {}, headers)
    .catch(medusaError)

  revalidatePath('/cart')
}

export async function removeLineItem(lineId: string) {
  const cartId = await getCartId()
  if (!cartId) throw new Error('No cart')

  const headers = { ...(await getAuthHeaders()) }
  await sdk.store.cart.deleteLineItem(cartId, lineId, {}, headers).catch(medusaError)

  revalidatePath('/cart')
}

export async function getCartItemCount(): Promise<number> {
  const cart = await retrieveCart()
  if (!cart?.items?.length) return 0
  return cart.items.reduce((sum, item) => sum + (item.quantity ?? 0), 0)
}

export async function clearCartAfterOrder() {
  await removeCartId()
  revalidatePath('/cart')
}
