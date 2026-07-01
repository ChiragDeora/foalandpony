import type { BlogCategory } from '@/lib/sanity/types'

export const CATEGORY_LABEL: Record<BlogCategory, string> = {
  durability: 'Durability',
  'kid-tested': 'Kid-tested',
  'parent-tips': 'Parent tips',
}

// Mid-saturated so it reads well as chip text, an accent bar, and a dot.
export const CATEGORY_COLOR: Record<BlogCategory, string> = {
  durability: '#E8720C',
  'kid-tested': '#2E9E54',
  'parent-tips': '#2E83BD',
}

export function formatDate(value?: string) {
  if (!value) return ''
  const [y, m, d] = value.split('-').map(Number)
  if (!y || !m || !d) return value
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
  ]
  return `${months[m - 1]} ${d}, ${y}`
}

export function catColor(c?: BlogCategory) {
  return (c && CATEGORY_COLOR[c]) || '#FF8C00'
}
export function catLabel(c?: BlogCategory) {
  return (c && CATEGORY_LABEL[c]) || 'Story'
}
