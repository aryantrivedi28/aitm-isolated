import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'richImage',
  title: 'Image',
  type: 'image',
  options: {hotspot: true},
  fields: [
    defineField({
      name: 'alt',
      title: 'Alt text',
      type: 'string',
      validation: (Rule) => Rule.required().error('Alt text improves accessibility & SEO'),
    }),
    defineField({name: 'caption', title: 'Caption', type: 'string'}),
    defineField({name: 'link', title: 'Link (optional)', type: 'url'}),
  ],
})
