import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'logosSection',
  title: 'Client Logos',
  type: 'object',
  fields: [
    defineField({
      name: 'heading',
      type: 'string',
      title: 'Heading',
      // no validation → optional
    }),
    defineField({
      name: 'logos',
      type: 'array',
      title: 'Logos',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'image',
              type: 'richImage',
              title: 'Logo',
              validation: (Rule) => Rule.required(), // image is mandatory
            }),
            defineField({
              name: 'name',
              type: 'string',
              title: 'Client Name',
              // optional → no validation
            }),
          ],
          preview: {
            select: { title: 'name', media: 'image' },
          },
        },
      ],
      validation: (Rule) => Rule.required().min(1), // at least one logo required
    }),
  ],
})
