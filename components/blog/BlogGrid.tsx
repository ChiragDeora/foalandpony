'use client'

import { useMemo, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import type { BlogCategory, BlogPostSummary } from '@/lib/sanity/types'
import { isSanityImage } from '@/lib/image'
import { catColor, catLabel, formatDate } from './blog-meta'

const ORDER: BlogCategory[] = ['durability', 'kid-tested', 'parent-tips']

function Arrow() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  )
}

function Card({ post, index }: { post: BlogPostSummary; index: number }) {
  const color = catColor(post.category)
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="fp-card"
      style={{ ['--cat' as string]: color, animationDelay: `${Math.min(index, 6) * 60}ms` }}
    >
      <div className="fp-card-media">
        {post.coverImageUrl && (
          <Image
            src={post.coverImageUrl}
            alt={post.title}
            fill
            unoptimized={isSanityImage(post.coverImageUrl)}
            sizes="(max-width: 600px) 90vw, (max-width: 900px) 45vw, 360px"
          />
        )}
      </div>
      <div className="fp-card-body">
        <span className="fp-kicker">{catLabel(post.category)}</span>
        <h3 className="fp-card-title">{post.title}</h3>
        <div className="fp-card-rule" />
        {post.excerpt && <p className="fp-card-excerpt">{post.excerpt}</p>}
        <div className="fp-card-foot">
          <span className="fp-meta">
            {formatDate(post.publishedDate)}
            {post.readTime && (
              <>
                <span className="dot" />
                {post.readTime}
              </>
            )}
          </span>
          <span className="fp-card-arrow"><Arrow /></span>
        </div>
      </div>
    </Link>
  )
}

export function BlogGrid({ posts }: { posts: BlogPostSummary[] }) {
  const cats = useMemo(
    () => ORDER.filter((c) => posts.some((p) => p.category === c)),
    [posts]
  )
  const [active, setActive] = useState<BlogCategory | 'all'>('all')

  const shown = active === 'all' ? posts : posts.filter((p) => p.category === active)

  if (posts.length === 0) return null

  return (
    <>
      {cats.length > 1 && (
        <div className="fp-filters">
          <button
            type="button"
            className="fp-filter"
            data-active={active === 'all'}
            onClick={() => setActive('all')}
          >
            All stories
          </button>
          {cats.map((c) => (
            <button
              key={c}
              type="button"
              className="fp-filter"
              data-active={active === c}
              onClick={() => setActive(c)}
            >
              {catLabel(c)}
            </button>
          ))}
        </div>
      )}

      <div className="fp-grid" key={active}>
        {shown.map((post, i) => (
          <Card key={post._id} post={post} index={i} />
        ))}
      </div>
    </>
  )
}
