import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'painPointsSection',
  title: 'Pain Points',
  type: 'object',
  fields: [
    defineField({name: 'heading', type: 'string', title: 'Heading'}),
    defineField({
      name: 'items',
      title: 'Pain Points',
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          defineField({name: 'title', type: 'string', title: 'Title'}),
          defineField({name: 'description', type: 'text', title: 'Description'}),
          defineField({name: 'icon', type: 'richImage', title: 'Icon / Image'}),
        ],
      }],
    }),
  ],
})
