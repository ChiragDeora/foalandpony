import { sanityClient, isSanityConfigured } from './client'
import {
  ALL_BLOG_POSTS_QUERY,
  BLOG_POST_BY_SLUG_QUERY,
  BLOG_SLUGS_QUERY,
} from './queries'
import type { BlogPost, BlogPostSummary } from './types'

/**
 * Server-side blog fetchers.
 *
 * All swallow Sanity errors and return an empty list / null, so /blog degrades
 * to its "coming soon" empty state when nothing is published or Sanity is down.
 */

export async function listBlogPosts(): Promise<BlogPostSummary[]> {
  if (!isSanityConfigured) return []
  try {
    return await sanityClient.fetch<BlogPostSummary[]>(ALL_BLOG_POSTS_QUERY, {}, {
      next: { tags: ['blog'], revalidate: 60 },
    })
  } catch {
    return []
  }
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  if (!isSanityConfigured) return null
  try {
    const post = await sanityClient.fetch<BlogPost | null>(
      BLOG_POST_BY_SLUG_QUERY,
      { slug },
      { next: { tags: ['blog', `blog:${slug}`], revalidate: 60 } }
    )
    return post ?? null
  } catch {
    return null
  }
}

export async function listBlogSlugs(): Promise<string[]> {
  if (!isSanityConfigured) return []
  try {
    return await sanityClient.fetch<string[]>(BLOG_SLUGS_QUERY, {}, {
      next: { tags: ['blog'], revalidate: 60 },
    })
  } catch {
    return []
  }
}
