'use client'

import { useState } from 'react'

export function CheckoutForm() {
  const [status, setStatus] = useState<string | null>(null)

  return (
    <form
      className="checkout-form"
      onSubmit={(e) => {
        e.preventDefault()
        setStatus(
          'Checkout payment (Razorpay) connects after Medusa payment provider is configured.'
        )
      }}
    >
      <section>
        <h2>Contact</h2>
        <label>
          Email
          <input type="email" name="email" required placeholder="parent@email.com" />
        </label>
        <label>
          Phone
          <input type="tel" name="phone" required placeholder="+91 …" />
        </label>
      </section>

      <section>
        <h2>Shipping address</h2>
        <div className="checkout-grid">
          <label>
            First name
            <input name="first_name" required />
          </label>
          <label>
            Last name
            <input name="last_name" required />
          </label>
        </div>
        <label>
          Address
          <input name="address_1" required />
        </label>
        <div className="checkout-grid">
          <label>
            City
            <input name="city" required />
          </label>
          <label>
            PIN code
            <input name="postal_code" required />
          </label>
        </div>
        <label>
          State
          <input name="province" required />
        </label>
      </section>

      <button type="submit" className="shop-btn shop-btn-primary shop-btn-wide">
        Pay with Razorpay
      </button>
      {status && <p className="checkout-status">{status}</p>}
    </form>
  )
}
