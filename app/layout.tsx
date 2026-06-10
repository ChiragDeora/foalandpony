import type { Metadata, Viewport } from 'next'
import type { ReactNode } from 'react'
import { ClerkProvider } from '@clerk/nextjs'
import { clerkAppearance } from '@/lib/clerk-appearance'
import './globals.css'
import './store.css'

export const metadata: Metadata = {
  title: 'Foal & Pony - Premium Kids Eyewear',
  description: 'Fun, flexible, and virtually unbreakable frames designed specifically for children. Because every adventure deserves clear vision.',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: ReactNode
}) {
  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY

  const body = <body>{children}</body>

  if (!publishableKey) {
    return <html lang="en">{body}</html>
  }

  return (
    <ClerkProvider publishableKey={publishableKey} appearance={clerkAppearance}>
      <html lang="en">{body}</html>
    </ClerkProvider>
  )
}

