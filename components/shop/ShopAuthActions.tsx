'use client'

import Link from 'next/link'
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs'

const clerkEnabled = Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY)

/* Brand icons for the custom UserButton menu */
function BagIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 7h12l-1 13H7z" />
      <path d="M9 7a3 3 0 016 0" />
    </svg>
  )
}
function GlassesIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="6" cy="14" r="3.2" />
      <circle cx="18" cy="14" r="3.2" />
      <path d="M9.2 13c1.2-1 4.4-1 5.6 0M3 12l2-4M21 12l-2-4" />
    </svg>
  )
}

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
        <UserButton afterSignOutUrl="/" userProfileMode="modal">
          <UserButton.MenuItems>
            <UserButton.Link label="My account" labelIcon={<BagIcon />} href="/account" />
            <UserButton.Link label="Find your fit" labelIcon={<GlassesIcon />} href="/fit" />
            <UserButton.Action label="manageAccount" />
            <UserButton.Action label="signOut" />
          </UserButton.MenuItems>
        </UserButton>
      </SignedIn>
    </>
  )
}
