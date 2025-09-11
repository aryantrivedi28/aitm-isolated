import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'howItWorksSection',
  title: 'How It Works',
  type: 'object',
  fields: [
    defineField({name: 'heading', type: 'string', title: 'Heading'}),
    defineField({
      name: 'steps',
      title: 'Steps',
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          defineField({name: 'title', type: 'string', title: 'Step Title'}),
          defineField({name: 'description', type: 'text', title: 'Step Description'}),
          defineField({name: 'image', type: 'richImage', title: 'Icon / Illustration'}),
        ],
      }],
      validation: (Rule) => Rule.min(2),
    }),
  ],
})
// This schema defines a "How It Works" section with a heading and an array of steps.