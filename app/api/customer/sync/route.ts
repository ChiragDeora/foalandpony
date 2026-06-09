import { auth, currentUser } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { syncCustomerFromClerk } from '@/lib/auth/sync-customer'

export async function POST() {
  const { userId } = await auth()
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const user = await currentUser()
  const email = user?.emailAddresses.find((e) => e.id === user.primaryEmailAddressId)
    ?.emailAddress

  if (!email) {
    return NextResponse.json({ error: 'No email on account' }, { status: 400 })
  }

  const result = await syncCustomerFromClerk({
    clerkUserId: userId,
    email,
    fullName: user?.fullName ?? null,
  })

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
