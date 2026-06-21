'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'

export type Theme = 'kids' | 'premium'

interface ThemeContextValue {
  theme: Theme
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: 'kids',
  toggleTheme: () => {},
})

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>('kids')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const saved = localStorage.getItem('fp-theme') as Theme
    if (saved === 'kids' || saved === 'premium') setTheme(saved)
  }, [])

  useEffect(() => {
    if (!mounted) return
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('fp-theme', theme)
  }, [theme, mounted])

  const toggleTheme = () => setTheme(t => (t === 'kids' ? 'premium' : 'kids'))

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext)
