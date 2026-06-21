import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'

/* Local post content, wire to Sanity when blog schema exists */
const POSTS: Record<string, {
  title: string
  category: 'durability' | 'kid-tested' | 'parent-tips'
  date: string
  readTime: string
  img: string
  body: string[]
}> = {
  'why-kids-break-glasses': {
    title: 'Why kids break glasses (and how we fixed it)',
    category: 'durability',
    date: 'June 12, 2026',
    readTime: '5 min',
    img: '/assets/photos/flexible-hinge.png',
    body: [
      'We dropped 50 pairs of kids glasses from exactly 2 metres onto concrete and filmed every single impact. Some frames shattered on the first drop. Some made it to 40. Ours made it to 50, every single time.',
      'The core problem with most kids glasses isn\'t the lens. It\'s the hinge. Conventional hinges are a fixed metal pivot. When a frame hits the ground at an angle, the hinge takes the full force and the temple snaps clean off.',
      'Our approach: spring-loaded temples made from TR-90 thermoplastic. The material has shape memory, it flexes under impact and returns to its exact original position. We test every hinge to 10,000 flex cycles before it leaves the factory.',
      'The drop test protocol is simple but brutal. We drop each frame ten times from a standing height of two metres onto a concrete slab. We drop it flat, at 45°, on the hinge side, on the lens. If it passes all ten, we move to the next ten. At drop 50, if the frame is still intact and the hinges still move correctly, it passes.',
      'Ninety-three per cent of frames that reach customers survive their first year break-free. The seven per cent that don\'t? Backed by our replacement policy, no fuss.',
    ],
  },
  'choosing-the-right-frame': {
    title: 'The ARCHER, BECKETT and CLOUD, which frame for your child?',
    category: 'kid-tested',
    date: 'June 5, 2026',
    readTime: '4 min',
    img: '/assets/photos/portrait-mid.png',
    body: [
      'Three of our most popular frames, three completely different personalities. Here\'s how to choose.',
      'ARCHER is for the kid who wants to look grown-up. It\'s a slightly wider rectangular frame that suits ages 8 and up. It comes in orange, navy, green and red. If your child has a wider face or is already fashion-conscious, start here.',
      'BECKETT is the all-rounder. Oval-ish with soft corners, it works on nearly every face shape and covers ages 6 to 12. Green is the signature colour, which kids seem to love. It\'s the frame we recommend most often.',
      'CLOUD is our smallest frame and our most popular for first-time wearers aged 4 to 7. The blue is iconic. The ultra-soft nose pad means it sits comfortably even on very low nose bridges.',
      'The honest answer: if you\'re not sure, pick BECKETT. It\'s designed to be forgiving in both fit and style. If the style matters to your child (and it often does), get them in front of our virtual try-on and let them choose.',
    ],
  },
  'glasses-care-guide': {
    title: 'Five habits that make glasses last longer',
    category: 'parent-tips',
    date: 'May 28, 2026',
    readTime: '3 min',
    img: '/assets/photos/scale-12g.png',
    body: [
      'The single biggest cause of broken kids glasses isn\'t the fall, the football, or the wrestling match. It\'s a backpack. Specifically: glasses left loose inside a bag where they get sat on, bent, and scratched by everything else inside.',
      'Habit one: always use the case. We know, we know. But the case keeps the frame from twisting. Most of our frames can survive a 2-metre fall onto concrete. They cannot survive a 60-kilogram parent sitting on a backpack.',
      'Habit two: teach the two-hand rule for putting them on and taking them off. One-handed glasses removal twists the frame asymmetrically over thousands of repetitions. Two hands keep it aligned.',
      'Habit three: clean with the cloth, not the shirt. Shirts carry small particles that scratch lenses. The microfibre cloth that ships with the frame is all you need.',
      'Habit four: don\'t leave them on a car dashboard. Heat warps plastic frames. Even TR-90 has limits in direct sunlight inside a car on a summer day.',
      'Habit five: store upside down when not in the case. It sounds counterintuitive, but frames stored right-side up on a flat surface gradually loosen the hinge tension over time. Upside down distributes the weight differently.',
    ],
  },
}

const CATEGORY_LABELS = {
  'durability': 'Durability',
  'kid-tested': 'Kid-tested',
  'parent-tips': 'Parent tips',
}

const CATEGORY_COLOR = {
  'durability': '#FF8C00',
  'kid-tested': '#4CAF50',
  'parent-tips': '#1E88E5',
}

type Props = { params: Promise<{ slug: string }> }

export default async function BlogPost({ params }: Props) {
  const { slug } = await params
  const post = POSTS[slug]

  if (!post) notFound()

  const accentColor = CATEGORY_COLOR[post.category]

  return (
    <div className="fp-page">
      <Navbar />

      {/* Hero image */}
      <div style={{ position: 'relative', width: '100%', height: 'min(480px, 55vw)', background: '#e8e0d4' }}>
        <Image src={post.img} alt={post.title} fill style={{ objectFit: 'cover', objectPosition: 'center 30%' }} priority />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, transparent 40%, rgba(26,43,74,0.6) 100%)' }} />
      </div>

      {/* Article */}
      <article style={{ maxWidth: 720, margin: '0 auto', padding: '56px 32px 96px' }}>
        {/* Category + meta */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
          <span className={`fp-tag ${post.category === 'durability' ? 'fp-tag-orange' : post.category === 'kid-tested' ? 'fp-tag-green' : 'fp-tag-blue'}`}>
            {CATEGORY_LABELS[post.category]}
          </span>
          <span style={{ color: '#7A7A7A', fontSize: 13, fontFamily: 'var(--fp-body-font)' }}>
            {post.date} · {post.readTime} read
          </span>
        </div>

        {/* Title */}
        <h1 style={{
          fontFamily: 'var(--fp-heading-font)',
          fontWeight: 800,
          fontSize: 'clamp(28px, 4vw, 48px)',
          color: '#1A2B4A',
          lineHeight: 1.1,
          marginBottom: 40,
        }}>
          {post.title}
        </h1>

        {/* Body paragraphs */}
        {post.body.map((para, i) => (
          i === 2 ? (
            /* Callout block on 3rd paragraph */
            <blockquote key={i} style={{
              borderLeft: `4px solid #4CAF50`,
              background: 'rgba(245,243,237,0.5)',
              paddingLeft: 20,
              paddingTop: 12,
              paddingBottom: 12,
              paddingRight: 16,
              marginBottom: 24,
              borderRadius: '0 8px 8px 0',
            }}>
              <p style={{ color: '#1A2B4A', fontSize: 17, lineHeight: 1.7, margin: 0, fontFamily: 'var(--fp-body-font)', fontWeight: 600 }}>
                {para}
              </p>
            </blockquote>
          ) : (
            <p key={i} style={{
              color: '#7A7A7A',
              fontSize: 17,
              lineHeight: 1.8,
              marginBottom: 24,
              fontFamily: 'var(--fp-body-font)',
            }}>
              {para}
            </p>
          )
        ))}

        {/* Back link */}
        <div style={{ borderTop: '1px solid rgba(26,43,74,0.1)', paddingTop: 32, marginTop: 40 }}>
          <Link href="/blog" className="fp-btn-orange-link">
            ← Back to stories
          </Link>
        </div>
      </article>

      <Footer />
    </div>
  )
}
