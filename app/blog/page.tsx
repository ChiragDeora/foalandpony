import Image from 'next/image'
import Link from 'next/link'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { SectionDecor } from '@/components/Decor'
import { listBlogPosts } from '@/lib/sanity/blog'
import { BlogGrid } from '@/components/blog/BlogGrid'
import { catColor, catLabel, formatDate } from '@/components/blog/blog-meta'
import { isSanityImage } from '@/lib/image'
import './blog.css'

export const metadata = {
  title: 'The Journal - Stories & tips for parents | Foal & Pony',
  description:
    'The Foal & Pony Journal - durability tests, kid-tested frame picks and the small habits that keep kids’ glasses going.',
}

function Arrow() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  )
}

export default async function BlogPage() {
  const posts = await listBlogPosts()

  // ---- Beautiful empty state (no published posts yet) ----------------------
  if (posts.length === 0) {
    return (
      <div className="fp-page">
        <Navbar />
        <main className="fp-journal">
          <section className="fp-journal-empty has-decor">
            <SectionDecor variant={0} />
            <div style={{ position: 'relative', zIndex: 1 }}>
              <span
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 9,
                  fontFamily: "'Fredoka','Baloo 2',sans-serif", fontWeight: 600,
                  letterSpacing: '.16em', textTransform: 'uppercase', fontSize: 12.5,
                  color: 'var(--candy-green)',
                }}
              >
                <span className="fp-empty-pulse" /> The Journal is warming up
              </span>
              <h1 className="fp-empty-title">
                Good stories,<br />
                <span className="fp-hl fp-hl-yellow">on their way.</span>
              </h1>
              <p className="fp-empty-sub">
                Durability deep-dives, kid-tested frame picks and no-nonsense parent tips -
                the first stories land here soon.
              </p>
              <div className="fp-empty-topics">
                <div className="fp-empty-topic"><strong>🛡️ Durability</strong><span>Drop tests &amp; how we build tough</span></div>
                <div className="fp-empty-topic"><strong>😎 Kid-tested</strong><span>Which frame for which kid</span></div>
                <div className="fp-empty-topic"><strong>💡 Parent tips</strong><span>Habits that make glasses last</span></div>
              </div>
              <Link href="/collections" className="btn btn-primary">
                Meet the collection <span className="btn-arrow"><Arrow /></span>
              </Link>
            </div>
          </section>
          <div className="fp-journal-wrap"><NewsletterBand /></div>
        </main>
        <Footer />
      </div>
    )
  }

  // ---- Populated magazine layout -------------------------------------------
  const lead = posts.find((p) => p.featured) ?? posts[0]
  const rest = posts.filter((p) => p._id !== lead._id)

  return (
    <div className="fp-page">
      <Navbar />
      <main className="fp-journal">
        <header className="fp-journal-head">
          <span className="fp-kicker fp-kicker-center">The Foal &amp; Pony Journal</span>
          <h1 className="fp-journal-title">
            Stories for little <span className="fp-hl fp-hl-yellow">adventurers.</span>
          </h1>
          <p className="fp-journal-sub">
            Durability tests, kid-tested picks and the small habits that keep glasses going -
            written for parents, in plain language.
          </p>
        </header>

        <div className="fp-journal-wrap">
          {/* Lead story */}
          <Link
            href={`/blog/${lead.slug}`}
            className="fp-lead"
            style={{ ['--cat' as string]: catColor(lead.category) }}
          >
            <div className="fp-lead-media">
              {lead.coverImageUrl && (
                <Image
                  src={lead.coverImageUrl}
                  alt={lead.title}
                  fill
                  priority
                  unoptimized={isSanityImage(lead.coverImageUrl)}
                  sizes="(max-width: 900px) 100vw, 640px"
                />
              )}
            </div>
            <div className="fp-lead-body">
              <span className="fp-kicker">{catLabel(lead.category)}</span>
              <h2 className="fp-lead-title">{lead.title}</h2>
              {lead.excerpt && <p className="fp-lead-excerpt">{lead.excerpt}</p>}
              <div className="fp-meta">
                {formatDate(lead.publishedDate)}
                {lead.readTime && (<><span className="dot" />{lead.readTime} read</>)}
              </div>
              <span className="fp-readlink">Read the story <Arrow /></span>
            </div>
          </Link>

          <BlogGrid posts={rest} />

          <NewsletterBand />
        </div>
      </main>
      <Footer />
    </div>
  )
}

function NewsletterBand() {
  return (
    <section className="fp-journal-cta">
      <h2>Never miss a story.</h2>
      <p>
        New durability tests, frame guides and parent tips - say hello and we&apos;ll keep you in
        the loop over WhatsApp.
      </p>
      <a href="https://wa.me/919324337504" target="_blank" rel="noopener noreferrer" className="btn">
        Chat with us <span className="btn-arrow"><Arrow /></span>
      </a>
    </section>
  )
}
