'use client'

import Link from 'next/link'
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs'

const clerkEnabled = Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY)

export function ShopAuthActions() {
  if (!clerkEnabled) {
    return (
      <Link href="/sign-in" className="shop-btn shop-btn-ghost">
        Sign in
      </Link>
    )
  }

  return (
    <>
      <SignedOut>
        <SignInButton mode="modal">
          <button type="button" className="shop-btn shop-btn-ghost">
            Sign in
          </button>
        </SignInButton>
      </SignedOut>
      <SignedIn>
        <UserButton afterSignOutUrl="/" />
      </SignedIn>
    </>
  )
}
