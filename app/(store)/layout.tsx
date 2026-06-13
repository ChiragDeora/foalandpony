import type { ReactNode } from 'react'
import { auth } from '@clerk/nextjs/server'
import '../store.css'
import { CartProvider } from '@/lib/cart/cart-context'
import { ShopHeader } from '@/components/shop/ShopHeader'
import { ShopFooter } from '@/components/shop/ShopFooter'

const clerkEnabled = Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY)

export default async function StoreLayout({ children }: { children: ReactNode }) {
  const signedIn = clerkEnabled ? Boolean((await auth()).userId) : false

  return (
    <CartProvider signedIn={signedIn}>
      <div className="store-shell">
        <ShopHeader />
        <div className="store-main">{children}</div>
        <ShopFooter />
      </div>
    </CartProvider>
  )
}
