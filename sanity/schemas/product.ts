import { defineField, defineType } from 'sanity'

export const productSchema = defineType({
  name: 'product',
  title: 'Product',
  type: 'document',
  groups: [
    { name: 'basics', title: 'Basics', default: true },
    { name: 'specs', title: 'Specs' },
    { name: 'colours', title: 'Colours & images' },
    { name: 'publishing', title: 'Publishing' },
  ],
  fields: [
    defineField({
      name: 'name',
      title: 'Model name',
      description: 'e.g. LUNA, SCOUT. Shows on the card and product page.',
      type: 'string',
      group: 'basics',
      validation: (r) => r.required().min(2).max(40),
    }),
    defineField({
      name: 'slug',
      title: 'URL slug',
      description: 'Auto-generated from the name. Used in /shop/<slug>.',
      type: 'slug',
      group: 'basics',
      options: { source: 'name', maxLength: 60 },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'tagline',
      title: 'One-line tagline',
      description: 'Optional. Shows above the description, in italic serif.',
      type: 'string',
      group: 'basics',
    }),
    defineField({
      name: 'price',
      title: 'Price (₹)',
      description: 'Price in Indian rupees (whole rupees, no paise).',
      type: 'number',
      group: 'basics',
      validation: (r) => r.required().positive().integer(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      description: '3–4 sentences in parent voice. Lead with child benefit.',
      type: 'array',
      group: 'basics',
      of: [{ type: 'block', styles: [{ title: 'Normal', value: 'normal' }] }],
    }),

    defineField({
      name: 'ageBand',
      title: 'Age band',
      description: 'Drives which collection page this product appears on.',
      type: 'string',
      group: 'specs',
      options: {
        list: [
          { title: 'Ages 4 to 7', value: '4-7' },
          { title: 'Ages 8 to 12', value: '8-12' },
          { title: 'Ages 13 and up', value: '13+' },
        ],
        layout: 'radio',
      },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'shape',
      title: 'Shape',
      type: 'string',
      group: 'specs',
      options: {
        list: ['round', 'oval', 'square', 'rectangle', 'panto', 'wayfarer'],
      },
    }),
    defineField({
      name: 'sizeCode',
      title: 'Size code',
      description: 'Three numbers in mm, e.g. 45-16-130 (lens · bridge · temple).',
      type: 'string',
      group: 'specs',
    }),
    defineField({
      name: 'technology',
      title: 'Construction',
      type: 'string',
      group: 'specs',
      options: {
        list: [
          { title: 'Special nose pad', value: 'nose-pad' },
          { title: 'Soft flex', value: 'soft-flex' },
          { title: 'Medium flex', value: 'medium-flex' },
          { title: 'Polarised clip-on', value: 'polarised-clip-on' },
        ],
      },
    }),

    defineField({
      name: 'colours',
      title: 'Colours',
      description: 'One entry per colour the frame comes in.',
      type: 'array',
      group: 'colours',
      of: [
        defineField({
          name: 'colour',
          title: 'Colour',
          type: 'object',
          fields: [
            { name: 'name', title: 'Name', type: 'string', validation: (r) => r.required() },
            {
              name: 'hex',
              title: 'Hex',
              description: 'e.g. #1F3A5C. Drives the swatch dot.',
              type: 'string',
              validation: (r) =>
                r.required().regex(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/, { name: 'hex colour' }),
            },
            {
              name: 'image',
              title: 'Product photo',
              description: 'Frame photo for this colour. Square works best.',
              type: 'image',
              options: { hotspot: true },
            },
          ],
          preview: {
            select: { title: 'name', subtitle: 'hex', media: 'image' },
          },
        }),
      ],
    }),
    defineField({
      name: 'lifestyleImages',
      title: 'Lifestyle photos',
      description: 'Extra photos (kid wearing it, detail shots). Optional.',
      type: 'array',
      group: 'colours',
      of: [{ type: 'image', options: { hotspot: true } }],
    }),

    defineField({
      name: 'published',
      title: 'Published',
      description: 'Show on the public site. Untick to hide.',
      type: 'boolean',
      group: 'publishing',
      initialValue: false,
    }),
    defineField({
      name: 'featured',
      title: 'Featured',
      description: 'Highlight on the homepage.',
      type: 'boolean',
      group: 'publishing',
      initialValue: false,
    }),
    defineField({
      name: 'order',
      title: 'Sort order',
      description: 'Lower numbers appear first. Defaults to 100.',
      type: 'number',
      group: 'publishing',
      initialValue: 100,
    }),
  ],

  orderings: [
    { title: 'Custom order', name: 'orderAsc', by: [{ field: 'order', direction: 'asc' }] },
    { title: 'Newest first', name: 'createdDesc', by: [{ field: '_createdAt', direction: 'desc' }] },
    { title: 'A → Z', name: 'nameAsc', by: [{ field: 'name', direction: 'asc' }] },
  ],

  preview: {
    select: {
      title: 'name',
      subtitle: 'ageBand',
      media: 'colours.0.image',
      published: 'published',
    },
    prepare({ title, subtitle, media, published }) {
      return {
        title: title || 'Untitled product',
        subtitle: `${subtitle ? `Ages ${subtitle}` : 'No age band'}${published ? '' : ' · DRAFT'}`,
        media,
      }
    },
  },
})
