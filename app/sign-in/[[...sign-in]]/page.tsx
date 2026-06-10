import Link from 'next/link'
import Image from 'next/image'
import { SignIn } from '@clerk/nextjs'

const clerkEnabled = Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY)

export default function SignInPage() {
  return (
    <main className="auth-page">
      <div className="auth-shell">
        <aside className="auth-aside">
          <Link href="/" className="auth-logo">
            <Image src="/assets/foalandpony_wordmark.png" alt="Foal & Pony" width={170} height={44} priority />
          </Link>
          <span className="auth-eyebrow">Welcome back</span>
          <h1 className="auth-aside-title">
            Glad you&apos;re <em>back.</em>
          </h1>
          <p className="auth-aside-copy">
            Sign in to track orders, save your child&apos;s fit, and breeze through checkout.
          </p>
          <Image
            src="/assets/foal.png"
            alt=""
            width={200}
            height={200}
            className="auth-aside-mascot"
          />
        </aside>
        <div className="auth-form">
          {clerkEnabled ? (
            <SignIn signUpUrl="/sign-up" />
          ) : (
            <div className="auth-disabled">
              <h2>Accounts coming soon</h2>
              <p>
                Customer sign-in isn&apos;t switched on yet. Add your Clerk keys to{' '}
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
