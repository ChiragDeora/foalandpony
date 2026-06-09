import { UserButton } from '@clerk/nextjs'
import { auth } from '@clerk/nextjs/server'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { SyncCustomerOnVisit } from '@/components/auth/SyncCustomerOnVisit'

export default async function AccountPage() {
  const { userId } = await auth()
  if (!userId) {
    redirect('/sign-in')
  }

  return (
    <main className="shop-page account-page">
      <SyncCustomerOnVisit />
      <div className="account-header">
        <h1>My account</h1>
        <UserButton afterSignOutUrl="/" />
      </div>
      <p>Order history will appear here once checkout is connected to Medusa.</p>
      <nav className="account-links">
        <Link href="/shop">Continue shopping</Link>
        <Link href="/cart">View cart</Link>
      </nav>
    </main>
  )
}
