import Link from 'next/link'

const filters: { label: string; age?: string }[] = [
  { label: 'All frames' },
  { label: 'Ages 4–7', age: '4-7' },
  { label: 'Ages 8–12', age: '8-12' },
  { label: 'Ages 13+', age: '13+' },
]

export function CollectionFilters({ active }: { active?: string }) {
  return (
    <div className="collection-filters">
      {filters.map((f) => (
        <Link
          key={f.age || 'all'}
          href={f.age ? `/shop?age=${encodeURIComponent(f.age)}` : '/shop'}
          className={`collection-filter${active === f.age || (!active && !f.age) ? ' active' : ''}`}
        >
          {f.label}
        </Link>
      ))}
    </div>
  )
}
