import Link from 'next/link'
import { retrieveCart } from '@/lib/data/cart'
import { CartLineItem } from '@/components/shop/CartLineItem'
import { CartSummary } from '@/components/shop/CartSummary'
import { BackendStatusBanner } from '@/components/shop/BackendStatusBanner'
import { isMedusaConfigured } from '@/lib/config'

export default async function CartPage() {
  const cart = await retrieveCart()
  const connected = isMedusaConfigured

  return (
    <div className="shop-page cart-page">
      <h1>Your cart</h1>
      <BackendStatusBanner connected={connected && Boolean(cart)} />

      {!cart?.items?.length ? (
        <div className="shop-empty-block">
          <p>Your cart is empty.</p>
          <Link href="/shop" className="shop-btn shop-btn-primary">
            Browse shop
          </Link>
        </div>
      ) : (
        <div className="cart-layout">
          <ul className="cart-lines">
            {cart.items.map((item) => (
              <CartLineItem key={item.id} item={item} />
            ))}
          </ul>
          <CartSummary cart={cart} />
        </div>
      )}
    </div>
  )
}
