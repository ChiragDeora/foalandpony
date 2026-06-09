import type { ReactNode } from 'react'
import '../store.css'
import { ShopHeader } from '@/components/shop/ShopHeader'
import { ShopFooter } from '@/components/shop/ShopFooter'

export default function StoreLayout({ children }: { children: ReactNode }) {
  return (
    <div className="store-shell">
      <ShopHeader />
      <div className="store-main">{children}</div>
      <ShopFooter />
    </div>
  )
}
