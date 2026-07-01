import { defineField, defineType } from 'sanity'

export const blogPostSchema = defineType({
  name: 'blogPost',
  title: 'Blog post',
  type: 'document',
  groups: [
    { name: 'content', title: 'Content', default: true },
    { name: 'seo', title: 'SEO' },
    { name: 'publishing', title: 'Publishing' },
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      description: 'The headline. Shows on the blog card and at the top of the article.',
      type: 'string',
      group: 'content',
      validation: (r) => r.required().min(4).max(120),
    }),
    defineField({
      name: 'slug',
      title: 'URL slug',
      description: 'Auto-generated from the title. Used in /blog/<slug>.',
      type: 'slug',
      group: 'content',
      options: { source: 'title', maxLength: 80 },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      description: 'Drives the coloured tag on the card and article.',
      type: 'string',
      group: 'content',
      options: {
        list: [
          { title: 'Durability', value: 'durability' },
          { title: 'Kid-tested', value: 'kid-tested' },
          { title: 'Parent tips', value: 'parent-tips' },
        ],
        layout: 'radio',
      },
      initialValue: 'parent-tips',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'coverImage',
      title: 'Cover image',
      description:
        'Big photo at the top of the article and on the blog card. Landscape works best (roughly 16:9). A normal photo with a background is fine here.',
      type: 'image',
      group: 'content',
      options: { hotspot: true },
    }),
    defineField({
      name: 'excerpt',
      title: 'Excerpt',
      description: '1-2 sentence summary shown on the blog index card. Keep it under ~160 characters.',
      type: 'text',
      rows: 3,
      group: 'content',
      validation: (r) => r.max(240),
    }),
    defineField({
      name: 'readTime',
      title: 'Read time',
      description: 'e.g. "5 min". Shown next to the date.',
      type: 'string',
      group: 'content',
    }),
    defineField({
      name: 'publishedDate',
      title: 'Published date',
      description: 'The date shown on the article. Also used to sort newest-first.',
      type: 'date',
      group: 'content',
      options: { dateFormat: 'MMMM D, YYYY' },
    }),
    defineField({
      name: 'body',
      title: 'Article body',
      description: 'The full article. Use headings, paragraphs, quotes and images as needed.',
      type: 'array',
      group: 'content',
      of: [
        {
          type: 'block',
          styles: [
            { title: 'Normal', value: 'normal' },
            { title: 'Heading', value: 'h2' },
            { title: 'Subheading', value: 'h3' },
            { title: 'Quote', value: 'blockquote' },
          ],
          lists: [{ title: 'Bullet', value: 'bullet' }],
          marks: {
            decorators: [
              { title: 'Bold', value: 'strong' },
              { title: 'Italic', value: 'em' },
            ],
            annotations: [
              {
                name: 'link',
                type: 'object',
                title: 'Link',
                fields: [{ name: 'href', type: 'url', title: 'URL' }],
              },
            ],
          },
        },
        { type: 'image', options: { hotspot: true } },
      ],
    }),

    defineField({
      name: 'metaTitle',
      title: 'Meta title (SEO)',
      description: 'Optional. Overrides the browser tab / search-result title. Falls back to the post title.',
      type: 'string',
      group: 'seo',
      validation: (r) => r.max(70),
    }),
    defineField({
      name: 'metaDescription',
      title: 'Meta description (SEO)',
      description: 'Optional. The grey summary line under the title in Google. Aim for 150-160 characters.',
      type: 'text',
      rows: 3,
      group: 'seo',
      validation: (r) => r.max(200),
    }),

    defineField({
      name: 'published',
      title: 'Published',
      description: 'Show on the public /blog. Untick to keep as a draft.',
      type: 'boolean',
      group: 'publishing',
      initialValue: false,
    }),
    defineField({
      name: 'featured',
      title: 'Featured',
      description: 'Highlight this post at the top of the blog index.',
      type: 'boolean',
      group: 'publishing',
      initialValue: false,
    }),
  ],

  orderings: [
    {
      title: 'Newest first',
      name: 'dateDesc',
      by: [{ field: 'publishedDate', direction: 'desc' }],
    },
    { title: 'A → Z', name: 'titleAsc', by: [{ field: 'title', direction: 'asc' }] },
  ],

  preview: {
    select: { title: 'title', subtitle: 'category', media: 'coverImage', published: 'published' },
    prepare({ title, subtitle, media, published }) {
      return {
        title: title || 'Untitled post',
        subtitle: `${subtitle ?? 'Uncategorised'}${published ? '' : ' · DRAFT'}`,
        media,
      }
    },
  },
})
