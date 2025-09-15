// ./schemas/sections/testimonialSection.ts
import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'testimonialSection',
  title: 'Testimonial Section',
  type: 'object',
  fields: [
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
    }),
    defineField({
      name: 'testimonials',
      title: 'Testimonials',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'quote',
              title: 'Quote',
              type: 'text',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'authorName',
              title: 'Author Name',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'authorTitle',
              title: 'Author Title / Company',
              type: 'string',
            }),
            defineField({
              name: 'authorImage',
              title: 'Author Image',
              type: 'richImage', // or just 'image' if you don’t have richImage defined
            }),
          ],
          preview: {
            select: { title: 'authorName', subtitle: 'authorTitle', media: 'authorImage' },
          },
        },
      ],
    }),
  ],
  preview: {
    select: { title: 'heading', testimonials: 'testimonials' },
    prepare({ title, testimonials }) {
      return {
        title: title || 'Testimonials',
        subtitle: testimonials ? `${testimonials.length} testimonial(s)` : 'No testimonials yet',
      }
    },
  },
})
