import type { CSSProperties } from 'react'

/* Shared kids decorations - balloons, stars, sparkles, confetti.
   Reuses the existing .kids-decor / .kd-* animation classes from globals.css.
   Drop <SectionDecor /> as the first child of a section that has the
   `has-decor` class so it sits behind the content. */

function Star({ fill, size, style }: { fill: string; size: number; style?: CSSProperties }) {
  return (
    <div className="kd kd-twinkle" style={style} aria-hidden>
      <svg width={size} height={size} viewBox="0 0 24 24" fill={fill}>
        <path d="M12 2l2.5 6.4L21 9l-5 4.2L17.6 20 12 16.3 6.4 20 8 13.2 3 9l6.5-.6z" />
      </svg>
    </div>
  )
}

function Sparkle({ fill, size, style }: { fill: string; size: number; style?: CSSProperties }) {
  return (
    <div className="kd kd-spin" style={style} aria-hidden>
      <svg width={size} height={size} viewBox="0 0 24 24" fill={fill}>
        <path d="M12 0c1.1 5.6 5.3 9.8 12 12-6.7 2.2-10.9 6.4-12 12-1.1-5.6-5.3-9.8-12-12 6.7-2.2 10.9-6.4 12-12z" />
      </svg>
    </div>
  )
}

function Balloon({ color, size, style }: { color: string; size: number; style?: CSSProperties }) {
  return (
    <div className="kd kd-balloon" style={style} aria-hidden>
      <svg width={size} height={size * 1.5} viewBox="0 0 40 60" fill="none">
        <ellipse cx="20" cy="20" rx="17" ry="20" fill={color} />
        <ellipse cx="14" cy="13" rx="5" ry="7" fill="rgba(255,255,255,.35)" />
        <path d="M20 40 l-3 4 6 0 z" fill={color} />
        <path d="M20 44 q4 8 -1 16" stroke="rgba(31,58,92,.35)" strokeWidth="1.5" fill="none" />
      </svg>
    </div>
  )
}

function Dot({ color, size, style }: { color: string; size: number; style?: CSSProperties }) {
  return (
    <span
      className="kd kd-twinkle-slow"
      style={{ width: size, height: size, borderRadius: '50%', background: color, ...style }}
      aria-hidden
    />
  )
}

/* A light, edge-hugging decoration set. `variant` mirrors + reshuffles the
   placement so repeated sections down the page don't look identical. */
export function SectionDecor({ variant = 0 }: { variant?: number }) {
  const flip = variant % 2 === 1
  const L = flip ? 'right' : 'left'
  const R = flip ? 'left' : 'right'
  const lift = variant % 3 === 2

  return (
    <div className="kids-decor section-decor" aria-hidden>
      <Balloon color="#57C84D" size={32} style={{ top: '10%', [L]: '4%' }} />
      <Balloon color="#A368E8" size={26} style={{ bottom: '16%', [R]: '5%', animationDelay: '-2.5s' }} />
      <Star fill="#FFC23C" size={26} style={{ top: lift ? '14%' : '24%', [R]: '9%' }} />
      <Star fill="#FF6FB5" size={22} style={{ bottom: '20%', [L]: '8%', animationDelay: '.8s' }} />
      <Sparkle fill="#3FA9F5" size={24} style={{ top: '52%', [R]: '4%' }} />
      <Sparkle fill="#FF5A5A" size={20} style={{ bottom: '8%', [L]: '34%', animationDuration: '22s' }} />
      <Dot color="#FFC23C" size={13} style={{ top: '30%', [L]: '3%' }} />
      <Dot color="#3FA9F5" size={14} style={{ bottom: '12%', [R]: '24%', animationDelay: '1s' }} />
      <Dot color="#2EC6C6" size={12} style={{ top: '64%', [L]: '14%', animationDelay: '.4s' }} />
    </div>
  )
}
