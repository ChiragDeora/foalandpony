import Image from 'next/image'
import Link from 'next/link'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { SectionDecor } from '@/components/Decor'
import { getHomepage } from '@/lib/sanity/homepage'
import { isSanityImage } from '@/lib/image'


/* Inline icon set, quirky outline strokes, drawn here so we don't ship a UI lib */
function Icon({ name, size = 22 }: { name: string; size?: number }) {
  const s = size
  const stroke = 'currentColor'
  const common = {
    width: s,
    height: s,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke,
    strokeWidth: 2,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  }
  switch (name) {
    case 'hinge':
      return (
        <svg {...common}>
          <path d="M3 12c4-5 14-5 18 0" />
          <circle cx="3" cy="12" r="1.6" />
          <circle cx="21" cy="12" r="1.6" />
          <path d="M8 9l-1 6M16 9l1 6" />
        </svg>
      )
    case 'feather':
      return (
        <svg {...common}>
          <path d="M20 4c-6 0-12 6-12 12v4h4c6 0 12-6 12-12V4z" />
          <path d="M4 20l8-8" />
          <path d="M14 8l-4 4" />
        </svg>
      )
    case 'shield':
      return (
        <svg {...common}>
          <path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z" />
          <path d="M9 12l2 2 4-4" />
        </svg>
      )
    case 'smile':
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
          <path d="M8 14c1.5 2 6.5 2 8 0" />
          <circle cx="9" cy="10" r=".8" fill={stroke} />
          <circle cx="15" cy="10" r=".8" fill={stroke} />
        </svg>
      )
    case 'drop':
      return (
        <svg {...common}>
          <path d="M12 3l1 4 4 1-4 1-1 4-1-4-4-1 4-1z" />
          <path d="M5 19l3 2M19 19l-3 2M12 21v-3" />
        </svg>
      )
    case 'refresh':
      return (
        <svg {...common}>
          <path d="M3 12a9 9 0 0114-7l3 2" />
          <path d="M21 4v4h-4" />
          <path d="M21 12a9 9 0 01-14 7l-3-2" />
          <path d="M3 20v-4h4" />
        </svg>
      )
    case 'weight':
      return (
        <svg {...common}>
          <path d="M6 7h12l-1 12H7z" />
          <path d="M9 7a3 3 0 016 0" />
        </svg>
      )
    case 'badge':
      return (
        <svg {...common}>
          <circle cx="12" cy="10" r="6" />
          <path d="M9 14l-2 7 5-3 5 3-2-7" />
        </svg>
      )
    case 'ruler':
      return (
        <svg {...common}>
          <path d="M3 9l6-6 12 12-6 6z" />
          <path d="M7 9l2 2M10 6l2 2M13 9l2 2M16 6l2 2" />
        </svg>
      )
    case 'sun':
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M4.9 19.1L7 17M17 7l2.1-2.1" />
        </svg>
      )
    case 'splash':
      return (
        <svg {...common}>
          <path d="M5 12c2 0 3-2 3-2s1 2 3 2 3-2 3-2 1 2 3 2 3-2 3-2" />
          <path d="M5 17c2 0 3-2 3-2s1 2 3 2 3-2 3-2 1 2 3 2 3-2 3-2" />
          <path d="M5 7c2 0 3-2 3-2s1 2 3 2 3-2 3-2 1 2 3 2 3-2 3-2" />
        </svg>
      )
    case 'calendar':
      return (
        <svg {...common}>
          <rect x="3" y="5" width="18" height="16" rx="2" />
          <path d="M3 10h18M8 3v4M16 3v4" />
          <path d="M8 15l2 2 4-4" />
        </svg>
      )
    case 'cart':
      return (
        <svg {...common}>
          <circle cx="9" cy="20" r="1.5" />
          <circle cx="17" cy="20" r="1.5" />
          <path d="M3 4h2l2.4 11.5a2 2 0 002 1.5h7.6a2 2 0 002-1.6L20 8H6" />
        </svg>
      )
    case 'arrow':
      return (
        <svg {...common}>
          <path d="M5 12h14M13 6l6 6-6 6" />
        </svg>
      )
    case 'instagram':
      return (
        <svg {...common}>
          <rect x="3" y="3" width="18" height="18" rx="5" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="17.5" cy="6.5" r=".8" fill={stroke} />
        </svg>
      )
    case 'whatsapp':
      return (
        <svg {...common}>
          <path d="M21 12a9 9 0 11-17.5-3L3 21l5.4-1.4A9 9 0 0021 12z" />
          <path d="M9 10c.5 2 1.8 3.7 4 4.5l1.6-1.3 2.6.9c.2 1.6-1.5 2.4-3 2.1A8 8 0 017 11c-.3-1.5.5-3.1 2-3l.9 2.5z" />
        </svg>
      )
    case 'mail':
      return (
        <svg {...common}>
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <path d="M3 7l9 6 9-6" />
        </svg>
      )
    case 'glasses':
      return (
        <svg {...common}>
          <circle cx="6" cy="13" r="3.6" />
          <circle cx="18" cy="13" r="3.6" />
          <path d="M9.5 12.4c1.3-1 3.7-1 5 0" />
          <path d="M2.6 12l-1.1-1.6M21.4 12l1.1-1.6" />
        </svg>
      )
    case 'bluelight':
      /* screen-protecting glasses: round specs with little light rays */
      return (
        <svg {...common}>
          <circle cx="6.5" cy="14.5" r="3.4" />
          <circle cx="17.5" cy="14.5" r="3.4" />
          <path d="M10 13.8c1-.9 3-.9 4 0" />
          <path d="M3.1 13.6l-1.6-1.1M20.9 13.6l1.6-1.1" />
          <path d="M12 3v2.4M8.3 4.4l1 1.7M15.7 4.4l-1 1.7" />
        </svg>
      )
    case 'sunsafe':
      /* sunglasses with a little sun */
      return (
        <svg {...common}>
          <path d="M3 13h7v1.4a3.5 3.5 0 0 1-7 0z" />
          <path d="M14 13h7v1.4a3.5 3.5 0 0 1-7 0z" />
          <path d="M10 13.4c1-.8 3-.8 4 0" />
          <path d="M12 3.2v2.2M6.4 5.2l1.1 1.3M17.6 5.2l-1.1 1.3" />
        </svg>
      )
    case 'eyecheck':
      /* eye exam: an eye with a checkmark */
      return (
        <svg {...common}>
          <path d="M2 11.5s3.6-5.4 9-5.4 9 5.4 9 5.4" />
          <circle cx="11" cy="11.4" r="2.7" />
          <path d="M14.6 18.4l2 2 4-4.4" />
        </svg>
      )
    case 'controller':
      return (
        <svg {...common}>
          <path d="M7 8.5h10a4.2 4.2 0 0 1 4 4.4 3 3 0 0 1-5.4 1.8l-.5-.7H8.9l-.5.7A3 3 0 0 1 3 12.9a4.2 4.2 0 0 1 4-4.4z" />
          <path d="M7 11.5v2.4M5.8 12.7h2.4" />
          <circle cx="16.2" cy="12" r=".9" fill={stroke} />
          <circle cx="18" cy="13.6" r=".9" fill={stroke} />
        </svg>
      )
    default:
      return null
  }
}

/* Glasses silhouettes, one per frame shape, revealed when a collection gem is hovered */
function Specs({ shape, color }: { shape: string; color: string }) {
  const common = {
    width: 54,
    height: 30,
    viewBox: '0 0 80 44',
    fill: 'none',
    stroke: color,
    strokeWidth: 4,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  }
  const bridge = <path d="M33 20c2-3 12-3 14 0" />
  const arms = (
    <>
      <path d="M6 18 0 14" />
      <path d="M74 18 80 14" />
    </>
  )
  switch (shape) {
    case 'round':
      return <svg {...common}><circle cx="19" cy="22" r="13" /><circle cx="61" cy="22" r="13" />{bridge}{arms}</svg>
    case 'oval':
      return <svg {...common}><ellipse cx="19" cy="22" rx="14" ry="11" /><ellipse cx="61" cy="22" rx="14" ry="11" />{bridge}{arms}</svg>
    case 'square':
      return <svg {...common}><rect x="6" y="11" width="26" height="22" rx="4" /><rect x="48" y="11" width="26" height="22" rx="4" />{bridge}{arms}</svg>
    case 'rectangle':
      return <svg {...common}><rect x="3" y="13" width="30" height="18" rx="4" /><rect x="47" y="13" width="30" height="18" rx="4" />{bridge}{arms}</svg>
    case 'panto':
      return <svg {...common}><path d="M6 16c0-3 26-3 26 0 0 12-4 18-13 18S6 28 6 16z" /><path d="M48 16c0-3 26-3 26 0 0 12-4 18-13 18s-13-6-13-18z" />{bridge}{arms}</svg>
    case 'wayfarer':
      return <svg {...common}><path d="M5 13h28l-3 18c-.5 3-21.5 3-22 0z" /><path d="M47 13h28l-3 18c-.5 3-21.5 3-22 0z" />{bridge}{arms}</svg>
    default:
      return null
  }
}

const features = [
  { num: '01', title: 'Bends, never breaks', body: 'Spring-back temples flex past 90° and snap right back. Goodbye snapped arms and emergency optician runs.' },
  { num: '02', title: 'Practically weightless', body: 'Around 12 grams of TR-90 construction. So light, kids forget they have them on, which means they actually keep them on.' },
  { num: '03', title: 'Eyes well looked-after', body: 'UV-blocking lens compatibility plus polarised clip-ons for sunny days. Growing eyes, properly shielded.' },
  { num: '04', title: 'Fits little faces', body: 'Built from the ground up for child proportions. Soft-grip nose pads stay put through every cartwheel, scoot and slide.' },
]

/* Pulled from the old "we test them the way your kid will" data, condensed into a strip */
const strip = [
  { ic: 'drop', title: 'Drop-proof', sub: '2 m onto concrete, 50× over' },
  { ic: 'refresh', title: "Bend, don't break", sub: '10,000 hinge cycles to 180°' },
  { ic: 'weight', title: 'Feather-light', sub: '12 g of flexible TR-90' },
  { ic: 'badge', title: 'Built to outlast', sub: 'one frame, one school year, probably more' },
]

/* Choose your collection - frame ranges by name, each in a wordmark colour */
const collections = [
  { name: 'Luna', tag: 'Round & sweet', color: '#E8392B', shape: 'round' },
  { name: 'Archer', tag: 'Bold & ready', color: '#2D8FD5', shape: 'square' },
  { name: 'Fable', tag: 'Storybook cool', color: '#8A4FC4', shape: 'oval' },
  { name: 'Willow', tag: 'Easy breezy', color: '#57B33B', shape: 'rectangle' },
  { name: 'Scout', tag: 'Little explorer', color: '#E5439A', shape: 'panto' },
  { name: 'Pixie', tag: 'Bright spark', color: '#F5871F', shape: 'wayfarer' },
]

/* Kids eye care - friendly, jargon-free help */
const careCards = [
  { ic: 'smile', color: '#E6F6EC', accent: '#3F8B4D', title: 'Built for small faces', body: 'Soft-grip nose pads and narrower frames, sized for kids from age 3 up - not shrunk down from adult styles.' },
  { ic: 'shield', color: '#E4F0FB', accent: '#2E83BD', title: 'Built to standard', body: 'Impact-tested and certified to children’s safety standards - not just tough by design, tough by testing.' },
  { ic: 'hinge', color: '#FFEFD2', accent: '#B96E00', title: 'Bends, doesn’t break', body: 'Hinges flex past 90° and spring back - no snapped arms, no emergency replacements.' },
]

/* Smiles strip - real-kid photos with playful captions.
   Used as the fallback when the CMS "Smiles gallery" is empty. */
const SMILES_FALLBACK = [
  { src: '/assets/photos/portrait-tiny.png', cap: 'Aanya, age 5', sub: 'Luna · Sky' },
  { src: '/assets/photos/kid-jumping-clean.png', cap: 'Misha, age 6', sub: 'Archer · Cobalt' },
  { src: '/assets/photos/portrait-mid.png', cap: 'Meher, age 8', sub: 'Fable · Navy' },
  { src: '/assets/photos/duo-tiny.png', cap: 'Riya & Aarav, age 6', sub: 'Willow · Sky' },
  { src: '/assets/photos/portrait-teen.png', cap: 'Kabir & Kiara, age 11', sub: 'Scout · Amber' },
  { src: '/assets/photos/kids-garden.png', cap: 'The Garden Gang', sub: 'Pixie · Forest' },
]

/* Illustrative sample quotes - NOT verified customer reviews. The visible
   "Illustrative examples…" label in the section must stay. Replace this whole
   set once 5-10 real reviews exist; do not mix real and sample reviews. */
const testimonials = [
  {
    body: 'Six months in and still no snapped hinges - that was the deciding factor for us.',
    name: 'Early feedback',
    meta: 'mum of two',
  },
  {
    body: "He picked his own pair and hasn't tried to take them off since.",
    name: 'Early feedback',
    meta: 'dad of one',
  },
  {
    body: 'Look properly designer, survive properly rough handling.',
    name: 'Early feedback',
    meta: 'mum of one',
  },
]

/* ─── Kids floating decorations: clouds, stars, sparkles, confetti ─── */
function Star({ fill, size }: { fill: string; size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} aria-hidden>
      <path d="M12 2l2.5 6.4L21 9l-5 4.2L17.6 20 12 16.3 6.4 20 8 13.2 3 9l6.5-.6z" />
    </svg>
  )
}
function Sparkle({ fill, size }: { fill: string; size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} aria-hidden>
      <path d="M12 0c1.1 5.6 5.3 9.8 12 12-6.7 2.2-10.9 6.4-12 12-1.1-5.6-5.3-9.8-12-12 6.7-2.2 10.9-6.4 12-12z" />
    </svg>
  )
}
function Balloon({ color, size, style }: { color: string; size: number; style?: React.CSSProperties }) {
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
function KidsDecor() {
  return (
    <div className="kids-decor" aria-hidden>
      {/* clouds drifting across the top, above the kids' heads */}
      <div className="kd kd-cloud kd-drift" style={{ width: 156, height: 56, top: '5%', left: '5%' }} />
      <div className="kd kd-cloud kd-drift" style={{ width: 116, height: 42, top: '3%', left: '38%', animationDelay: '-4s', animationDuration: '20s' }} />
      <div className="kd kd-cloud kd-drift" style={{ width: 138, height: 50, top: '9%', right: '22%', animationDelay: '-8s' }} />
      <div className="kd kd-cloud kd-drift" style={{ width: 96, height: 36, top: '4%', right: '4%', animationDelay: '-12s', animationDuration: '22s' }} />
      {/* twinkling stars, spread across top strip + right side, clear of the text block */}
      <div className="kd kd-twinkle" style={{ top: '13%', left: '10%' }}><Star fill="#FFC23C" size={48} /></div>
      <div className="kd kd-twinkle" style={{ top: '9%', left: '30%' }}><Star fill="#3FA9F5" size={28} /></div>
      <div className="kd kd-twinkle" style={{ top: '18%', right: '30%', animationDelay: '.6s' }}><Star fill="#FF6FB5" size={38} /></div>
      <div className="kd kd-twinkle" style={{ bottom: '18%', right: '24%', animationDelay: '1s' }}><Star fill="#57C84D" size={32} /></div>
      <div className="kd kd-twinkle" style={{ top: '38%', right: '40%', animationDelay: '1.8s' }}><Star fill="#A368E8" size={26} /></div>
      <div className="kd kd-twinkle" style={{ top: '52%', right: '7%', animationDelay: '1.4s' }}><Star fill="#FF5A5A" size={34} /></div>
      {/* spinning sparkles */}
      <div className="kd kd-spin" style={{ top: '8%', left: '20%' }}><Sparkle fill="#A368E8" size={34} /></div>
      <div className="kd kd-spin" style={{ top: '24%', right: '18%' }}><Sparkle fill="#3FA9F5" size={42} /></div>
      <div className="kd kd-spin" style={{ bottom: '14%', right: '34%', animationDuration: '24s' }}><Sparkle fill="#FFC23C" size={28} /></div>
      {/* balloons bobbing up and down */}
      <Balloon color="#57C84D" size={44} style={{ top: '13%', left: '6%' }} />
      <Balloon color="#FF5A5A" size={52} style={{ top: '12%', right: '10%' }} />
      <Balloon color="#A368E8" size={38} style={{ top: '34%', right: '44%', animationDelay: '-3.5s' }} />
      {/* confetti dots twinkling slowly */}
      <span className="kd kd-twinkle-slow" style={{ width: 16, height: 16, borderRadius: '50%', background: '#FFC23C', top: '7%', left: '24%' }} />
      <span className="kd kd-twinkle-slow" style={{ width: 17, height: 17, borderRadius: '50%', background: '#2EC6C6', top: '26%', right: '16%', animationDelay: '.6s' }} />
      <span className="kd kd-twinkle-slow" style={{ width: 14, height: 14, borderRadius: '50%', background: '#FF5A5A', bottom: '30%', right: '7%', animationDelay: '1.6s' }} />
      <span className="kd kd-twinkle-slow" style={{ width: 16, height: 16, borderRadius: '50%', background: '#57C84D', top: '54%', right: '36%', animationDelay: '2.1s' }} />
      <span className="kd kd-twinkle-slow" style={{ width: 18, height: 18, borderRadius: '50%', background: '#3FA9F5', bottom: '42%', right: '20%', animationDelay: '.3s' }} />
      <span className="kd kd-twinkle-slow" style={{ width: 15, height: 15, borderRadius: '50%', background: '#A368E8', top: '20%', right: '46%', animationDelay: '1s' }} />
      {/* left of the text (far-left margin) */}
      <div className="kd kd-twinkle" style={{ top: '42%', left: '2%' }}><Star fill="#57C84D" size={30} /></div>
      <div className="kd kd-spin" style={{ top: '62%', left: '3%', animationDuration: '20s' }}><Sparkle fill="#A368E8" size={26} /></div>
      <span className="kd kd-twinkle-slow" style={{ width: 14, height: 14, borderRadius: '50%', background: '#FF6FB5', top: '54%', left: '2%' }} />
      {/* below the text */}
      <div className="kd kd-twinkle" style={{ bottom: '6%', left: '13%' }}><Star fill="#FFC23C" size={28} /></div>
      <span className="kd kd-twinkle-slow" style={{ width: 16, height: 16, borderRadius: '50%', background: '#3FA9F5', bottom: '9%', left: '30%', animationDelay: '1s' }} />
      <div className="kd kd-spin" style={{ bottom: '5%', left: '40%', animationDuration: '22s' }}><Sparkle fill="#FF5A5A" size={24} /></div>
    </div>
  )
}
/* ─── Lighter decoration set for lower sections (different from the hero) ─── */
function FinaleDecor() {
  return (
    <div className="kids-decor" aria-hidden style={{ zIndex: 1 }}>
      <div className="kd kd-cloud kd-drift" style={{ width: 124, height: 46, top: '10%', left: '7%' }} />
      <div className="kd kd-cloud kd-drift" style={{ width: 92, height: 34, top: '16%', right: '9%', animationDelay: '-6s', animationDuration: '20s' }} />
      <div className="kd kd-twinkle" style={{ top: '22%', left: '22%' }}><Star fill="#FFC23C" size={30} /></div>
      <div className="kd kd-twinkle" style={{ bottom: '26%', right: '18%', animationDelay: '1s' }}><Star fill="#FF6FB5" size={26} /></div>
      <div className="kd kd-spin" style={{ top: '30%', right: '26%' }}><Sparkle fill="#3FA9F5" size={28} /></div>
      <Balloon color="#57C84D" size={42} style={{ bottom: '6%', left: '6%' }} />
      <Balloon color="#A368E8" size={34} style={{ top: '14%', right: '34%', animationDelay: '-2.5s' }} />
    </div>
  )
}
/* ─── Kids wavy section divider ─── */
function KidsWave({ color = '#FF8C00', flip = false }: { color?: string; flip?: boolean }) {
  return (
    <div className="kids-wave" style={flip ? { transform: 'scaleY(-1)' } : undefined} aria-hidden>
      <svg viewBox="0 0 1200 48" preserveAspectRatio="none">
        <path d="M0,30 C120,8 240,8 360,26 C480,44 600,44 720,26 C840,8 960,8 1080,26 C1140,35 1170,36 1200,30 L1200,48 L0,48 Z" fill={color} />
      </svg>
    </div>
  )
}

export default async function Home() {
  // Images the company manages in the Studio "Homepage" section. Each falls
  // back to the photo shipped in /public when the CMS field is left empty.
  const homepage = await getHomepage()

  const heroImage = homepage?.heroImageUrl || '/assets/photos/hero-duo.png'
  const heroImageAlt = homepage?.heroImageAlt || 'Two kids smiling in Foal & Pony glasses'
  const ourStoryImage = homepage?.ourStoryImageUrl || '/assets/our-story.png'
  const ourStoryImageAlt = homepage?.ourStoryImageAlt || 'Foal & Pony, behind the scenes'
  const weightImage = homepage?.weightImageUrl || '/assets/photos/scale-12g.png'
  const weightImageAlt =
    homepage?.weightImageAlt ||
    'Foal & Pony ultra-light child frames on a scale showing 12 grams'

  const cmsSmiles = (homepage?.smiles ?? []).filter((s) => s.url)
  const smiles = cmsSmiles.length
    ? cmsSmiles.map((s) => ({
        src: s.url as string,
        cap: s.caption ?? '',
        sub: s.subcaption ?? '',
      }))
    : SMILES_FALLBACK

  return (
    <div>
      {/* ============ NAV ============ */}
      <Navbar />

      {/* ============ HERO ============ */}
      <header className="hero">
        <div className="hero-orb-1" aria-hidden />
        <div className="hero-orb-2" aria-hidden />
        <KidsDecor />
        <div className="container hero-grid">
          <div className="hero-copy">
            <h1>
              Glasses that <span className="squiggle">survive</span> being a kid.
            </h1>
            <p className="lede">
              Bends through playgrounds, soccer goals, and the occasional faceplant -
              virtually unbreakable kids eyewear, light enough that kids forget
              they&apos;re wearing it.
            </p>
            <div className="hero-ctas">
              <Link href="/collections" className="btn btn-primary">
                See the collection <span className="btn-arrow"><Icon name="arrow" size={18} /></span>
              </Link>
              <Link href="/vision-quiz" className="btn btn-ghost">
                <span className="btn-arrow"><Icon name="glasses" size={18} /></span> Take the vision quiz
              </Link>
            </div>
          </div>

          <div className="hero-visual hero-visual-cutout">
            <Image
              src={heroImage}
              alt={heroImageAlt}
              fill
              priority
              unoptimized={isSanityImage(heroImage)}
              className="hero-photo hero-photo-cutout"
              sizes="(max-width: 1100px) 90vw, 540px"
            />
            {/* Jumping foal + pony mascots commented out per request
            <Image
              src="/images/logo/foal-jump.png"
              alt=""
              width={240}
              height={240}
              className="hero-mascot-float hero-mascot-foal"
              priority
            />
            <Image
              src="/images/logo/pony.png"
              alt=""
              width={260}
              height={260}
              className="hero-mascot-float hero-mascot-pony"
              priority
            />
            */}
          </div>
        </div>
      </header>

      {/* ============ TRUST STRIP (built from our durability test data) ============ */}
      <section className="fp-strip-wrap">
        <div className="container">
          <div className="fp-strip">
            {strip.map((s, i) => (
              <div key={i} className="fp-strip-item">
                <span className="fp-strip-ic"><Icon name={s.ic} size={26} /></span>
                <div>
                  <strong>{s.title}</strong>
                  <span>{s.sub}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/*  The old full "We test them the way your kid will" torture section now lives
          as the compact strip above. Kept here, commented out, in case we want it back.

      <section className="torture">
        ...original torture-lab section...
      </section>
      */}

      {/* ============ OUR STORY ============ */}
      <section className="fp-story section has-decor" id="about">
        <SectionDecor variant={2} />
        <div className="container fp-story-grid">
          <div className="fp-story-img">
            <Image
              src={ourStoryImage}
              alt={ourStoryImageAlt}
              fill
              unoptimized={isSanityImage(ourStoryImage)}
              sizes="(max-width: 980px) 90vw, 520px"
              style={{ objectFit: 'cover' }}
            />
          </div>
          <div className="fp-story-text">
            <span className="eyebrow">our story</span>
            <h2>Two little ponies, <span className="fp-hl fp-hl-pink">one big idea.</span></h2>
            <p>
              We make glasses kids actually want to wear, bright, tough and full of
              character. Born for real childhoods and built by Stallion Eyewear, so every
              pair keeps up with the cartwheels, the scoots and the faceplants.
            </p>
            <Link href="/collections" className="btn btn-ghost">
              Meet the collection <span className="btn-arrow"><Icon name="arrow" size={18} /></span>
            </Link>
          </div>
        </div>
      </section>

      {/* ============ CHOOSE YOUR COLLECTION ============ */}
      <section className="fp-collections section has-decor">
        <SectionDecor variant={0} />
        <div className="container">
          <div className="fp-collections-head">
            <span className="eyebrow">pick a pair, start an adventure</span>
            <h2>Choose your <span className="fp-hl fp-hl-yellow">collection.</span></h2>
            <p>Each collection has its own colour and character - including virtually unbreakable transparent frames for a clean, low-key look. Tap one to meet the range.</p>
          </div>
          <div className="fp-collections-grid">
            {collections.map((c) => (
              <Link key={c.name} href="/collections" className="fp-coll-card">
                <span className="fp-coll-visual" style={{ ['--c' as string]: c.color }}>
                  <span className="fp-coll-circle" />
                  <span className="fp-coll-specs"><Specs shape={c.shape} color={c.color} /></span>
                </span>
                <span className="fp-coll-name">{c.name}</span>
                <span className="fp-coll-tag">{c.tag}</span>
              </Link>
            ))}
          </div>
          <div className="fp-collections-cta">
            <Link href="/collections" className="btn btn-ghost">
              Explore all collections <span className="btn-arrow"><Icon name="arrow" size={18} /></span>
            </Link>
          </div>
        </div>
      </section>

      {/* ============ GAMES HOOK ============ */}
      <section className="section" id="play-cta">
        <div className="container">
          <div className="play-card">
            <div className="play-blob play-blob-1" aria-hidden />
            <div className="play-blob play-blob-2" aria-hidden />
            <div className="play-blob play-blob-3" aria-hidden />
            <div className="play-card-text">
              <span className="eyebrow">Pssst, over here!</span>
              <h2>
                Glasses on? <em>Game on.</em>
              </h2>
              <p>
                Take a play break with Brick Breaker, 25 levels of bright, bouncy,
                brick-smashing fun. No sign-up. Just play.
              </p>
              <div className="hero-ctas">
                <Link href="/games" className="btn btn-primary">
                  Play &amp; win <span className="btn-arrow"><Icon name="arrow" size={18} /></span>
                </Link>
              </div>
            </div>
            <div className="play-card-art">
              <div className="bb-preview" aria-hidden>
                <div className="bb-bricks">
                  <div className="bb-row"><i style={{ background: '#FF8C00' }} /><i style={{ background: '#FF8C00' }} /><i style={{ background: '#FF8C00' }} /><i style={{ background: '#FF8C00' }} /><i style={{ background: '#FF8C00' }} /></div>
                  <div className="bb-row"><i style={{ background: '#4CAF50' }} /><i style={{ background: '#4CAF50' }} /><i style={{ background: '#4CAF50' }} /><i style={{ background: '#4CAF50' }} /><i style={{ background: '#4CAF50' }} /></div>
                  <div className="bb-row"><i style={{ background: '#1E88E5' }} /><i style={{ background: '#1E88E5' }} /><i style={{ background: '#1E88E5' }} /><i style={{ background: '#1E88E5' }} /><i style={{ background: '#1E88E5' }} /></div>
                </div>
                <span className="bb-ball" />
                <span className="bb-paddle" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ KIDS EYE CARE (vision quiz target) ============ */}
      <section className="fp-care section has-decor" id="care">
        <SectionDecor variant={1} />
        <div className="container">
          <div className="fp-care-head">
            <span className="eyebrow">little eyes, big care</span>
            <h2>Kids eye care, <span className="fp-hl fp-hl-blue">made simple.</span></h2>
            <p>No jargon. Just friendly help finding the right kids eyewear frames, including sports eyewear for active kids - plus a quick screening game to check if it&apos;s time for an eye test.</p>
          </div>
          <div className="fp-care-grid">
            {careCards.map((c, i) => (
              <div key={i} className="fp-care-card">
                <span className="fp-care-ic" style={{ background: c.color, color: c.accent }}>
                  <Icon name={c.ic} size={24} />
                </span>
                <h3>{c.title}</h3>
                <p>{c.body}</p>
              </div>
            ))}
          </div>
          <div className="fp-care-cta">
            <Link href="/vision-quiz" className="btn btn-primary">
              Take the vision quiz <span className="btn-arrow"><Icon name="arrow" size={18} /></span>
            </Link>
          </div>
        </div>
      </section>

      {/* ============ FEATURE SPOTLIGHT ============ */}
      <section className="section has-decor" id="why">
        <SectionDecor variant={2} />
        <div className="container">
          <div className="s-head">
            <div>
              <span className="eyebrow">Why parents love us.</span>
              <h2>
                Built different,<br /> because <em>kids are.</em>
              </h2>
            </div>
            <p>
              We obsessed over every gram, hinge, colour and comfort so you get one thing:
              frames that keep up, and stay on, all day long.
            </p>
          </div>
          <div className="features-grid">
            {features.map((f, i) => (
              <div key={i} className="feat">
                <span className="feat-num">{f.num}</span>
                <h3>{f.title}</h3>
                <p>{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ FEATHERLIGHT, 12 g weight ============ */}
      <section className="section fit has-decor" id="weight">
        <SectionDecor variant={0} />
        <div className="container">
          <div className="fit-card">
            <div className="fit-text">
              <span className="eyebrow">Barely there.</span>
              <h2>
                Just <em>12 grams</em> on their nose.
              </h2>
              <p>
                Around 12 grams of flexible TR-90, so light your kid forgets they&apos;re
                wearing them, which means they actually keep them on, all day long.
              </p>
              <Link href="/collections" className="btn btn-primary">
                See the collection <span className="btn-arrow"><Icon name="arrow" size={18} /></span>
              </Link>
            </div>
            <div className="fit-img">
              <Image
                src={weightImage}
                alt={weightImageAlt}
                fill
                unoptimized={isSanityImage(weightImage)}
                sizes="(max-width: 1100px) 90vw, 540px"
                style={{ objectFit: 'cover' }}
              />
              <div className="fit-chip">
                <span className="lbl">FRAME WEIGHT</span>
                <span className="val">12 grams</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ SOCIAL PROOF ============ */}
      <section className="section proof has-decor">
        <SectionDecor variant={1} />
        <div className="container">
          <div className="s-head">
            <span className="eyebrow">The kind of thing we love to hear.</span>
            <h2>
              Made for the <em>toughest critics.</em>
            </h2>
            <p>
              A few early notes on how the frames hold up to school, sport and
              everything else childhood throws at them.
            </p>
            <span
              style={{
                display: 'inline-block',
                marginTop: 14,
                padding: '6px 14px',
                borderRadius: 999,
                background: 'rgba(26,43,74,0.06)',
                color: '#5A6B84',
                fontSize: 13,
                fontWeight: 600,
                fontFamily: 'var(--fp-body-font)',
              }}
            >
              Illustrative examples while we collect real customer reviews.
            </span>
          </div>
          <div className="testi-grid">
            {testimonials.map((t, i) => (
              <div key={i} className="testi">
                <div className="testi-stars">★★★★★</div>
                <div className="testi-body">&ldquo;{t.body}&rdquo;</div>
                <div className="testi-who">
                  <span className="testi-avatar">{t.name.charAt(0)}</span>
                  <div>
                    <div className="testi-name">{t.name}</div>
                    <div className="testi-meta">{t.meta}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ SMILES BEHIND EVERY FRAME ============ */}
      <section className="fp-smiles section has-decor">
        <SectionDecor variant={0} />
        <div className="container">
          <div className="fp-smiles-head">
            <span className="eyebrow">real kids, real adventures</span>
            <h2>Smiles behind <span className="fp-hl fp-hl-pink">every frame.</span></h2>
          </div>
          <div className="fp-smiles-track">
            {smiles.map((s, i) => (
              <figure key={i} className="fp-smile">
                <div className="fp-smile-img">
                  <Image src={s.src} alt={s.cap} fill unoptimized={isSanityImage(s.src)} sizes="(max-width: 720px) 60vw, 240px" style={{ objectFit: 'cover' }} />
                </div>
                <figcaption>
                  <strong>{s.cap}</strong>
                  <span>{s.sub}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* ============ PARTNER BANNER ============ */}
      <section className="section has-decor" id="partner-cta">
        <SectionDecor variant={1} />
        <div className="container">
          <div className="schools-card">
            <div>
              <span className="eyebrow">Let&apos;s work together.</span>
              <h2>
                Let&apos;s build something <em>together.</em>
              </h2>
              <p>
                Bulk pricing. Priority support. Large-volume orders handled end to end,
                with frames built to survive real childhoods.
              </p>
              <div className="schools-ctas">
                <Link href="/partner" className="btn btn-primary">
                  Partner with us <span className="btn-arrow"><Icon name="arrow" size={18} /></span>
                </Link>
              </div>
            </div>
            <div className="schools-mini">
              <div className="schools-mini-row">
                <strong>Built to outlast budgets</strong>
                <span>Lower replacement rates and volume-friendly pricing keep costs predictable, year after year.</span>
              </div>
              <div className="schools-mini-row">
                <strong>Standards &amp; compliance</strong>
                <span>Impact-tested, UV-rated and certified to children&apos;s safety standards. Documentation included.</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ FINAL CTA ============ */}
      <section className="finale">
        <FinaleDecor />
        <div className="container">
          <Image
            src="/images/logo/foal-jump.png"
            alt=""
            width={180}
            height={180}
            className="finale-mascot"
          />
          <span className="eyebrow">Ready when they are.</span>
          <h2>
            Give their adventures <em>clearer vision.</em>
          </h2>
          <p>
            Durable, beautiful frames your kid will love and you won&apos;t dread replacing.
            Free shipping across India and easy returns, no fuss.
          </p>
          <div className="hero-ctas">
            <Link href="/collections" className="btn btn-primary">
              See the collection <span className="btn-arrow"><Icon name="arrow" size={18} /></span>
            </Link>
          </div>
          <div className="finale-note">
            <Icon name="badge" size={16} /> Free shipping across India · easy returns
          </div>
        </div>
      </section>

      {/* ============ FOOTER ============ */}
      <Footer />
    </div>
  )
}
