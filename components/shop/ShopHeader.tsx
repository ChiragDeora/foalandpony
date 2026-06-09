import Image from 'next/image'
import Link from 'next/link'
import { getCartItemCount } from '@/lib/data/cart'
import { ShopAuthActions } from './ShopAuthActions'
import { ShopNav } from './ShopNav'

export async function ShopHeader() {
  let cartCount = 0
  try {
    cartCount = await getCartItemCount()
  } catch {
    cartCount = 0
  }

  return (
    <header className="shop-header">
      <div className="shop-header-inner">
        <Link href="/" className="shop-logo">
          <Image
            src="/assets/foalandpony_wordmark.png"
            alt="Foal & Pony"
            width={140}
            height={46}
            className="shop-logo-img"
            priority
          />
        </Link>

        <ShopNav cartCount={cartCount} />

        <div className="shop-header-actions">
          <ShopAuthActions />
          <Link href="/shop" className="shop-btn shop-btn-primary shop-btn-cta">
            Shop now
          </Link>
        </div>
      </div>
    </header>
  )
}
