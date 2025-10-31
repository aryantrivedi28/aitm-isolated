import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'faqSection',
  title: 'FAQs',
  type: 'object',
  fields: [
    defineField({
      name: 'faqs',
      title: 'Q&A',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'question',
              type: 'string',
              title: 'Question',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'answer',
              type: 'text',
              title: 'Answer',
              validation: (Rule) => Rule.required(),
            }),
          ],
        },
      ],
    }),
  ],
})
