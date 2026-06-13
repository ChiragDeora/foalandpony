'use client'

import { useMemo, useState } from 'react'
import { urlFor } from '@/lib/sanity/client'
import { colourImageFor } from '@/lib/sanity/colour-images'
import type { FoalProduct } from '@/lib/sanity/types'
import { useCart } from '@/lib/cart/cart-context'
import { useProductColour } from './ProductColourContext'

export function AddToCart({ product }: { product: FoalProduct }) {
  const { addItem } = useCart()
  const colours = product.colours ?? []
  const { selected, setSelected } = useProductColour()
  const [added, setAdded] = useState(false)

  const colour = colours[selected]

  const image = useMemo(() => {
    const source =
      (colour && colourImageFor(product, colour)) ??
      product.colours?.find((c) => c.image)?.image ??
      product.lifestyleImages?.[0]
    return source ? urlFor(source).width(640).height(640).fit('crop').url() : null
  }, [colour, product])

  function handleAdd() {
    addItem({
      productId: product._id,
      slug: product.slug,
      name: product.name,
      image,
      price: product.price,
      colourName: colour?.name,
      colourHex: colour?.hex,
    })
    setAdded(true)
    setTimeout(() => setAdded(false), 1800)
  }

  return (
    <div className="add-to-cart">
      {colours.length > 1 && (
        <div className="product-detail-colours">
          <span className="product-detail-section-lbl">
            {colours.length} colours - choose one
          </span>
          <div className="product-detail-swatches">
            {colours.map((c, i) => (
              <button
                key={i}
                type="button"
                className={`product-detail-swatch${i === selected ? ' selected' : ''}`}
                title={c.name}
                onClick={() => setSelected(i)}
              >
                <span className="product-detail-swatch-dot" style={{ background: c.hex }} />
                <span className="product-detail-swatch-name">{c.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      <button type="button" className="btn btn-primary add-to-cart-btn" onClick={handleAdd}>
        {added ? 'Added!' : 'Add to cart'}
      </button>
    </div>
  )
}
