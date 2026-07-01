import { groq } from 'next-sanity'

const PRODUCT_FIELDS = /* groq */ `
  _id,
  name,
  "slug": slug.current,
  tagline,
  price,
  description,
  ageBand,
  shape,
  sizeCode,
  technology,
  featured,
  order,
  "colours": colours[]{
    name,
    hex,
    "image": image,
    "imageAspect": image.asset->metadata.dimensions.aspectRatio,
  },
  "lifestyleImages": lifestyleImages[]{
    ...,
    "filename": asset->originalFilename,
    "aspectRatio": asset->metadata.dimensions.aspectRatio
  },
`

export const ALL_PUBLISHED_PRODUCTS_QUERY = groq`
  *[_type == "product" && published == true]
    | order(order asc, name asc) {
      ${PRODUCT_FIELDS}
    }
`

export const PRODUCTS_BY_SHAPE_QUERY = groq`
  *[_type == "product" && published == true && shape == $shape]
    | order(order asc, name asc) {
      ${PRODUCT_FIELDS}
    }
`

export const PRODUCT_BY_SLUG_QUERY = groq`
  *[_type == "product" && published == true && slug.current == $slug][0] {
    ${PRODUCT_FIELDS}
  }
`

export const FEATURED_PRODUCTS_QUERY = groq`
  *[_type == "product" && published == true && featured == true]
    | order(order asc) [0...8] {
      ${PRODUCT_FIELDS}
    }
`

// ---------------------------------------------------------------------------
// Homepage (singleton) - resolves every image to a plain CDN url so the
// homepage can drop it straight into <Image src>, falling back to the shipped
// asset when a field is empty.
// ---------------------------------------------------------------------------
// Sanity's image CDN resizes + serves modern formats (WebP/AVIF) on the fly via
// query params. Requesting a sized, auto-format URL instead of the multi-MB raw
// original is the difference between a ~25 KB image and a ~7 MB one.
export const HOMEPAGE_QUERY = groq`
  *[_type == "homepage"][0] {
    "heroImageUrl": heroImage.asset->url + "?auto=format&fit=max&w=1200&q=75",
    heroImageAlt,
    "ourStoryImageUrl": ourStoryImage.asset->url + "?auto=format&fit=max&w=1100&q=75",
    ourStoryImageAlt,
    "weightImageUrl": weightImage.asset->url + "?auto=format&fit=max&w=1200&q=75",
    weightImageAlt,
    "smiles": smiles[]{
      "url": image.asset->url + "?auto=format&fit=max&w=640&q=75",
      caption,
      subcaption,
    },
  }
`

// ---------------------------------------------------------------------------
// Blog
// ---------------------------------------------------------------------------
const BLOG_CARD_FIELDS = /* groq */ `
  _id,
  title,
  "slug": slug.current,
  category,
  excerpt,
  readTime,
  publishedDate,
  featured,
  "coverImageUrl": coverImage.asset->url + "?auto=format&fit=max&w=1400&q=75",
`

export const ALL_BLOG_POSTS_QUERY = groq`
  *[_type == "blogPost" && published == true]
    | order(publishedDate desc, _createdAt desc) {
      ${BLOG_CARD_FIELDS}
    }
`

export const BLOG_POST_BY_SLUG_QUERY = groq`
  *[_type == "blogPost" && published == true && slug.current == $slug][0] {
    ${BLOG_CARD_FIELDS}
    metaTitle,
    metaDescription,
    "coverImageAlt": coverImage.alt,
    body,
  }
`

export const BLOG_SLUGS_QUERY = groq`
  *[_type == "blogPost" && published == true && defined(slug.current)].slug.current
`
