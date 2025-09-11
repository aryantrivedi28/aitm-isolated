import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'whyUsSection',
  title: 'Why Us?',
  type: 'object',
  fields: [
    defineField({name: 'heading', type: 'string', title: 'Heading'}),
    defineField({
      name: 'reasons',
      title: 'Reasons',
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          defineField({name: 'title', type: 'string', title: 'Title'}),
          defineField({name: 'description', type: 'text', title: 'Description'}),
          defineField({name: 'icon', type: 'richImage', title: 'Icon / Badge'}),
        ],
      }],
    }),
  ],
})
