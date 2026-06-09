import { groq } from 'next-sanity'

const PRODUCT_FIELDS = /* groq */ `
  _id,
  name,
  "slug": slug.current,
  tagline,
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
  },
  "lifestyleImages": lifestyleImages,
`

export const ALL_PUBLISHED_PRODUCTS_QUERY = groq`
  *[_type == "product" && published == true]
    | order(order asc, name asc) {
      ${PRODUCT_FIELDS}
    }
`

export const PRODUCTS_BY_AGE_QUERY = groq`
  *[_type == "product" && published == true && ageBand == $age]
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
