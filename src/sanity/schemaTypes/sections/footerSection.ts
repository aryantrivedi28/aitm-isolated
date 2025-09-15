import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'footerSection',
  title: 'Footer Section',
  type: 'object',
  fields: [
    defineField({
      name: 'text',
      type: 'string',
      title: 'Footer Text',
      description: 'e.g. "© 2025 Vittiki Tech LLP. All rights reserved."',
      validation: Rule => Rule.required(),
    }),
  ],
  preview: {
    select: { title: 'text' },
    prepare({ title }) {
      return { title: title || 'Footer Section' }
    },
  },
})
