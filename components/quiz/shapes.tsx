/**
 * Shape Spotter glyphs - 5 original, on-brand filled silhouettes used by the
 * vision-screening game. High contrast, simple, no fine detail, and distinct
 * from each other at small sizes.
 *
 * Deliberately NOT "LEA Symbols" (a trademarked clinical set) - these are an
 * original shape set: star, heart, horseshoe, apple, moon.
 */

export type ShapeName = 'star' | 'heart' | 'horseshoe' | 'apple' | 'moon'

export const SHAPE_NAMES: ShapeName[] = ['star', 'heart', 'horseshoe', 'apple', 'moon']

export function ShapeGlyph({
  name,
  sizeVh,
  color = '#16233D',
}: {
  name: ShapeName
  /** Rendered height as a percentage of the viewport height (per the level spec). */
  sizeVh: number
  color?: string
}) {
  const dim = `${sizeVh}vh`
  const common = {
    width: dim,
    height: dim,
    viewBox: '0 0 100 100',
    role: 'img' as const,
    'aria-label': `shape`,
  }

  switch (name) {
    case 'star':
      return (
        <svg {...common}>
          <path
            fill={color}
            d="M50 4 L61.8 37.6 L97 38.2 L68.7 59 L79.2 93 L50 72.4 L20.8 93 L31.3 59 L3 38.2 L38.2 37.6 Z"
          />
        </svg>
      )
    case 'heart':
      return (
        <svg {...common}>
          <path
            fill={color}
            d="M50 88 C 6 58 8 26 30 20 C 42 17 50 26 50 34 C 50 26 58 17 70 20 C 92 26 94 58 50 88 Z"
          />
        </svg>
      )
    case 'horseshoe':
      // Open-bottom U, drawn as a thick stroked arc with round feet.
      return (
        <svg {...common}>
          <path
            fill="none"
            stroke={color}
            strokeWidth={19}
            strokeLinecap="round"
            d="M26 84 A 32 36 0 1 1 74 84"
          />
        </svg>
      )
    case 'apple':
      return (
        <svg {...common}>
          <path
            fill={color}
            d="M50 32 C 43 21 28 21 24 34 C 15 35 10 46 15 62 C 20 80 35 92 50 92 C 65 92 80 80 85 62 C 90 46 85 35 76 34 C 72 21 57 21 50 32 Z"
          />
          <path fill={color} d="M50 30 C 51 20 57 14 64 13 C 63 22 58 29 50 30 Z" />
        </svg>
      )
    case 'moon':
      return (
        <svg {...common}>
          <path
            fill={color}
            d="M58 8 a 42 42 0 1 0 0 84 a 33 33 0 1 1 0 -84 z"
          />
        </svg>
      )
  }
}
