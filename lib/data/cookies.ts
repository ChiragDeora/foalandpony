import 'server-only'
import { cookies as nextCookies } from 'next/headers'

export async function getAuthHeaders(): Promise<
  { authorization: string } | Record<string, never>
> {
  const cookieStore = await nextCookies()
  const token = cookieStore.get('_medusa_jwt')?.value
  if (!token) return {}
  return { authorization: `Bearer ${token}` }
}

export async function getCartId(): Promise<string | undefined> {
  const cookieStore = await nextCookies()
  return cookieStore.get('_medusa_cart_id')?.value
}

export async function setCartId(cartId: string) {
  const cookieStore = await nextCookies()
  cookieStore.set('_medusa_cart_id', cartId, {
    maxAge: 60 * 60 * 24 * 7,
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
  })
}

export async function removeCartId() {
  const cookieStore = await nextCookies()
  cookieStore.set('_medusa_cart_id', '', { maxAge: -1 })
}
