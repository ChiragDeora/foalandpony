import type { Metadata, Viewport } from 'next'
import type { ReactNode } from 'react'
import { ClerkProvider } from '@clerk/nextjs'
import { clerkAppearance } from '@/lib/clerk-appearance'
import { ThemeProvider } from '@/context/ThemeContext'
import './globals.css'
import './store.css'

export const metadata: Metadata = {
  title: 'Foal & Pony | Kids Eyewear Online India - Branded Kids Eyewear Collections',
  description:
    "Shop kids eyewear frames online in India - virtually unbreakable, lightweight, built for real childhoods. Explore Foal & Pony's branded kids eyewear collections.",
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

const GOOGLE_FONTS =
  'https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700;9..144,800;9..144,900&family=Inter:wght@400;500;600;700;800&family=Caveat:wght@500;600;700&family=Nunito:wght@400;500;600;700;800;900&family=Playfair+Display:ital,wght@0,400;0,600;0,700;0,800;1,400;1,600;1,700&family=Fredoka:wght@400;500;600;700&family=Baloo+2:wght@500;600;700;800&display=swap'

export default function RootLayout({ children }: { children: ReactNode }) {
  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY

  const fontLinks = (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="stylesheet" href={GOOGLE_FONTS} />
    </>
  )

  const body = (
    <body>
      <ThemeProvider>
        {children}
      </ThemeProvider>
    </body>
  )

  if (!publishableKey) {
    return <html lang="en" data-theme="kids"><head>{fontLinks}</head>{body}</html>
  }

  return (
    <ClerkProvider publishableKey={publishableKey} appearance={clerkAppearance}>
      <html lang="en" data-theme="kids"><head>{fontLinks}</head>{body}</html>
    </ClerkProvider>
  )
}
