import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'howWeSolveSection',
  title: 'How We Solve It',
  type: 'object',
  fields: [
    defineField({name: 'heading', type: 'string', title: 'Heading'}),
    defineField({
      name: 'solutions',
      title: 'Solutions',
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          defineField({name: 'title', type: 'string', title: 'Title'}),
          defineField({name: 'description', type: 'text', title: 'Description'}),
          defineField({name: 'image', type: 'richImage', title: 'Image / Diagram'}),
        ],
      }],
    }),
  ],
})
