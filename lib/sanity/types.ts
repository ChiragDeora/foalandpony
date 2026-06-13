import type { PortableTextBlock } from 'sanity'

// Loose Sanity image source shape — what GROQ returns for image fields.
export type SanityImageRef = {
  _type?: string
  asset?: { _ref?: string; _type?: string }
  hotspot?: unknown
  crop?: unknown
}

export type AgeBand = '4-7' | '8-12' | '13+'

export type ProductColour = {
  name: string
  hex: string
  image?: SanityImageRef | null
}

export type LifestyleImage = SanityImageRef & {
  filename?: string | null
}

export type FoalProduct = {
  _id: string
  name: string
  slug: string
  tagline?: string
  price: number
  description?: PortableTextBlock[]
  ageBand: AgeBand
  shape?: string
  sizeCode?: string
  technology?: 'nose-pad' | 'soft-flex' | 'medium-flex' | 'polarised-clip-on'
  featured?: boolean
  order?: number
  colours?: ProductColour[]
  lifestyleImages?: LifestyleImage[]
}
