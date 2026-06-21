'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'

/* BULK ORDER REMOVED, disabled pre-launch */
/* CLINIC FORM REMOVED, disabled pre-launch */
/* SCHOOL FORM REMOVED, disabled pre-launch */

export default function PartnerPage() {
  const [form, setForm] = useState({ name: '', brand: '', email: '', message: '' })
  const [sent, setSent] = useState(false)
  const [sending, setSending] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSending(true)
    /* Wire to Brevo / form endpoint when ready */
    await new Promise(r => setTimeout(r, 900))
    setSent(true)
    setSending(false)
  }

  return (
    <div className="fp-page">
      <Navbar />

      {/* ── Navy hero ── */}
      <section style={{ background: '#1A2B4A', padding: '80px 0 72px', position: 'relative', overflow: 'hidden' }}>
        {/* Decorative blobs */}
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          <div className="fp-blob" style={{ width: 400, height: 400, background: 'rgba(255,140,0,0.1)', right: -120, top: -100 }} />
          <div className="fp-blob fp-blob-2" style={{ width: 280, height: 280, background: 'rgba(30,136,229,0.08)', left: -80, bottom: -80 }} />
          <div className="fp-ring" style={{ width: 240, height: 240, border: '2px solid rgba(255,140,0,0.12)', top: '20%', right: '15%' }} />
        </div>

        <div className="fp-container relative z-10">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 40, alignItems: 'center' }}
            className="max-[640px]:grid-cols-1">
            <div>
              <h1 style={{
                fontFamily: 'var(--fp-heading-font)',
                fontWeight: 900,
                fontSize: 'clamp(32px, 5vw, 64px)',
                color: 'white',
                lineHeight: 1.05,
                marginBottom: 18,
              }}>
                Let&apos;s build something together
              </h1>
              <p style={{ color: 'rgba(255,255,255,0.68)', fontSize: 18, lineHeight: 1.6, maxWidth: 480, fontFamily: 'var(--fp-body-font)' }}>
                Bulk pricing. Priority support. Whether you&apos;re a school, clinic, optometrist, or brand, we&apos;d love to talk.
              </p>
            </div>
            <div className="fp-float" style={{ flexShrink: 0 }}>
              <Image src="/images/logo/pony.png" alt="" width={140} height={140} style={{ filter: 'drop-shadow(0 12px 24px rgba(0,0,0,0.4))' }} />
            </div>
          </div>
        </div>
      </section>

      {/* ── Enquiry form ── */}
      <section style={{ padding: '80px 0 96px', background: '#F5F3ED' }}>
        <div className="fp-container" style={{ maxWidth: 680 }}>
          {sent ? (
            <div style={{ textAlign: 'center', padding: '64px 32px' }}>
              <div style={{ width: 64, height: 64, borderRadius: 16, background: '#4CAF50', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <h2 style={{ fontFamily: 'var(--fp-heading-font)', fontWeight: 800, fontSize: 28, color: '#1A2B4A', marginBottom: 12 }}>
                Enquiry sent!
              </h2>
              <p style={{ color: '#7A7A7A', fontSize: 16, fontFamily: 'var(--fp-body-font)' }}>
                We&apos;ll get back to you within one business day.
              </p>
            </div>
          ) : (
            <>
              <h2 style={{ fontFamily: 'var(--fp-heading-font)', fontWeight: 900, fontSize: 'clamp(24px, 3.5vw, 40px)', color: '#1A2B4A', marginBottom: 8 }}>
                Get in touch
              </h2>
              <p style={{ color: '#7A7A7A', fontSize: 16, marginBottom: 40, fontFamily: 'var(--fp-body-font)', lineHeight: 1.6 }}>
                Tell us a bit about what you&apos;re looking for and we&apos;ll take it from there.
              </p>

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                {/* Name */}
                <div>
                  <label style={labelStyle}>Your name</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    placeholder="Aisha Kumar"
                    style={inputStyle}
                    onFocus={e => (e.target.style.borderColor = '#FF8C00')}
                    onBlur={e => (e.target.style.borderColor = 'rgba(26,43,74,0.15)')}
                  />
                </div>

                {/* Brand / school name */}
                <div>
                  <label style={labelStyle}>Brand or school name</label>
                  <input
                    type="text"
                    required
                    value={form.brand}
                    onChange={e => setForm(f => ({ ...f, brand: e.target.value }))}
                    placeholder="Little Learners Academy"
                    style={inputStyle}
                    onFocus={e => (e.target.style.borderColor = '#FF8C00')}
                    onBlur={e => (e.target.style.borderColor = 'rgba(26,43,74,0.15)')}
                  />
                </div>

                {/* Email */}
                <div>
                  <label style={labelStyle}>Email address</label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                    placeholder="hello@yourschool.com"
                    style={inputStyle}
                    onFocus={e => (e.target.style.borderColor = '#FF8C00')}
                    onBlur={e => (e.target.style.borderColor = 'rgba(26,43,74,0.15)')}
                  />
                </div>

                {/* Message */}
                <div>
                  <label style={labelStyle}>Message</label>
                  <textarea
                    required
                    rows={5}
                    value={form.message}
                    onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                    placeholder="Tell us about your requirements, quantity, timeline, what you need..."
                    style={{ ...inputStyle, resize: 'vertical', fontFamily: 'var(--fp-body-font)' }}
                    onFocus={e => (e.target.style.borderColor = '#FF8C00')}
                    onBlur={e => (e.target.style.borderColor = 'rgba(26,43,74,0.15)')}
                  />
                </div>

                <button
                  type="submit"
                  disabled={sending}
                  className="fp-btn fp-btn-primary"
                  style={{ alignSelf: 'flex-start', opacity: sending ? 0.7 : 1, cursor: sending ? 'wait' : 'pointer' }}
                >
                  {sending ? 'Sending…' : 'Send enquiry'}
                  {!sending && (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                      <path d="M5 12h14M13 6l6 6-6 6" />
                    </svg>
                  )}
                </button>
              </form>
            </>
          )}
        </div>
      </section>

      <Footer />
    </div>
  )
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: 13,
  fontWeight: 800,
  color: '#1A2B4A',
  marginBottom: 8,
  fontFamily: 'var(--fp-body-font)',
  letterSpacing: '0.02em',
  textTransform: 'uppercase',
}

const inputStyle: React.CSSProperties = {
  display: 'block',
  width: '100%',
  padding: '12px 16px',
  border: '1.5px solid rgba(26,43,74,0.15)',
  borderRadius: 8,
  fontSize: 15,
  fontFamily: 'var(--fp-body-font)',
  color: '#1A2B4A',
  background: 'white',
  outline: 'none',
  transition: 'border-color 0.2s',
}
