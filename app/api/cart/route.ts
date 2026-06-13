import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { createAdminClient } from '@/lib/supabase/admin'
import type { CartItem } from '@/lib/cart/cart-context'

export async function GET() {
  const { userId } = await auth()
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createAdminClient()
  if (!supabase) {
    return NextResponse.json({ items: [] })
  }

  const { data } = await supabase
    .from('carts')
    .select('items')
    .eq('clerk_user_id', userId)
    .single()

  return NextResponse.json({ items: (data?.items as CartItem[]) ?? [] })
}

export async function PUT(request: Request) {
  const { userId } = await auth()
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json().catch(() => null)
  const items = body?.items as CartItem[] | undefined
  if (!Array.isArray(items)) {
    return NextResponse.json({ error: 'Invalid items' }, { status: 400 })
  }

  const supabase = createAdminClient()
  if (!supabase) {
    return NextResponse.json({ ok: false })
  }

  await supabase
    .from('carts')
    .upsert(
      { clerk_user_id: userId, items, updated_at: new Date().toISOString() },
      { onConflict: 'clerk_user_id' }
    )

  return NextResponse.json({ ok: true })
}
