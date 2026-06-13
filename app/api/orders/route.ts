import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { sanityClient } from '@/lib/sanity/client'
import { createAdminClient } from '@/lib/supabase/admin'
import { sendOrderConfirmationEmail } from '@/lib/brevo'

type OrderItemInput = {
  productId: string
  colourName?: string
  quantity: number
}

type ShippingAddress = {
  firstName: string
  lastName: string
  address: string
  city: string
  postalCode: string
  state: string
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null)
  const items = body?.items as OrderItemInput[] | undefined
  const contact = body?.contact as { email?: string; phone?: string } | undefined
  const shipping = body?.shipping as ShippingAddress | undefined

  if (!Array.isArray(items) || items.length === 0) {
    return NextResponse.json({ error: 'Cart is empty' }, { status: 400 })
  }
  if (!contact?.email || !contact?.phone) {
    return NextResponse.json({ error: 'Missing contact details' }, { status: 400 })
  }
  if (
    !shipping?.firstName ||
    !shipping?.lastName ||
    !shipping?.address ||
    !shipping?.city ||
    !shipping?.postalCode ||
    !shipping?.state
  ) {
    return NextResponse.json({ error: 'Missing shipping details' }, { status: 400 })
  }

  const productIds = [...new Set(items.map((item) => item.productId))]
  const products = await sanityClient.fetch<{ _id: string; name: string; price: number }[]>(
    `*[_type == "product" && _id in $ids]{_id, name, price}`,
    { ids: productIds }
  )
  const productMap = new Map(products.map((p) => [p._id, p]))

  const orderItems: {
    product_id: string
    product_name: string
    colour_name: string | null
    quantity: number
    unit_price: number
  }[] = []
  let total = 0

  for (const item of items) {
    const product = productMap.get(item.productId)
    if (!product) {
      return NextResponse.json({ error: `Product ${item.productId} not found` }, { status: 400 })
    }
    const quantity = Math.max(1, Math.floor(item.quantity))
    total += product.price * quantity
    orderItems.push({
      product_id: product._id,
      product_name: product.name,
      colour_name: item.colourName ?? null,
      quantity,
      unit_price: product.price,
    })
  }

  const { userId } = await auth()

  const supabase = createAdminClient()
  if (!supabase) {
    return NextResponse.json({ error: 'Store is not configured' }, { status: 503 })
  }

  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({
      clerk_user_id: userId,
      email: contact.email,
      phone: contact.phone,
      shipping_address: shipping,
      total_amount: total,
      status: 'pending_payment',
    })
    .select('id')
    .single()

  if (orderError || !order) {
    return NextResponse.json(
      { error: orderError?.message ?? 'Could not create order' },
      { status: 500 }
    )
  }

  const { error: itemsError } = await supabase
    .from('order_items')
    .insert(orderItems.map((item) => ({ ...item, order_id: order.id })))

  if (itemsError) {
    return NextResponse.json({ error: itemsError.message }, { status: 500 })
  }

  if (userId) {
    try {
      await supabase.from('user_profiles').upsert(
        {
          clerk_user_id: userId,
          email: contact.email,
          phone: contact.phone,
          shipping_address: shipping,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'clerk_user_id' }
      )
    } catch {
      // best-effort — order is already created
    }
  }

  try {
    await sendOrderConfirmationEmail({
      to: contact.email,
      orderId: order.id,
      items: orderItems.map((item) => ({
        name: item.product_name,
        colourName: item.colour_name ?? undefined,
        quantity: item.quantity,
        unitPrice: item.unit_price,
      })),
      total,
      shipping,
    })
  } catch {
    // best-effort — order is already created
  }

  return NextResponse.json({ orderId: order.id })
}
