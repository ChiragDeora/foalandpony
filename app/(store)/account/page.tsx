import { UserButton } from '@clerk/nextjs'
import { auth } from '@clerk/nextjs/server'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { SyncCustomerOnVisit } from '@/components/auth/SyncCustomerOnVisit'
import { createAdminClient } from '@/lib/supabase/admin'
import { formatInr } from '@/lib/util/money'

type OrderRow = {
  id: string
  total_amount: number
  status: string
  created_at: string
}

export default async function AccountPage() {
  const { userId } = await auth()
  if (!userId) {
    redirect('/sign-in')
  }

  const supabase = createAdminClient()
  let orders: OrderRow[] = []
  if (supabase) {
    const { data } = await supabase
      .from('orders')
      .select('id, total_amount, status, created_at')
      .eq('clerk_user_id', userId)
      .order('created_at', { ascending: false })
    orders = (data ?? []) as OrderRow[]
  }

  return (
    <main className="shop-page account-page">
      <SyncCustomerOnVisit />
      <div className="account-header">
        <h1>My account</h1>
        <UserButton afterSignOutUrl="/" />
      </div>

      <h2>Your orders</h2>
      {orders.length === 0 ? (
        <p>No orders yet.</p>
      ) : (
        <ul className="account-order-list">
          {orders.map((order) => (
            <li key={order.id} className="account-order-row">
              <Link href={`/order/${order.id}`}>
                Order #{order.id.slice(0, 8)}
              </Link>
              <span>{new Date(order.created_at).toLocaleDateString('en-IN')}</span>
              <span>{formatInr(order.total_amount)}</span>
              <span className="account-order-status">{order.status.replace('_', ' ')}</span>
            </li>
          ))}
        </ul>
      )}

      <nav className="account-links">
        <Link href="/shop">Continue shopping</Link>
        <Link href="/cart">View cart</Link>
      </nav>
    </main>
  )
}
