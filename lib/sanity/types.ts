import type { PortableTextBlock } from 'sanity'

// Loose Sanity image source shape, what GROQ returns for image fields.
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
  imageAspect?: number | null
}

export type LifestyleImage = SanityImageRef & {
  filename?: string | null
  aspectRatio?: number | null
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

// --- Homepage (singleton) --------------------------------------------------
export type SmileItem = {
  url: string | null
  caption?: string | null
  subcaption?: string | null
}

export type Homepage = {
  heroImageUrl?: string | null
  heroImageAlt?: string | null
  ourStoryImageUrl?: string | null
  ourStoryImageAlt?: string | null
  weightImageUrl?: string | null
  weightImageAlt?: string | null
  smiles?: SmileItem[] | null
}

// --- Blog ------------------------------------------------------------------
export type BlogCategory = 'durability' | 'kid-tested' | 'parent-tips'

export type BlogPostSummary = {
  _id: string
  title: string
  slug: string
  category: BlogCategory
  excerpt?: string
  readTime?: string
  publishedDate?: string
  featured?: boolean
  coverImageUrl?: string | null
}

export type BlogPost = BlogPostSummary & {
  metaTitle?: string
  metaDescription?: string
  coverImageAlt?: string
  body?: PortableTextBlock[]
}
