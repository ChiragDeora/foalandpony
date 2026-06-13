'use client'

import { useMemo } from 'react'
import Image from 'next/image'
import { urlFor } from '@/lib/sanity/client'
import { colourImageFor } from '@/lib/sanity/colour-images'
import type { FoalProduct, SanityImageRef } from '@/lib/sanity/types'
import { useProductColour } from './ProductColourContext'

export function ProductGallery({ product }: { product: FoalProduct }) {
  const { selected } = useProductColour()

  const options = useMemo(
    () => (product.colours ?? []).map((colour) => ({ colour, image: colourImageFor(product, colour) })),
    [product]
  )

  const fallbackImage: SanityImageRef | null =
    product.colours?.find((c) => c.image)?.image ?? product.lifestyleImages?.[0] ?? null

  const activeOption = options[selected]
  const activeImage = activeOption?.image ?? fallbackImage
  const activeUrl = activeImage ? urlFor(activeImage).width(1100).height(1100).fit('crop').url() : null
  const activeAlt = activeOption ? `${product.name} in ${activeOption.colour.name}` : product.name

  return (
    <div className="product-detail-gallery">
      {activeUrl ? (
        <Image src={activeUrl} alt={activeAlt} fill sizes="(max-width: 1100px) 90vw, 540px" />
      ) : (
        <div className="product-detail-placeholder">No photo yet</div>
      )}
    </div>
  )
}

export default ProductGallery
