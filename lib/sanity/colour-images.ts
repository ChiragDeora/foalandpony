import { colourFromFilename, normColour } from '@/lib/util/colour'
import type { FoalProduct, LifestyleImage, ProductColour, SanityImageRef } from './types'

/**
 * The photo to show for a given colour: the colour's own `image` if set,
 * otherwise the lifestyle photo whose filename best matches the colour name
 * (e.g. "Luna-Transparent Green.png" for colour "Transparent Green").
 */
export function colourImageFor(product: FoalProduct, colour: ProductColour): SanityImageRef | LifestyleImage | null {
  if (colour.image) return colour.image

  const target = normColour(colour.name)
  if (!target) return null

  let best: LifestyleImage | null = null
  for (const img of product.lifestyleImages ?? []) {
    if (!img.filename) continue
    const imgColour = normColour(colourFromFilename(img.filename, product.name))
    if (!imgColour) continue
    if (imgColour === target) return img
    if (!best && (imgColour.includes(target) || target.includes(imgColour))) best = img
  }

  return best
}
