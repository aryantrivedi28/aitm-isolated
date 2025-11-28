import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'landingPage',
  title: 'Landing Page',
  type: 'document',
  fields: [
    // Meta
    defineField({
      name: 'title',
      title: 'Page Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'type',
      title: 'Type',
      type: 'string',
      options: {
        list: [
          { title: 'Service', value: 'service' },
          { title: 'Industry', value: 'industry' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'object',
      fields: [
        defineField({ name: 'metaTitle', title: 'Meta Title', type: 'string' }),
        defineField({ name: 'metaDescription', title: 'Meta Description', type: 'text' }),
        defineField({ name: 'ogImage', title: 'OG Image', type: 'richImage' }),
        defineField({ name: 'canonicalUrl', title: 'Canonical URL', type: 'url' }),
      ],
      options: { collapsible: true, collapsed: true },
    }),

    // Hero
    defineField({
      name: 'hero',
      title: 'Hero Section',
      type: 'object',
      fields: [
        defineField({
          name: 'title',
          type: 'string',
          title: 'Title',
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: 'subtitle',
          type: 'text',
          title: 'Subtitle',
        }),

        // CTAs on the left
        defineField({
          name: 'ctas',
          title: 'CTA Buttons',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                defineField({
                  name: 'label',
                  type: 'string',
                  title: 'Label',
                  validation: (Rule) => Rule.required(),
                }),
                defineField({
                  name: 'href',
                  type: 'url',
                  title: 'Link',
                  validation: (Rule) => Rule.required(),
                }),
                defineField({
                  name: 'variant',
                  title: 'Variant',
                  type: 'string',
                  options: {
                    list: [
                      { title: 'Primary', value: 'primary' },
                      { title: 'Secondary', value: 'secondary' },
                    ],
                  },
                }),
              ],
            },
          ],
        }),

        // Screenshots on the right
        defineField({
          name: 'screenshots',
          title: 'Screenshots Section',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                defineField({
                  name: 'image',
                  title: 'Screenshot Image',
                  type: 'richImage',
                  validation: (Rule) => Rule.required(),
                }),
                defineField({
                  name: 'caption',
                  title: 'Caption (optional)',
                  type: 'string',
                }),
              ],
            },
          ],
        }),

        // Blog button at the bottom
        defineField({
          name: 'blogButton',
          title: 'Blog Button',
          type: 'object',
          fields: [
            defineField({
              name: 'label',
              type: 'string',
              title: 'Label',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'href',
              type: 'url',
              title: 'Link',
              validation: (Rule) => Rule.required(),
            }),
          ],
        }),

        // Optional background image for entire hero section
        defineField({
          name: 'backgroundImage',
          type: 'richImage',
          title: 'Background Image',
        }),
      ],
    }), // ← ✅ this comma is important

    // Flexible content builder
    defineField({
      name: 'sections',
      title: 'Sections',
      type: 'array',
      of: [
        { type: 'theProblemSection' },
        { type: 'theSolutionSection' },
        { type: 'resultBenefitSection' },
        { type: 'ghlServicesSection' },
        { type: 'devIntegrationSection' },
        { type: 'crmMigrationSection' },
        // { type: 'socialProofSection' },
        { type: 'howItWorksSection' },
        { type: 'includesSection' },
        { type: 'logosSection' },
        { type: 'testimonialSection' },
        { type: 'shortCaseStudiesSection' },
        { type: 'faqSection' },
        { type: 'ctaSection' },
        // { type: 'getQuoteSection' },
        // { type: 'bottomSection' },
        { type: 'footerSection' },
      ],
    }),


    // Optional flags
    defineField({
      name: 'isFeatured',
      title: 'Show on /landing index',
      type: 'boolean',
      initialValue: true,
    }),
  ],

  preview: {
    select: { title: 'title', subtitle: 'type', media: 'hero.backgroundImage' },
    prepare({ title, subtitle, media }) {
      return {
        title,
        subtitle: subtitle ? subtitle.toUpperCase() : 'Landing',
        media,
      }
    },
  },
})
