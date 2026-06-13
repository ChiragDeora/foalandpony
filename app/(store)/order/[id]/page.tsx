import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createAdminClient } from '@/lib/supabase/admin'
import { formatInr } from '@/lib/util/money'

type Props = {
  params: Promise<{ id: string }>
}

type ShippingAddress = {
  firstName: string
  lastName: string
  address: string
  city: string
  postalCode: string
  state: string
}

type Order = {
  id: string
  shipping_address: ShippingAddress
  total_amount: number
  status: string
}

type OrderItem = {
  id: string
  product_name: string
  colour_name: string | null
  quantity: number
  unit_price: number
}

export default async function OrderConfirmationPage({ params }: Props) {
  const { id } = await params
  const supabase = createAdminClient()
  if (!supabase) notFound()

  const { data: order } = await supabase
    .from('orders')
    .select('id, shipping_address, total_amount, status')
    .eq('id', id)
    .single()

  if (!order) notFound()
  const typedOrder = order as Order

  const { data: items } = await supabase
    .from('order_items')
    .select('id, product_name, colour_name, quantity, unit_price')
    .eq('order_id', id)

  const shipping = typedOrder.shipping_address

  return (
    <div className="shop-page order-page">
      <h1>Thank you!</h1>
      <p>
        Order reference: <strong>{typedOrder.id}</strong>
      </p>

      {typedOrder.status === 'pending_payment' && (
        <p className="checkout-status">Payment pending — we&apos;ll be in touch shortly.</p>
      )}

      <ul className="cart-line-list">
        {((items ?? []) as OrderItem[]).map((item) => (
          <li key={item.id} className="order-item-row">
            <span>
              {item.product_name}
              {item.colour_name ? ` (${item.colour_name})` : ''} × {item.quantity}
            </span>
            <span>{formatInr(item.unit_price * item.quantity)}</span>
          </li>
        ))}
      </ul>

      <div className="order-total">
        <span>Total</span>
        <span>{formatInr(typedOrder.total_amount)}</span>
      </div>

      <h2>Shipping to</h2>
      <p>
        {shipping.firstName} {shipping.lastName}
        <br />
        {shipping.address}
        <br />
        {shipping.city}, {shipping.state} {shipping.postalCode}
      </p>

      <Link href="/shop" className="shop-btn shop-btn-primary">
        Continue shopping
      </Link>
    </div>
  )
}
