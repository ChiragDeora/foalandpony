import 'server-only'
import { formatInr } from './util/money'

type OrderEmailItem = {
  name: string
  colourName?: string
  quantity: number
  unitPrice: number
}

type ShippingAddress = {
  firstName: string
  lastName: string
  address: string
  city: string
  postalCode: string
  state: string
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

export async function sendOrderConfirmationEmail({
  to,
  orderId,
  items,
  total,
  shipping,
}: {
  to: string
  orderId: string
  items: OrderEmailItem[]
  total: number
  shipping: ShippingAddress
}) {
  const apiKey = process.env.BREVO_API_KEY
  const sender = process.env.BREVO_SENDER_EMAIL
  if (!apiKey || !sender) return

  const itemsHtml = items
    .map((item) => {
      const label = item.colourName
        ? `${escapeHtml(item.name)} (${escapeHtml(item.colourName)})`
        : escapeHtml(item.name)
      return `<tr><td>${label} × ${item.quantity}</td><td>${formatInr(item.unitPrice * item.quantity)}</td></tr>`
    })
    .join('')

  const html = `
    <h2>Thanks for your order!</h2>
    <p>Order #${escapeHtml(orderId)}</p>
    <table cellpadding="6">${itemsHtml}</table>
    <p><strong>Total: ${formatInr(total)}</strong></p>
    <h3>Shipping to</h3>
    <p>
      ${escapeHtml(shipping.firstName)} ${escapeHtml(shipping.lastName)}<br />
      ${escapeHtml(shipping.address)}<br />
      ${escapeHtml(shipping.city)}, ${escapeHtml(shipping.state)} ${escapeHtml(shipping.postalCode)}
    </p>
    <p>We'll be in touch shortly about payment and delivery.</p>
  `

  const res = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'api-key': apiKey,
    },
    body: JSON.stringify({
      sender: { email: sender, name: 'Foal & Pony' },
      to: [{ email: to }],
      subject: `Order confirmation — #${orderId}`,
      htmlContent: html,
    }),
  })

  if (!res.ok) {
    throw new Error(`Brevo request failed: ${res.status}`)
  }
}
