import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'ctaSection',
  title: 'CTA Block',
  type: 'object',
  fields: [
    defineField({name: 'title', type: 'string', title: 'Title', validation: (Rule) => Rule.required()}),
    defineField({name: 'subtitle', type: 'text', title: 'Subtitle'}),
    defineField({
      name: 'buttons',
      title: 'Buttons',
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          defineField({name: 'label', type: 'string', title: 'Label', validation: (Rule) => Rule.required()}),
          defineField({name: 'href', type: 'url', title: 'Link', validation: (Rule) => Rule.required()}),
        ],
      }],
      validation: (Rule) => Rule.min(1),
    }),
    defineField({name: 'background', title: 'Background Image (optional)', type: 'richImage'}),
  ],
})
