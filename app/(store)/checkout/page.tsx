import { auth, currentUser } from '@clerk/nextjs/server'
import { CheckoutView } from '@/components/shop/CheckoutView'
import { createAdminClient } from '@/lib/supabase/admin'
import type { InitialContact, InitialShipping } from '@/components/shop/CheckoutForm'

const clerkEnabled = Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY)

export default async function CheckoutPage() {
  let initialContact: InitialContact | undefined
  let initialShipping: InitialShipping | undefined

  if (clerkEnabled) {
    const { userId } = await auth()

    if (userId) {
      const user = await currentUser()
      const email = user?.emailAddresses?.[0]?.emailAddress

      const supabase = createAdminClient()
      const { data: profile } = supabase
        ? await supabase
            .from('user_profiles')
            .select('phone, shipping_address')
            .eq('clerk_user_id', userId)
            .maybeSingle()
        : { data: null }

      initialContact = {
        email,
        phone: profile?.phone ?? undefined,
      }
      initialShipping = (profile?.shipping_address as InitialShipping | null) ?? undefined
    }
  }

  return (
    <div className="shop-page checkout-page">
      <h1>Checkout</h1>
      <CheckoutView initialContact={initialContact} initialShipping={initialShipping} />
    </div>
  )
}
