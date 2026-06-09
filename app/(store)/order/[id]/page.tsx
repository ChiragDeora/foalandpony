import Link from 'next/link'

type Props = {
  params: Promise<{ id: string }>
}

export default async function OrderConfirmationPage({ params }: Props) {
  const { id } = await params

  return (
    <div className="shop-page order-page">
      <h1>Thank you!</h1>
      <p>Order reference: <strong>{id}</strong></p>
      <p>Confirmation email will be sent via Brevo once orders flow is live.</p>
      <Link href="/shop" className="shop-btn shop-btn-primary">
        Continue shopping
      </Link>
    </div>
  )
}
