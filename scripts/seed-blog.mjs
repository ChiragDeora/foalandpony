/**
 * Seed the blog with three starter posts (the brand's original articles) so the
 * new /blog layout is populated out of the box. Fully editable/deletable in the
 * Studio afterwards.
 *
 * Run once:
 *   SANITY_WRITE_TOKEN=<editor-token> node scripts/seed-blog.mjs
 *
 * Idempotent: uses fixed document ids, so re-running overwrites rather than
 * duplicating. Project id / dataset are read from .env.local automatically.
 */
import { createClient } from '@sanity/client'
import { readFileSync } from 'node:fs'
import { basename, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(fileURLToPath(import.meta.url), '..', '..')

function loadEnv(file) {
  try {
    for (const line of readFileSync(join(ROOT, file), 'utf8').split('\n')) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/)
      if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '')
    }
  } catch {}
}
loadEnv('.env.local')
loadEnv('.env')

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-10-01'
const token = process.env.SANITY_WRITE_TOKEN || process.env.SANITY_API_TOKEN

if (!projectId) { console.error('✗ NEXT_PUBLIC_SANITY_PROJECT_ID not found.'); process.exit(1) }
if (!token) {
  console.error('✗ Missing write token. Run with:')
  console.error('    SANITY_WRITE_TOKEN=<editor-token> node scripts/seed-blog.mjs')
  process.exit(1)
}

const client = createClient({ projectId, dataset, apiVersion, token, useCdn: false })

function body(paras) {
  return paras.map((text, i) => ({
    _type: 'block',
    _key: `b${i}`,
    style: 'normal',
    markDefs: [],
    children: [{ _type: 'span', _key: `s${i}`, text, marks: [] }],
  }))
}

const POSTS = [
  {
    slug: 'why-kids-break-glasses',
    title: 'Why kids break glasses (and how we fixed it)',
    category: 'durability',
    readTime: '5 min',
    publishedDate: '2026-06-12',
    featured: true,
    cover: 'assets/photos/flexible-hinge.png',
    excerpt:
      'We dropped 50 pairs from 2 metres onto concrete, fifty times each. Here’s what actually breaks kids’ glasses - and how we engineered it out.',
    paras: [
      'We dropped 50 pairs of kids glasses from exactly 2 metres onto concrete and filmed every single impact. Some frames shattered on the first drop. Some made it to 40. Ours made it to 50, every single time.',
      "The core problem with most kids glasses isn't the lens. It's the hinge. Conventional hinges are a fixed metal pivot. When a frame hits the ground at an angle, the hinge takes the full force and the temple snaps clean off.",
      'Our approach: spring-loaded temples made from TR-90 thermoplastic. The material has shape memory, it flexes under impact and returns to its exact original position. We test every hinge to 10,000 flex cycles before it leaves the factory.',
      'The drop test protocol is simple but brutal. We drop each frame ten times from a standing height of two metres onto a concrete slab. We drop it flat, at 45°, on the hinge side, on the lens. If it passes all ten, we move to the next ten. At drop 50, if the frame is still intact and the hinges still move correctly, it passes.',
      "Ninety-three per cent of frames that reach customers survive their first year break-free. The seven per cent that don't? Backed by our replacement policy, no fuss.",
    ],
  },
  {
    slug: 'choosing-the-right-frame',
    title: 'The ARCHER, BECKETT and CLOUD - which frame for your child?',
    category: 'kid-tested',
    readTime: '4 min',
    publishedDate: '2026-06-05',
    featured: false,
    cover: 'assets/photos/portrait-mid.png',
    excerpt:
      'Three of our most popular frames, three completely different personalities. A quick guide to picking the right one.',
    paras: [
      "Three of our most popular frames, three completely different personalities. Here's how to choose.",
      'ARCHER is for the kid who wants to look grown-up. It’s a slightly wider rectangular frame that suits ages 8 and up. It comes in orange, navy, green and red. If your child has a wider face or is already fashion-conscious, start here.',
      'BECKETT is the all-rounder. Oval-ish with soft corners, it works on nearly every face shape and covers ages 6 to 12. Green is the signature colour, which kids seem to love. It’s the frame we recommend most often.',
      'CLOUD is our smallest frame and our most popular for first-time wearers aged 4 to 7. The blue is iconic. The ultra-soft nose pad means it sits comfortably even on very low nose bridges.',
      'The honest answer: if you’re not sure, pick BECKETT. It’s designed to be forgiving in both fit and style. If the style matters to your child (and it often does), get them in front of the range and let them choose.',
    ],
  },
  {
    slug: 'glasses-care-guide',
    title: 'Five habits that make glasses last longer',
    category: 'parent-tips',
    readTime: '3 min',
    publishedDate: '2026-05-28',
    featured: false,
    cover: 'assets/photos/scale-12g.png',
    excerpt:
      'The biggest cause of broken glasses isn’t the football - it’s a backpack. Five small habits that keep frames going.',
    paras: [
      "The single biggest cause of broken kids glasses isn't the fall, the football, or the wrestling match. It's a backpack. Specifically: glasses left loose inside a bag where they get sat on, bent, and scratched by everything else inside.",
      'Habit one: always use the case. We know, we know. But the case keeps the frame from twisting. Most of our frames can survive a 2-metre fall onto concrete. They cannot survive a 60-kilogram parent sitting on a backpack.',
      'Habit two: teach the two-hand rule for putting them on and taking them off. One-handed glasses removal twists the frame asymmetrically over thousands of repetitions. Two hands keep it aligned.',
      'Habit three: clean with the cloth, not the shirt. Shirts carry small particles that scratch lenses. The microfibre cloth that ships with the frame is all you need.',
      "Habit four: don't leave them on a car dashboard. Heat warps plastic frames. Even TR-90 has limits in direct sunlight inside a car on a summer day.",
      'Habit five: store upside down when not in the case. It sounds counterintuitive, but frames stored right-side up on a flat surface gradually loosen the hinge tension over time. Upside down distributes the weight differently.',
    ],
  },
]

async function uploadImage(relPath) {
  const buffer = readFileSync(join(ROOT, 'public', relPath))
  const asset = await client.assets.upload('image', buffer, { filename: basename(relPath) })
  return { _type: 'image', asset: { _type: 'reference', _ref: asset._id } }
}

async function main() {
  console.log(`Seeding blog posts to Sanity (${projectId}/${dataset})…`)
  for (const p of POSTS) {
    const coverImage = await uploadImage(p.cover)
    await client.createOrReplace({
      _id: `blogpost-${p.slug}`,
      _type: 'blogPost',
      title: p.title,
      slug: { _type: 'slug', current: p.slug },
      category: p.category,
      readTime: p.readTime,
      publishedDate: p.publishedDate,
      featured: p.featured,
      published: true,
      excerpt: p.excerpt,
      coverImage,
      body: body(p.paras),
    })
    console.log(`  ✓ ${p.title}`)
  }
  console.log('✓ Done. Open the Studio → Blog posts, or visit /blog.')
}

main().catch((err) => { console.error('✗ Failed:', err.message); process.exit(1) })
