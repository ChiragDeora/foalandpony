export const PRODUCT_SHAPES = [
  'round',
  'oval',
  'square',
  'rectangle',
  'panto',
  'wayfarer',
] as const

export type ProductShape = (typeof PRODUCT_SHAPES)[number]

export const SHAPE_LABELS: Record<ProductShape, string> = {
  round: 'Round',
  oval: 'Oval',
  square: 'Square',
  rectangle: 'Rectangle',
  panto: 'Panto',
  wayfarer: 'Wayfarer',
}

export function isProductShape(value: string | undefined): value is ProductShape {
  return !!value && (PRODUCT_SHAPES as readonly string[]).includes(value)
}
