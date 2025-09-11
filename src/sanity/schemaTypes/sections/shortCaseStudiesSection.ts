import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'shortCaseStudiesSection',
  title: 'Short Case Studies',
  type: 'object',
  fields: [
    defineField({name: 'heading', type: 'string', title: 'Heading'}),
    defineField({
      name: 'caseStudies',
      type: 'array',
      title: 'Case Studies',
      of: [{ type: 'reference', to: [{ type: 'caseStudy' }] }],
      validation: (Rule) => Rule.unique(),
    }),
  ],
})
