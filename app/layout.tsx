import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import './globals.css'

export const metadata: Metadata = {
  title: 'Foal & Pony - Premium Kids Eyewear',
  description: 'Fun, flexible, and virtually unbreakable frames designed specifically for children. Because every adventure deserves clear vision.',
}

export default function RootLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

