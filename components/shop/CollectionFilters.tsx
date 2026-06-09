import Link from 'next/link'
import { COLLECTION_HANDLES } from '@/lib/constants'

const filters = [
  { label: 'All frames', handle: '' },
  { label: 'Ages 4–7', handle: COLLECTION_HANDLES.adventure },
  { label: 'Ages 8–12', handle: COLLECTION_HANDLES.explorer },
  { label: 'Ages 13+', handle: COLLECTION_HANDLES.champion },
]

export function CollectionFilters({ active }: { active?: string }) {
  return (
    <div className="collection-filters">
      {filters.map((f) => (
        <Link
          key={f.handle || 'all'}
          href={f.handle ? `/shop?collection=${f.handle}` : '/shop'}
          className={`collection-filter${active === f.handle ? ' active' : ''}`}
        >
          {f.label}
        </Link>
      ))}
    </div>
  )
}
