/**
 * Populate the Sanity "Homepage" singleton with the images currently shipped in
 * /public, so the company starts with the live photos pre-filled (and can swap
 * them from the Studio) instead of a blank document.
 *
 * Run once:
 *   SANITY_WRITE_TOKEN=<editor-token> node scripts/populate-homepage.mjs
 *
 * Get an editor token at https://sanity.io/manage → your project → API →
 * Tokens → "Add API token" → Editor. Project id / dataset are read from
 * .env.local automatically.
 *
 * Idempotent: re-running re-uploads the images and overwrites the homepage doc.
 */
import { createClient } from '@sanity/client'
import { readFileSync } from 'node:fs'
import { basename, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(fileURLToPath(import.meta.url), '..', '..')

// --- read NEXT_PUBLIC_SANITY_* from .env.local / .env if not already in env ---
function loadEnv(file) {
  try {
    for (const line of readFileSync(join(ROOT, file), 'utf8').split('\n')) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/)
      if (m && !process.env[m[1]]) {
        process.env[m[1]] = m[2].replace(/^["']|["']$/g, '')
      }
    }
  } catch {
    /* file may not exist */
  }
}
loadEnv('.env.local')
loadEnv('.env')

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-10-01'
const token = process.env.SANITY_WRITE_TOKEN || process.env.SANITY_API_TOKEN

if (!projectId) {
  console.error('✗ NEXT_PUBLIC_SANITY_PROJECT_ID not found (checked env, .env.local, .env).')
  process.exit(1)
}
if (!token) {
  console.error('✗ Missing write token. Run with:')
  console.error('    SANITY_WRITE_TOKEN=<editor-token> node scripts/populate-homepage.mjs')
  process.exit(1)
}

const client = createClient({ projectId, dataset, apiVersion, token, useCdn: false })

// --- image slots (paths relative to /public) ---
const HERO = 'assets/photos/hero-duo.png'
const STORY = 'assets/our-story.png'
const WEIGHT = 'assets/photos/scale-12g.png'
const SMILES = [
  { file: 'assets/photos/portrait-tiny.png', caption: 'Aanya, age 5', subcaption: 'Luna · Sky' },
  { file: 'assets/photos/kid-jumping-clean.png', caption: 'Misha, age 6', subcaption: 'Archer · Cobalt' },
  { file: 'assets/photos/portrait-mid.png', caption: 'Meher, age 8', subcaption: 'Fable · Navy' },
  { file: 'assets/photos/duo-tiny.png', caption: 'Riya & Aarav, age 6', subcaption: 'Willow · Sky' },
  { file: 'assets/photos/portrait-teen.png', caption: 'Kabir & Kiara, age 11', subcaption: 'Scout · Amber' },
  { file: 'assets/photos/kids-garden.png', caption: 'The Garden Gang', subcaption: 'Pixie · Forest' },
]

async function uploadImage(relPath) {
  const buffer = readFileSync(join(ROOT, 'public', relPath))
  const asset = await client.assets.upload('image', buffer, { filename: basename(relPath) })
  console.log(`  ↑ ${relPath}  →  ${asset._id}`)
  return { _type: 'image', asset: { _type: 'reference', _ref: asset._id } }
}

async function main() {
  console.log(`Uploading homepage images to Sanity (${projectId}/${dataset})…`)

  const heroImage = await uploadImage(HERO)
  const ourStoryImage = await uploadImage(STORY)
  const weightImage = await uploadImage(WEIGHT)

  const smiles = []
  for (const [i, s] of SMILES.entries()) {
    const image = await uploadImage(s.file)
    smiles.push({
      _type: 'smile',
      _key: `smile-${i}`,
      image,
      caption: s.caption,
      subcaption: s.subcaption,
    })
  }

  const doc = {
    _id: 'homepage',
    _type: 'homepage',
    heroImage,
    heroImageAlt: 'Two kids smiling in Foal & Pony glasses',
    ourStoryImage,
    ourStoryImageAlt: 'Foal & Pony, behind the scenes',
    weightImage,
    weightImageAlt: 'Foal & Pony ultra-light child frames on a scale showing 12 grams',
    smiles,
  }

  await client.createOrReplace(doc)
  console.log('✓ Homepage document created/updated. Open the Studio → Homepage to review.')
}

main().catch((err) => {
  console.error('✗ Failed:', err.message)
  process.exit(1)
})
