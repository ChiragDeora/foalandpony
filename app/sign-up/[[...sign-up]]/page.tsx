import Link from 'next/link'
import Image from 'next/image'
import { SignUp } from '@clerk/nextjs'

const clerkEnabled = Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY)

export default function SignUpPage() {
  return (
    <main className="auth-page">
      <div className="auth-shell">
        <aside className="auth-aside auth-aside-pony">
          <Link href="/" className="auth-logo">
            <Image src="/assets/foalandpony_wordmark.png" alt="Foal & Pony" width={170} height={44} priority />
          </Link>
          <span className="auth-eyebrow">Join the herd</span>
          <h1 className="auth-aside-title">
            Glasses that <em>survive</em> being a kid.
          </h1>
          <p className="auth-aside-copy">
            Create an account for faster checkout, order tracking, and saved fits for every little
            adventurer.
          </p>
          <Image
            src="/assets/pony.png"
            alt=""
            width={210}
            height={210}
            className="auth-aside-mascot"
          />
        </aside>
        <div className="auth-form">
          {clerkEnabled ? (
            <SignUp signInUrl="/sign-in" />
          ) : (
            <div className="auth-disabled">
              <h2>Accounts coming soon</h2>
              <p>
                Customer sign-up isn&apos;t switched on yet. Add your Clerk keys to{' '}
                <code>.env.local</code> to enable it.
              </p>
              <Link href="/shop" className="btn btn-primary">
                Continue to shop
              </Link>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
