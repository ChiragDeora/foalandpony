import { createAdminClient } from '@/lib/supabase/admin'

export type ClerkUserPayload = {
  clerkUserId: string
  email: string
  fullName?: string | null
}

export type SyncCustomerResult = {
  ok: boolean
  error?: string
}

/**
 * After Clerk sign-in: persist a user_profiles row in Supabase.
 *
 * Customer/order data is not stored anywhere transactional yet — the site is
 * brand-presence + product info, with enquiries routed through WhatsApp.
 * When checkout goes live, extend this function to also create the customer
 * record in whatever commerce engine we wire up at that point.
 */
export async function syncCustomerFromClerk(
  user: ClerkUserPayload
): Promise<SyncCustomerResult> {
  const supabase = createAdminClient()
  if (!supabase) {
    return { ok: false, error: 'Supabase is not configured' }
  }

  const { error } = await supabase.from('user_profiles').upsert(
    {
      clerk_user_id: user.clerkUserId,
      email: user.email,
      full_name: user.fullName ?? null,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'clerk_user_id' }
  )

  if (error) {
    return { ok: false, error: error.message }
  }

  return { ok: true }
}
