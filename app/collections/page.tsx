import { listAllProducts } from '@/lib/sanity/products'
import { urlFor } from '@/lib/sanity/client'
import { PRODUCT_SHAPES, SHAPE_LABELS, type ProductShape } from '@/lib/sanity/shapes'
import { CollectionsView, type ShapeGroup } from '@/components/shop/CollectionsView'

const SHAPE_META: Record<ProductShape, { blurb: string; bg: string; accent: string; swatches: string[] }> = {
  round: {
    blurb: 'Soft, friendly curves that suit narrower faces and add a playful, classic look.',
    bg: '#FCE9D2',
    accent: '#B96E00',
    swatches: ['#E89B5C', '#F7C56B', '#D2766E', '#7BABE0'],
  },
  oval: {
    blurb: 'Balanced proportions that complement most face shapes — a dependable everyday pick.',
    bg: '#DCEEFB',
    accent: '#2E83BD',
    swatches: ['#2E83BD', '#1F3A5C', '#6DBE7A', '#E89B5C'],
  },
  square: {
    blurb: 'Bold, structured lines that add definition to softer, rounder faces.',
    bg: '#E7E0F4',
    accent: '#7245A0',
    swatches: ['#1F3A5C', '#7245A0', '#D2766E', '#3F8B4D'],
  },
  rectangle: {
    blurb: 'Wide, elongated frames that suit smaller or rounder faces beautifully.',
    bg: '#E0F4E9',
    accent: '#3F8B4D',
    swatches: ['#3F8B4D', '#6DBE7A', '#1F3A5C', '#E89B5C'],
  },
  panto: {
    blurb: 'A vintage-inspired silhouette with a gently rounded top — playful and timeless.',
    bg: '#FBE3E6',
    accent: '#C1485A',
    swatches: ['#C1485A', '#D2766E', '#F7C56B', '#7BABE0'],
  },
  wayfarer: {
    blurb: 'The classic trapezoid shape — confident, durable, and never out of style.',
    bg: '#FFF3D6',
    accent: '#D98E04',
    swatches: ['#D98E04', '#1F3A5C', '#E89B5C', '#3F8B4D'],
  },
}

export default async function CollectionsPage() {
  const products = await listAllProducts()

  const groups: ShapeGroup[] = PRODUCT_SHAPES.map((shape) => {
    const inShape = products.filter((p) => p.shape === shape)
    if (inShape.length === 0) return null

    const withImage = inShape.find((p) => p.colours?.find((c) => c.image)) ?? inShape[0]
    const colourImage = withImage.colours?.find((c) => c.image)?.image
    const image = colourImage
      ? urlFor(colourImage).width(640).height(640).fit('crop').url()
      : withImage.lifestyleImages?.[0]
        ? urlFor(withImage.lifestyleImages[0]).width(640).height(640).fit('crop').url()
        : null

    const meta = SHAPE_META[shape]

    return {
      key: shape,
      label: SHAPE_LABELS[shape],
      href: `/shop?shape=${shape}`,
      models: inShape.map((p) => p.name.toUpperCase()),
      image,
      ...meta,
    }
  }).filter((g): g is ShapeGroup => g !== null)

  return <CollectionsView groups={groups} />
}
