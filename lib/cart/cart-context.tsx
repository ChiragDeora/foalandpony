'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

export type CartItem = {
  productId: string
  slug: string
  name: string
  image: string | null
  price: number
  colourName?: string
  colourHex?: string
  quantity: number
}

type CartContextValue = {
  items: CartItem[]
  itemCount: number
  subtotal: number
  addItem: (item: Omit<CartItem, 'quantity'>, quantity?: number) => void
  updateQuantity: (productId: string, colourName: string | undefined, quantity: number) => void
  removeItem: (productId: string, colourName: string | undefined) => void
  clearCart: () => void
}

const CartContext = createContext<CartContextValue | null>(null)

const STORAGE_KEY = 'fp_cart_v1'

function lineKey(productId: string, colourName?: string) {
  return `${productId}::${colourName ?? ''}`
}

function mergeCartItems(local: CartItem[], server: CartItem[]): CartItem[] {
  const merged = [...server]
  for (const item of local) {
    const key = lineKey(item.productId, item.colourName)
    const idx = merged.findIndex((m) => lineKey(m.productId, m.colourName) === key)
    if (idx >= 0) {
      merged[idx] = { ...merged[idx], quantity: merged[idx].quantity + item.quantity }
    } else {
      merged.push(item)
    }
  }
  return merged
}

export function CartProvider({
  children,
  signedIn = false,
}: {
  children: ReactNode
  signedIn?: boolean
}) {
  const [items, setItems] = useState<CartItem[]>([])
  const [hydrated, setHydrated] = useState(false)
  const [serverSynced, setServerSynced] = useState(false)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) setItems(JSON.parse(raw))
    } catch {
      // ignore corrupt storage
    }
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (!hydrated) return
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  }, [items, hydrated])

  // Once signed in, merge any guest cart into the account's saved cart.
  useEffect(() => {
    if (!hydrated || !signedIn || serverSynced) return
    let cancelled = false
    ;(async () => {
      try {
        const res = await fetch('/api/cart')
        if (res.ok) {
          const data = await res.json()
          const serverItems = (data.items ?? []) as CartItem[]
          if (!cancelled) setItems((local) => mergeCartItems(local, serverItems))
        }
      } catch {
        // ignore — localStorage stays authoritative
      } finally {
        if (!cancelled) setServerSynced(true)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [hydrated, signedIn, serverSynced])

  // Keep the account's saved cart up to date.
  useEffect(() => {
    if (!hydrated || !signedIn || !serverSynced) return
    const timeout = setTimeout(() => {
      fetch('/api/cart', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items }),
      }).catch(() => {})
    }, 600)
    return () => clearTimeout(timeout)
  }, [items, hydrated, signedIn, serverSynced])

  const addItem = useCallback((item: Omit<CartItem, 'quantity'>, quantity = 1) => {
    setItems((prev) => {
      const key = lineKey(item.productId, item.colourName)
      const existing = prev.find((p) => lineKey(p.productId, p.colourName) === key)
      if (existing) {
        return prev.map((p) =>
          lineKey(p.productId, p.colourName) === key
            ? { ...p, quantity: p.quantity + quantity }
            : p
        )
      }
      return [...prev, { ...item, quantity }]
    })
  }, [])

  const updateQuantity = useCallback(
    (productId: string, colourName: string | undefined, quantity: number) => {
      const key = lineKey(productId, colourName)
      setItems((prev) =>
        prev
          .map((p) => (lineKey(p.productId, p.colourName) === key ? { ...p, quantity } : p))
          .filter((p) => p.quantity > 0)
      )
    },
    []
  )

  const removeItem = useCallback((productId: string, colourName: string | undefined) => {
    const key = lineKey(productId, colourName)
    setItems((prev) => prev.filter((p) => lineKey(p.productId, p.colourName) !== key))
  }, [])

  const clearCart = useCallback(() => setItems([]), [])

  const itemCount = useMemo(() => items.reduce((sum, i) => sum + i.quantity, 0), [items])
  const subtotal = useMemo(() => items.reduce((sum, i) => sum + i.price * i.quantity, 0), [items])

  const value = useMemo<CartContextValue>(
    () => ({ items, itemCount, subtotal, addItem, updateQuantity, removeItem, clearCart }),
    [items, itemCount, subtotal, addItem, updateQuantity, removeItem, clearCart]
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within a CartProvider')
  return ctx
}
