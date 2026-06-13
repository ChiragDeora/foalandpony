'use client'

import { useState, type ChangeEvent, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { useCart } from '@/lib/cart/cart-context'

type FormState = {
  email: string
  phone: string
  firstName: string
  lastName: string
  address: string
  city: string
  postalCode: string
  state: string
}

export type InitialContact = {
  email?: string
  phone?: string
}

export type InitialShipping = {
  firstName?: string
  lastName?: string
  address?: string
  city?: string
  postalCode?: string
  state?: string
}

const initialForm: FormState = {
  email: '',
  phone: '',
  firstName: '',
  lastName: '',
  address: '',
  city: '',
  postalCode: '',
  state: '',
}

type Props = {
  initialContact?: InitialContact
  initialShipping?: InitialShipping
}

export function CheckoutForm({ initialContact, initialShipping }: Props) {
  const router = useRouter()
  const { items, clearCart } = useCart()
  const [form, setForm] = useState<FormState>(() => ({
    ...initialForm,
    email: initialContact?.email ?? initialForm.email,
    phone: initialContact?.phone ?? initialForm.phone,
    firstName: initialShipping?.firstName ?? initialForm.firstName,
    lastName: initialShipping?.lastName ?? initialForm.lastName,
    address: initialShipping?.address ?? initialForm.address,
    city: initialShipping?.city ?? initialForm.city,
    postalCode: initialShipping?.postalCode ?? initialForm.postalCode,
    state: initialShipping?.state ?? initialForm.state,
  }))
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function update(field: keyof FormState) {
    return (e: ChangeEvent<HTMLInputElement>) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }))
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setError(null)

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map((item) => ({
            productId: item.productId,
            colourName: item.colourName,
            quantity: item.quantity,
          })),
          contact: { email: form.email, phone: form.phone },
          shipping: {
            firstName: form.firstName,
            lastName: form.lastName,
            address: form.address,
            city: form.city,
            postalCode: form.postalCode,
            state: form.state,
          },
        }),
      })

      const data = await res.json().catch(() => null)
      if (!res.ok) {
        throw new Error(data?.error ?? 'Could not place order. Please try again.')
      }

      clearCart()
      router.push(`/order/${data.orderId}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not place order. Please try again.')
      setSubmitting(false)
    }
  }

  return (
    <form className="checkout-form" onSubmit={handleSubmit}>
      <section>
        <h2>Contact</h2>
        <label>
          Email
          <input
            type="email"
            required
            placeholder="parent@email.com"
            value={form.email}
            onChange={update('email')}
          />
        </label>
        <label>
          Phone
          <input
            type="tel"
            required
            placeholder="+91 …"
            value={form.phone}
            onChange={update('phone')}
          />
        </label>
      </section>

      <section>
        <h2>Shipping address</h2>
        <div className="checkout-grid">
          <label>
            First name
            <input required value={form.firstName} onChange={update('firstName')} />
          </label>
          <label>
            Last name
            <input required value={form.lastName} onChange={update('lastName')} />
          </label>
        </div>
        <label>
          Address
          <input required value={form.address} onChange={update('address')} />
        </label>
        <div className="checkout-grid">
          <label>
            City
            <input required value={form.city} onChange={update('city')} />
          </label>
          <label>
            PIN code
            <input required value={form.postalCode} onChange={update('postalCode')} />
          </label>
        </div>
        <label>
          State
          <input required value={form.state} onChange={update('state')} />
        </label>
      </section>

      <button
        type="submit"
        className="shop-btn shop-btn-primary shop-btn-wide"
        disabled={submitting}
      >
        {submitting ? 'Placing order…' : 'Place order'}
      </button>
      {error && <p className="checkout-status checkout-status-error">{error}</p>}
    </form>
  )
}
