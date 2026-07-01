'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ShapeGlyph, SHAPE_NAMES, type ShapeName } from './shapes'

/*
 * Shape Spotter - a 3-part at-home vision SCREENING game (not a diagnosis).
 *
 * Privacy (India DPDP-conscious, per the build spec):
 *  - The child's name and age are used ON SCREEN ONLY. They live in component
 *    state and are NEVER sent to the server or stored.
 *  - The quiz runs open - there is no contact gate before it. Contact capture is
 *    a single optional opt-in on the results screen, and only the PARENT's own
 *    details are stored, and only if they opt in.
 *  - No child field is ever linked to the parent's contact details.
 */

const WHATSAPP = 'https://wa.me/919324337504'
const EYE_TEST_MAPS = 'https://www.google.com/maps/search/eye+test+optometrist+near+me'

// Level sizes as a percentage of viewport height, largest → smallest.
const LEVEL_SIZES = [15, 10, 6, 3.5, 2]

const SYMPTOMS = [
  'Does your child sit very close to the TV or hold books/tablets close to their face?',
  'Does your child squint, tilt their head, or close one eye to look at things?',
  'Does your child complain of headaches after reading or screen time?',
  'Does your child avoid reading or lose their place often while reading?',
  'Does your child rub their eyes a lot, even when not tired?',
  'Has a teacher mentioned trouble seeing the board?',
  'Does your child seem clumsier than peers (missing stairs, catching a ball)?',
  'Does either parent wear glasses, especially from a young age?',
]

type Tier = 'GREEN' | 'YELLOW' | 'RED'
type Step = 'setup' | 'symptoms' | 'game' | 'result'
type Eye = 'right' | 'left'

const NAVY = '#16233D'
const CREAM = '#F5F3ED'

const TIER_UI: Record<Tier, { label: string; color: string; bg: string }> = {
  GREEN: { label: 'All clear', color: '#2E7D3A', bg: '#E7F5EB' },
  YELLOW: { label: 'Worth keeping an eye on', color: '#9A6800', bg: '#FBF1D6' },
  RED: { label: 'Book a check-up soon', color: '#B23B34', bg: '#FBE6E4' },
}

function shuffled<T>(arr: readonly T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function computeTier(symptomScore: number, right: number, left: number): {
  tier: Tier
  asymmetryFlag: boolean
} {
  const asymmetryFlag = Math.abs(right - left) >= 2
  const lower = Math.min(right, left)
  let tier: Tier
  if (asymmetryFlag) tier = 'RED'
  else if (symptomScore >= 4 || lower <= 2) tier = 'RED'
  else if (symptomScore >= 2 || lower === 3) tier = 'YELLOW'
  else tier = 'GREEN'
  return { tier, asymmetryFlag }
}

// --- small styled helpers --------------------------------------------------
const heading: React.CSSProperties = {
  fontFamily: 'var(--fp-heading-font)',
  fontWeight: 800,
  color: NAVY,
  lineHeight: 1.12,
}
const body: React.CSSProperties = {
  fontFamily: 'var(--fp-body-font)',
  color: '#4A4A4A',
  lineHeight: 1.65,
}

function PrimaryButton({
  children,
  onClick,
  href,
  disabled,
}: {
  children: React.ReactNode
  onClick?: () => void
  href?: string
  disabled?: boolean
}) {
  const style: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: '14px 26px',
    borderRadius: 999,
    background: disabled ? '#C9CDD4' : '#FF8C00',
    color: '#fff',
    fontWeight: 700,
    fontSize: 16,
    fontFamily: 'var(--fp-body-font)',
    border: 'none',
    cursor: disabled ? 'not-allowed' : 'pointer',
    textDecoration: 'none',
  }
  if (href) return <a href={href} target="_blank" rel="noopener noreferrer" style={style}>{children}</a>
  return <button type="button" onClick={onClick} disabled={disabled} style={style}>{children}</button>
}

function GhostButton({ children, onClick, href }: { children: React.ReactNode; onClick?: () => void; href?: string }) {
  const style: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '13px 24px',
    borderRadius: 999,
    background: '#fff',
    color: NAVY,
    fontWeight: 700,
    fontSize: 15,
    fontFamily: 'var(--fp-body-font)',
    border: `2px solid ${NAVY}`,
    cursor: 'pointer',
    textDecoration: 'none',
  }
  if (href) return <a href={href} target="_blank" rel="noopener noreferrer" style={style}>{children}</a>
  return <button type="button" onClick={onClick} style={style}>{children}</button>
}

const card: React.CSSProperties = {
  background: '#fff',
  borderRadius: 22,
  boxShadow: '0 10px 40px rgba(22,35,61,0.08)',
  padding: 'clamp(24px, 4vw, 44px)',
  width: '100%',
  maxWidth: 640,
}

// permanent, on-every-result footer required by the spec
function ScreeningFooter() {
  return (
    <p style={{ ...body, fontSize: 12.5, color: '#8A8A8A', marginTop: 22, textAlign: 'center' }}>
      This is a screening game for engagement purposes and does not replace a professional eye examination.
    </p>
  )
}

export function ShapeSpotterQuiz() {
  const [step, setStep] = useState<Step>('setup')

  // in-session only, never stored / never sent to the server
  const [childName, setChildName] = useState('')
  const [childAge, setChildAge] = useState('')

  // symptom answers: 'yes' | 'no' | undefined
  const [answers, setAnswers] = useState<Array<'yes' | 'no' | undefined>>(Array(8).fill(undefined))

  // game state
  const [eye, setEye] = useState<Eye>('right')
  const [showCover, setShowCover] = useState(true)
  const [level, setLevel] = useState(1) // 1..5
  const [seq, setSeq] = useState<ShapeName[]>(() => shuffled(SHAPE_NAMES))
  const [rightEyeLevel, setRightEyeLevel] = useState<number | null>(null)
  const [leftEyeLevel, setLeftEyeLevel] = useState<number | null>(null)

  const name = childName.trim() || 'your child'

  // ---- flow helpers ----
  function startGame() {
    setEye('right')
    setShowCover(true)
    setLevel(1)
    setSeq(shuffled(SHAPE_NAMES))
    setStep('game')
  }

  function finishEye(reachedLevel: number) {
    if (eye === 'right') {
      setRightEyeLevel(reachedLevel)
      setEye('left')
      setShowCover(true)
      setLevel(1)
      setSeq(shuffled(SHAPE_NAMES))
    } else {
      setLeftEyeLevel(reachedLevel)
      setStep('result')
    }
  }

  function mark(correct: boolean) {
    if (correct) {
      if (level >= 5) finishEye(5)
      else setLevel(level + 1)
    } else {
      finishEye(level - 1) // last level correctly identified (0 if they miss level 1)
    }
  }

  // ---------------------------------------------------------------- SETUP ---
  if (step === 'setup') {
    return (
      <Shell>
        <Eyebrow>Shape Spotter · vision screening</Eyebrow>
        <h1 style={{ ...heading, fontSize: 'clamp(28px, 5vw, 42px)', margin: '10px 0 8px' }}>
          Let&apos;s check your child&apos;s vision.
        </h1>
        <p style={{ ...body, fontSize: 16, marginBottom: 22 }}>
          A quick, playful screening game - about 4 minutes. It can tell you whether it&apos;s worth
          booking an eye test. It can&apos;t replace one.
        </p>

        <ul style={{ ...body, fontSize: 15, listStyle: 'none', padding: 0, margin: '0 0 24px', display: 'grid', gap: 12 }}>
          {[
            'Best for kids ages 3-10 (younger kids may not follow instructions reliably; older kids can usually read a standard eye chart).',
            'Use a laptop, tablet, or TV screen - not a phone, it’s too small to be meaningful.',
            'Sit your child about 3 metres (10 feet) from the screen.',
            'You’ll test one eye at a time - cover the other with a hand or a clean cloth, no peeking.',
          ].map((t, i) => (
            <li key={i} style={{ display: 'flex', gap: 10 }}>
              <span aria-hidden style={{ color: '#FF8C00', fontWeight: 800 }}>•</span>
              <span>{t}</span>
            </li>
          ))}
        </ul>

        <div style={{ display: 'grid', gap: 14, marginBottom: 26 }}>
          <label style={{ ...body, fontSize: 14, fontWeight: 600, color: NAVY }}>
            Child&apos;s first name <span style={{ color: '#9A9A9A', fontWeight: 500 }}>(shown on screen only, never saved)</span>
            <input
              value={childName}
              onChange={(e) => setChildName(e.target.value)}
              placeholder="e.g. Aanya"
              style={inputStyle}
            />
          </label>
          <label style={{ ...body, fontSize: 14, fontWeight: 600, color: NAVY }}>
            Age <span style={{ color: '#9A9A9A', fontWeight: 500 }}>(used to tailor the check, never saved)</span>
            <input
              value={childAge}
              onChange={(e) => setChildAge(e.target.value.replace(/[^0-9]/g, '').slice(0, 2))}
              inputMode="numeric"
              placeholder="e.g. 6"
              style={inputStyle}
            />
          </label>
        </div>

        <PrimaryButton onClick={() => setStep('symptoms')}>Start the check →</PrimaryButton>
        <p style={{ ...body, fontSize: 12.5, color: '#8A8A8A', marginTop: 18 }}>
          This is a fun screening game, not a medical exam.
        </p>
      </Shell>
    )
  }

  // ------------------------------------------------------------- SYMPTOMS ---
  if (step === 'symptoms') {
    return (
      <Shell>
        <Eyebrow>Part 1 of 2 · a few quick questions</Eyebrow>
        <h2 style={{ ...heading, fontSize: 'clamp(24px, 4vw, 34px)', margin: '10px 0 6px' }}>
          What have you noticed?
        </h2>
        <p style={{ ...body, fontSize: 15, marginBottom: 20 }}>
          Answer for {name}. There are no wrong answers - just tap what fits.
        </p>

        <div style={{ display: 'grid', gap: 12, marginBottom: 26 }}>
          {SYMPTOMS.map((q, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 14,
                padding: '14px 16px',
                borderRadius: 14,
                background: CREAM,
              }}
            >
              <span style={{ ...body, fontSize: 14.5, color: NAVY, flex: 1 }}>{q}</span>
              <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                {(['yes', 'no'] as const).map((v) => {
                  const active = answers[i] === v
                  return (
                    <button
                      key={v}
                      type="button"
                      onClick={() =>
                        setAnswers((prev) => {
                          const next = [...prev]
                          next[i] = v
                          return next
                        })
                      }
                      style={{
                        padding: '8px 16px',
                        borderRadius: 999,
                        border: `2px solid ${active ? (v === 'yes' ? '#FF8C00' : NAVY) : '#D8D5CC'}`,
                        background: active ? (v === 'yes' ? '#FF8C00' : NAVY) : '#fff',
                        color: active ? '#fff' : '#6A6A6A',
                        fontWeight: 700,
                        fontSize: 13.5,
                        fontFamily: 'var(--fp-body-font)',
                        cursor: 'pointer',
                        textTransform: 'capitalize',
                      }}
                    >
                      {v}
                    </button>
                  )
                })}
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <PrimaryButton onClick={startGame}>Next: the shape game →</PrimaryButton>
          <GhostButton onClick={() => setStep('setup')}>Back</GhostButton>
        </div>
      </Shell>
    )
  }

  // ---------------------------------------------------------------- GAME ----
  if (step === 'game') {
    if (showCover) {
      const coverThis = eye === 'right' ? 'left' : 'right'
      const testThis = eye === 'right' ? 'right' : 'left'
      return (
        <Shell>
          <Eyebrow>Part 2 of 2 · the shape game</Eyebrow>
          {eye === 'left' && (
            <p style={{ ...heading, fontSize: 22, color: '#2E7D3A', margin: '6px 0 2px' }}>Great job!</p>
          )}
          <h2 style={{ ...heading, fontSize: 'clamp(24px, 4vw, 34px)', margin: '8px 0 10px' }}>
            {eye === 'right' ? `Cover ${name}’s LEFT eye` : 'Now cover the other eye'}
          </h2>
          <p style={{ ...body, fontSize: 16, marginBottom: 8 }}>
            {eye === 'right'
              ? `Gently cover the ${coverThis} eye with a hand or a clean cloth - no peeking. We’ll test the ${testThis} eye first.`
              : `Cover ${name}’s ${coverThis} eye now, and let’s do that again for the ${testThis} eye.`}
          </p>
          <p style={{ ...body, fontSize: 14.5, marginBottom: 24, color: '#6A6A6A' }}>
            A shape will appear, getting smaller each time. Ask {name} to name it out loud, then tap
            whether they got it.
          </p>
          <PrimaryButton onClick={() => setShowCover(false)}>
            Start the {testThis} eye →
          </PrimaryButton>
        </Shell>
      )
    }

    const shape = seq[level - 1]
    const sizeVh = LEVEL_SIZES[level - 1]
    return (
      <Shell>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <Eyebrow>Testing the {eye} eye</Eyebrow>
          <span style={{ ...body, fontSize: 13, color: '#9A9A9A' }}>Shape {level} of 5</span>
        </div>
        <p style={{ ...heading, fontSize: 20, textAlign: 'center', margin: '4px 0 4px' }}>What shape is this?</p>
        <p style={{ ...body, fontSize: 13.5, textAlign: 'center', color: '#9A9A9A', marginBottom: 6 }}>
          Ask {name} - don&apos;t say it for them.
        </p>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '34vh',
            padding: '16px 0',
          }}
        >
          <ShapeGlyph name={shape} sizeVh={sizeVh} />
        </div>

        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button type="button" onClick={() => mark(true)} style={answerBtn('#2E7D3A', '#E7F5EB')}>
            ✓ Correct
          </button>
          <button type="button" onClick={() => mark(false)} style={answerBtn('#B23B34', '#FBE6E4')}>
            ✕ Incorrect / hesitated
          </button>
        </div>
        <p style={{ ...body, fontSize: 12.5, color: '#B0B0B0', textAlign: 'center', marginTop: 16 }}>
          Stop is automatic - we end this eye at the first miss.
        </p>
      </Shell>
    )
  }

  // -------------------------------------------------------------- RESULT ----
  const symptomScore = answers.filter((a) => a === 'yes').length
  const right = rightEyeLevel ?? 0
  const left = leftEyeLevel ?? 0
  const { tier, asymmetryFlag } = computeTier(symptomScore, right, left)
  return (
    <ResultScreen
      tier={tier}
      name={name}
      symptomScore={symptomScore}
      rightEyeLevel={right}
      leftEyeLevel={left}
      asymmetryFlag={asymmetryFlag}
      onRestart={() => {
        setAnswers(Array(8).fill(undefined))
        setRightEyeLevel(null)
        setLeftEyeLevel(null)
        setLevel(1)
        setEye('right')
        setShowCover(true)
        setStep('setup')
      }}
    />
  )
}

// --------------------------------------------------------------- RESULT UI --
function ResultScreen({
  tier,
  name,
  symptomScore,
  rightEyeLevel,
  leftEyeLevel,
  asymmetryFlag,
  onRestart,
}: {
  tier: Tier
  name: string
  symptomScore: number
  rightEyeLevel: number
  leftEyeLevel: number
  asymmetryFlag: boolean
  onRestart: () => void
}) {
  const [optIn, setOptIn] = useState(false)
  const [parentName, setParentName] = useState('')
  const [contact, setContact] = useState('')
  const [status, setStatus] = useState<'idle' | 'saving' | 'done' | 'error'>('idle')

  const ui = TIER_UI[tier]

  async function submit() {
    if (!contact.trim()) return
    setStatus('saving')
    try {
      // Only the parent's own details + the aggregate result are sent. No child
      // name/age is ever included in this payload.
      const res = await fetch('/api/quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          symptomScore,
          rightEyeLevel,
          leftEyeLevel,
          asymmetryFlag,
          resultTier: tier,
          parentName: parentName.trim() || null,
          parentContact: contact.trim(),
        }),
      })
      setStatus(res.ok ? 'done' : 'error')
    } catch {
      setStatus('error')
    }
  }

  return (
    <Shell>
      <span
        style={{
          display: 'inline-block',
          padding: '6px 16px',
          borderRadius: 999,
          background: ui.bg,
          color: ui.color,
          fontWeight: 800,
          fontSize: 13,
          letterSpacing: 0.3,
          textTransform: 'uppercase',
          fontFamily: 'var(--fp-body-font)',
        }}
      >
        {ui.label}
      </span>

      {tier === 'GREEN' && (
        <>
          <h2 style={resultHeading}>Nice work!</h2>
          <p style={{ ...body, fontSize: 16.5, marginBottom: 12 }}>
            Based on today&apos;s check-in, {name}&apos;s eyes seem to be doing well.
          </p>
          <p style={{ ...body, fontSize: 15.5, marginBottom: 24 }}>
            This is a fun screening tool, not a full exam - we&apos;d still recommend a proper eye
            test once a year, just to be sure.
          </p>
          <div style={ctaRow}>
            <PrimaryButton href="/collections">Explore our collection</PrimaryButton>
          </div>
          <p style={{ ...body, fontSize: 13.5, color: '#8A8A8A', marginTop: 10 }}>
            Because good eyes deserve good frames anyway.
          </p>
        </>
      )}

      {tier === 'YELLOW' && (
        <>
          <h2 style={resultHeading}>Worth keeping an eye on</h2>
          <p style={{ ...body, fontSize: 16.5, marginBottom: 24 }}>
            A couple of things stood out today. It&apos;s probably nothing urgent, but it&apos;s
            worth getting {name}&apos;s eyes properly checked in the next few weeks.
          </p>
          <div style={ctaRow}>
            <PrimaryButton onClick={() => setOptIn(true)}>Book a check-up reminder</PrimaryButton>
            <GhostButton href={WHATSAPP}>Chat with us on WhatsApp</GhostButton>
          </div>
        </>
      )}

      {tier === 'RED' && (
        <>
          <h2 style={resultHeading}>Book a check-up soon</h2>
          <p style={{ ...body, fontSize: 16.5, marginBottom: 12 }}>
            Based on today&apos;s answers, we&apos;d recommend getting {name}&apos;s eyes examined by
            an optometrist soon rather than waiting.
          </p>
          <p style={{ ...body, fontSize: 15.5, marginBottom: 24 }}>
            This isn&apos;t a diagnosis - only an eye doctor can tell you what&apos;s really going on.
            But it&apos;s worth prioritizing.
          </p>
          <div style={ctaRow}>
            <PrimaryButton href={EYE_TEST_MAPS}>Find an eye test near you</PrimaryButton>
            <GhostButton href={WHATSAPP}>Chat with us on WhatsApp</GhostButton>
          </div>
        </>
      )}

      {/* Optional opt-in - the only place any contact detail is collected. */}
      <div style={{ marginTop: 28, paddingTop: 22, borderTop: '1px solid rgba(22,35,61,0.1)' }}>
        {status === 'done' ? (
          <p style={{ ...body, fontSize: 15, color: '#2E7D3A', fontWeight: 600 }}>
            Done - we&apos;ll send {name}&apos;s results across shortly. Thanks!
          </p>
        ) : !optIn ? (
          <label style={{ display: 'flex', gap: 10, alignItems: 'flex-start', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={optIn}
              onChange={(e) => setOptIn(e.target.checked)}
              style={{ marginTop: 3, width: 18, height: 18, accentColor: '#FF8C00' }}
            />
            <span style={{ ...body, fontSize: 14.5, color: NAVY }}>
              Email or WhatsApp me the results
              <span style={{ display: 'block', color: '#8A8A8A', fontSize: 13 }}>
                Optional. We only store your own contact details, not your child&apos;s.
              </span>
            </span>
          </label>
        ) : (
          <div style={{ display: 'grid', gap: 12 }}>
            <p style={{ ...body, fontSize: 14, fontWeight: 600, color: NAVY, margin: 0 }}>
              Where should we send them?
            </p>
            <input
              value={parentName}
              onChange={(e) => setParentName(e.target.value)}
              placeholder="Your name (optional)"
              style={inputStyle}
            />
            <input
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              placeholder="Email or phone (WhatsApp)"
              style={inputStyle}
            />
            <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
              <PrimaryButton onClick={submit} disabled={status === 'saving' || !contact.trim()}>
                {status === 'saving' ? 'Sending…' : 'Send me the results'}
              </PrimaryButton>
              <button
                type="button"
                onClick={() => setOptIn(false)}
                style={{ ...body, fontSize: 13.5, background: 'none', border: 'none', color: '#8A8A8A', cursor: 'pointer' }}
              >
                No thanks
              </button>
            </div>
            {status === 'error' && (
              <p style={{ ...body, fontSize: 13, color: '#B23B34', margin: 0 }}>
                Couldn&apos;t save that - please try again or WhatsApp us.
              </p>
            )}
          </div>
        )}
      </div>

      <ScreeningFooter />

      <button
        type="button"
        onClick={onRestart}
        style={{ ...body, fontSize: 13.5, background: 'none', border: 'none', color: '#8A8A8A', cursor: 'pointer', marginTop: 16, textDecoration: 'underline' }}
      >
        Run the check again
      </button>
    </Shell>
  )
}

// ------------------------------------------------------------------ atoms ---
const inputStyle: React.CSSProperties = {
  display: 'block',
  width: '100%',
  marginTop: 6,
  padding: '12px 14px',
  borderRadius: 12,
  border: '1.5px solid #D8D5CC',
  fontSize: 15,
  fontFamily: 'var(--fp-body-font)',
  color: NAVY,
  background: '#fff',
}

const resultHeading: React.CSSProperties = {
  ...heading,
  fontSize: 'clamp(26px, 4.5vw, 40px)',
  margin: '14px 0 10px',
}

const ctaRow: React.CSSProperties = { display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }

function answerBtn(color: string, bg: string): React.CSSProperties {
  return {
    padding: '15px 26px',
    borderRadius: 14,
    border: `2px solid ${color}`,
    background: bg,
    color,
    fontWeight: 800,
    fontSize: 16,
    fontFamily: 'var(--fp-body-font)',
    cursor: 'pointer',
  }
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <span
      style={{
        fontFamily: 'var(--fp-body-font)',
        textTransform: 'uppercase',
        letterSpacing: 1.4,
        fontSize: 12,
        fontWeight: 800,
        color: '#FF8C00',
      }}
    >
      {children}
    </span>
  )
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        minHeight: 'calc(100vh - 68px)',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        background: CREAM,
        padding: 'clamp(28px, 6vw, 72px) 20px',
      }}
    >
      <div style={card}>{children}</div>
    </div>
  )
}
