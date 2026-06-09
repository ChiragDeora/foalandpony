import Link from 'next/link'
import { retrieveCart } from '@/lib/data/cart'
import { CheckoutForm } from '@/components/shop/CheckoutForm'
import { CartSummary } from '@/components/shop/CartSummary'

export default async function CheckoutPage() {
  const cart = await retrieveCart()

  if (!cart?.items?.length) {
    return (
      <div className="shop-page">
        <h1>Checkout</h1>
        <p className="shop-empty">Add items to your cart before checkout.</p>
        <Link href="/shop" className="shop-btn shop-btn-primary">
          Go to shop
        </Link>
      </div>
    )
  }

  return (
    <div className="shop-page checkout-page">
      <h1>Checkout</h1>
      <div className="checkout-layout">
        <CheckoutForm />
        <CartSummary cart={cart} />
      </div>
    </div>
  )
}
