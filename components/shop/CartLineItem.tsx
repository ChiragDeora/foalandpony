import Image from 'next/image'
import type { CartItem } from '@/lib/cart/cart-context'
import { formatInr } from '@/lib/util/money'

export function CartLineItem({
  item,
  onUpdateQuantity,
  onRemove,
}: {
  item: CartItem
  onUpdateQuantity: (quantity: number) => void
  onRemove: () => void
}) {
  return (
    <li className="cart-line">
      <div className="cart-line-image">
        {item.image ? (
          <Image src={item.image} alt={item.name} fill sizes="100px" />
        ) : (
          <span>👓</span>
        )}
      </div>
      <div className="cart-line-info">
        <h3>{item.name}</h3>
        {item.colourName && (
          <p className="cart-line-variant">
            {item.colourHex && (
              <span className="cart-line-swatch" style={{ background: item.colourHex }} />
            )}
            {item.colourName}
          </p>
        )}
        <p className="cart-line-price">{formatInr(item.price)}</p>
      </div>
      <div className="cart-line-actions">
        <label>
          Qty
          <input
            type="number"
            min={1}
            value={item.quantity}
            onChange={(e) => {
              const qty = parseInt(e.target.value, 10)
              if (qty > 0) onUpdateQuantity(qty)
            }}
          />
        </label>
        <button type="button" className="shop-btn shop-btn-ghost" onClick={onRemove}>
          Remove
        </button>
      </div>
    </li>
  )
}
