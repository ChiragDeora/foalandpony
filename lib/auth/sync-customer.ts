import { createAdminClient } from '@/lib/supabase/admin'
import { createMedusaAdminClient } from '@/lib/medusa/admin'

export type ClerkUserPayload = {
  clerkUserId: string
  email: string
  fullName?: string | null
}

export type SyncCustomerResult = {
  ok: boolean
  medusaCustomerId?: string | null
  error?: string
}

/**
 * After Clerk sign-in: link user in Supabase and create/find Medusa customer.
 * Commerce orders still live in Medusa; Clerk only handles website login.
 */
export async function syncCustomerFromClerk(
  user: ClerkUserPayload
): Promise<SyncCustomerResult> {
  const supabase = createAdminClient()
  if (!supabase) {
    return { ok: false, error: 'Supabase is not configured' }
  }

  const { data: existing } = await supabase
    .from('user_profiles')
    .select('medusa_customer_id')
    .eq('clerk_user_id', user.clerkUserId)
    .maybeSingle()

  let medusaCustomerId = existing?.medusa_customer_id ?? null

  if (!medusaCustomerId) {
    const medusa = createMedusaAdminClient()
    if (medusa) {
      try {
        const [firstName, ...rest] = (user.fullName ?? '').split(' ')
        const lastName = rest.join(' ') || undefined

        const { customer } = await medusa.admin.customer.create({
          email: user.email,
          first_name: firstName || undefined,
          last_name: lastName,
        })
        medusaCustomerId = customer.id
      } catch (e) {
        const message = e instanceof Error ? e.message : 'Medusa customer create failed'
        // Still save profile without Medusa id if backend is offline
        console.warn('[sync-customer]', message)
      }
    }
  }

  const { error } = await supabase.from('user_profiles').upsert(
    {
      clerk_user_id: user.clerkUserId,
      email: user.email,
      full_name: user.fullName ?? null,
      medusa_customer_id: medusaCustomerId,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'clerk_user_id' }
  )

  if (error) {
    return { ok: false, error: error.message }
  }

  return { ok: true, medusaCustomerId }
}
