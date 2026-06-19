// cart hidden until pricing launch
import { redirect } from 'next/navigation'

/* import { CartView } from '@/components/shop/CartView'

export default function CartPage() {
  return (
    <div className="shop-page cart-page">
      <h1>Your cart</h1>
      <CartView />
    </div>
  )
} */

export default function CartPage() {
  redirect('/collections')
}
