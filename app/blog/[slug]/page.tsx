import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { PortableText, type PortableTextComponents } from '@portabletext/react'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { getBlogPostBySlug, listBlogSlugs } from '@/lib/sanity/blog'
import { urlFor } from '@/lib/sanity/client'
import { catColor, catLabel, formatDate } from '@/components/blog/blog-meta'
import '../blog.css'

// Semantic elements only - the styling lives in .fp-article-body (blog.css),
// which is what makes the drop cap and pull-quotes possible.
const bodyComponents: PortableTextComponents = {
  block: {
    normal: ({ children }) => <p>{children}</p>,
    h2: ({ children }) => <h2>{children}</h2>,
    h3: ({ children }) => <h3>{children}</h3>,
    blockquote: ({ children }) => (
      <blockquote>
        <p>{children}</p>
      </blockquote>
    ),
  },
  list: { bullet: ({ children }) => <ul>{children}</ul> },
  listItem: { bullet: ({ children }) => <li>{children}</li> },
  marks: {
    strong: ({ children }) => <strong>{children}</strong>,
    em: ({ children }) => <em>{children}</em>,
    link: ({ children, value }) => (
      <a href={(value as { href?: string })?.href} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    ),
  },
  types: {
    image: ({ value }) => (
      <Image
        src={urlFor(value).width(1400).auto('format').quality(75).url()}
        alt={(value as { alt?: string })?.alt ?? ''}
        width={1400}
        height={900}
        unoptimized
        sizes="(max-width: 720px) 90vw, 680px"
        style={{ width: '100%', height: 'auto', display: 'block' }}
      />
    ),
  },
}

export async function generateStaticParams() {
  const slugs = await listBlogSlugs()
  return slugs.map((slug) => ({ slug }))
}

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = await getBlogPostBySlug(slug)
  if (!post) return { title: 'Post not found - Foal & Pony' }
  return {
    title: post.metaTitle || `${post.title} - Foal & Pony`,
    description: post.metaDescription || post.excerpt,
  }
}

const DOT_COLORS = ['#FF8C00', '#FF6FB5', '#3FA9F5', '#57C84D', '#FFC23C']

export default async function BlogPost({ params }: Props) {
  const { slug } = await params
  const post = await getBlogPostBySlug(slug)

  if (!post) notFound()

  return (
    <div className="fp-page">
      <Navbar />

      <article className="fp-article" style={{ ['--cat' as string]: catColor(post.category) }}>
        <div className="fp-article-inner">
          <Link href="/blog" className="fp-article-back">← The Journal</Link>

          <header className="fp-article-head">
            <span className="fp-kicker">{catLabel(post.category)}</span>
            <h1 className="fp-article-title">{post.title}</h1>
            <div className="fp-article-meta">
              {formatDate(post.publishedDate)}
              {post.readTime && (
                <>
                  <span className="dot" />
                  {post.readTime} read
                </>
              )}
            </div>
          </header>
        </div>

        {post.coverImageUrl && (
          <div className="fp-article-hero">
            <Image
              src={post.coverImageUrl}
              alt={post.coverImageAlt || post.title}
              fill
              unoptimized
              priority
              sizes="(max-width: 980px) 92vw, 980px"
              style={{ objectFit: 'cover' }}
            />
          </div>
        )}

        <div className="fp-article-inner">
          <div className="fp-article-body">
            {post.body ? (
              <PortableText value={post.body} components={bodyComponents} />
            ) : (
              post.excerpt && <p>{post.excerpt}</p>
            )}
          </div>

          <div className="fp-article-end">
            <div className="fp-article-dots">
              {DOT_COLORS.map((c) => (
                <span key={c} style={{ background: c }} />
              ))}
            </div>
            <div className="fp-article-cta">
              <h3>Frames built for real childhoods</h3>
              <p>Virtually unbreakable, feather-light, and the kind kids actually want to wear.</p>
              <div className="fp-article-cta-row">
                <Link href="/collections" className="btn btn-primary">See the collection</Link>
                <Link href="/blog" className="btn btn-ghost">More stories</Link>
              </div>
            </div>
          </div>
        </div>
      </article>

      <Footer />
    </div>
  )
}
