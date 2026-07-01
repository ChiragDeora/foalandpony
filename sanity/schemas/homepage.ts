import { defineField, defineType } from 'sanity'

/**
 * Homepage - single editable document holding every image shown on the
 * homepage, so the company can swap them without a developer.
 *
 * This is a singleton: there is only ever one "Homepage" document (see the
 * Studio structure in sanity.config.ts, which opens it directly). Any image
 * left blank falls back to the photo currently shipped in the site.
 */
export const homepageSchema = defineType({
  name: 'homepage',
  title: 'Homepage',
  type: 'document',
  groups: [
    { name: 'hero', title: 'Hero', default: true },
    { name: 'story', title: 'Our story' },
    { name: 'weight', title: '12 grams' },
    { name: 'smiles', title: 'Smiles gallery' },
  ],
  fields: [
    defineField({
      name: 'heroImage',
      title: 'Hero image',
      description:
        'The big kids photo, top-right of the homepage. IMPORTANT: upload a cut-out with a TRANSPARENT background (a PNG where the background has been removed) - it sits directly on the page with no frame or box behind it. A normal photo with a background will look wrong here.',
      type: 'image',
      group: 'hero',
      options: { hotspot: true },
    }),
    defineField({
      name: 'heroImageAlt',
      title: 'Hero image - alt text',
      description: 'Short description of the photo for screen readers & SEO, e.g. "Two kids smiling in Foal & Pony glasses".',
      type: 'string',
      group: 'hero',
    }),

    defineField({
      name: 'ourStoryImage',
      title: 'Our Story image',
      description:
        'Photo in the "Our story" section. A normal photo WITH a background is fine - it sits inside a rounded frame. Portrait or square works best.',
      type: 'image',
      group: 'story',
      options: { hotspot: true },
    }),
    defineField({
      name: 'ourStoryImageAlt',
      title: 'Our Story image - alt text',
      description: 'Short description for screen readers & SEO.',
      type: 'string',
      group: 'story',
    }),

    defineField({
      name: 'weightImage',
      title: '"12 grams" image',
      description:
        'Photo in the "Just 12 grams" section - the frames on a weighing scale. A normal photo with a background is fine; it sits inside a rounded frame.',
      type: 'image',
      group: 'weight',
      options: { hotspot: true },
    }),
    defineField({
      name: 'weightImageAlt',
      title: '"12 grams" image - alt text',
      description: 'Short description for screen readers & SEO.',
      type: 'string',
      group: 'weight',
    }),

    defineField({
      name: 'smiles',
      title: 'Smiles gallery',
      description:
        'The scrolling "Smiles behind every frame" strip. Add one entry per photo. Normal photos with backgrounds are fine - each sits in a rounded card. Aim for 4-6.',
      type: 'array',
      group: 'smiles',
      of: [
        defineField({
          name: 'smile',
          title: 'Photo',
          type: 'object',
          fields: [
            {
              name: 'image',
              title: 'Photo',
              type: 'image',
              options: { hotspot: true },
              validation: (r) => r.required(),
            },
            {
              name: 'caption',
              title: 'Caption',
              description: 'Bold line under the photo, e.g. "Aanya, age 5".',
              type: 'string',
            },
            {
              name: 'subcaption',
              title: 'Sub-caption',
              description: 'Smaller line under the caption, e.g. "Luna · Sky".',
              type: 'string',
            },
          ],
          preview: {
            select: { title: 'caption', subtitle: 'subcaption', media: 'image' },
          },
        }),
      ],
    }),
  ],

  preview: {
    prepare() {
      return { title: 'Homepage', subtitle: 'Images shown on the homepage' }
    },
  },
})
