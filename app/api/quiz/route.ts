import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

/**
 * Shape Spotter opt-in lead capture.
 *
 * Stores ONLY the aggregate screening result plus the parent's own contact
 * details, and only when the parent opted in on the results screen. The child's
 * name and age are never sent by the client and are never stored here - no child
 * field is ever linked to the parent's contact (India DPDP-conscious design).
 */

type QuizPayload = {
  symptomScore?: number
  rightEyeLevel?: number
  leftEyeLevel?: number
  asymmetryFlag?: boolean
  resultTier?: 'GREEN' | 'YELLOW' | 'RED'
  parentName?: string | null
  parentContact?: string
}

function clampInt(value: unknown, min: number, max: number) {
  const n = Math.floor(Number(value))
  if (!Number.isFinite(n)) return min
  return Math.min(max, Math.max(min, n))
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as QuizPayload | null
  if (!body) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }

  const parentContact = body.parentContact?.trim()
  if (!parentContact) {
    return NextResponse.json({ error: 'Contact is required to opt in' }, { status: 400 })
  }
  const resultTier = body.resultTier
  if (resultTier !== 'GREEN' && resultTier !== 'YELLOW' && resultTier !== 'RED') {
    return NextResponse.json({ error: 'Invalid result' }, { status: 400 })
  }

  const supabase = createAdminClient()
  if (!supabase) {
    return NextResponse.json({ error: 'Store is not configured' }, { status: 503 })
  }

  const { error } = await supabase.from('quiz_leads').insert({
    symptom_score: clampInt(body.symptomScore, 0, 8),
    right_eye_level: clampInt(body.rightEyeLevel, 0, 5),
    left_eye_level: clampInt(body.leftEyeLevel, 0, 5),
    asymmetry_flag: Boolean(body.asymmetryFlag),
    result_tier: resultTier,
    parent_name: body.parentName?.trim() || null,
    parent_contact: parentContact,
  })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
