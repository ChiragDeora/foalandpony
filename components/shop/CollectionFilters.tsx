import Link from 'next/link'
import { PRODUCT_SHAPES, SHAPE_LABELS, type ProductShape } from '@/lib/sanity/shapes'

const filters: { label: string; shape?: ProductShape }[] = [
  { label: 'All frames' },
  ...PRODUCT_SHAPES.map((shape) => ({ label: SHAPE_LABELS[shape], shape })),
]

export function CollectionFilters({ active }: { active?: string }) {
  return (
    <div className="collection-filters">
      {filters.map((f) => (
        <Link
          key={f.shape || 'all'}
          href={f.shape ? `/shop?shape=${encodeURIComponent(f.shape)}` : '/shop'}
          className={`collection-filter${active === f.shape || (!active && !f.shape) ? ' active' : ''}`}
        >
          {f.label}
        </Link>
      ))}
    </div>
  )
}
