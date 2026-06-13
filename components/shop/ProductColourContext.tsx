'use client'

import { createContext, useContext, useState, type ReactNode } from 'react'

type ProductColourContextValue = {
  selected: number
  setSelected: (index: number) => void
}

const ProductColourContext = createContext<ProductColourContextValue | null>(null)

export function ProductColourProvider({ children }: { children: ReactNode }) {
  const [selected, setSelected] = useState(0)
  return (
    <ProductColourContext.Provider value={{ selected, setSelected }}>
      {children}
    </ProductColourContext.Provider>
  )
}

export function useProductColour() {
  const ctx = useContext(ProductColourContext)
  if (!ctx) throw new Error('useProductColour must be used within a ProductColourProvider')
  return ctx
}
