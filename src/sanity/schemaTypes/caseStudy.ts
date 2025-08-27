// ./src/sanity/schemaTypes/caseStudy.ts
import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'caseStudy',
  title: 'Case Study',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'subtitle',
      title: 'Subtitle',
      type: 'string',
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{ type: 'string' }],
    }),
    defineField({
      name: 'mainImage',
      title: 'Main Image',
      type: 'image',
      options: { hotspot: true }
    }),

    // Video section
    defineField({
      name: 'video',
      title: 'Case Study Video',
      type: 'object',
      fields: [
        { name: 'videoUrl', title: 'Video URL (YouTube, Vimeo, etc.)', type: 'url' },
        { name: 'videoFile', title: 'Upload Video', type: 'file', options: { accept: 'video/*' } },
        { name: 'caption', title: 'Video Caption', type: 'string' },
      ],
    }),

    defineField({
      name: 'challenge',
      title: 'The Challenge',
      type: 'array',
      of: [{ type: 'block' }],
    }),
    defineField({
      name: 'finzieAdvantage',
      title: 'The Finzie Advantage',
      type: 'array',
      of: [{ type: 'block' }],
    }),
    defineField({
      name: 'teamMember',
      title: 'Team Member',
      type: 'object',
      fields: [
        { name: 'name', title: 'Name', type: 'string' },
        { name: 'role', title: 'Role', type: 'string' },
        { name: 'bio', title: 'Short Bio', type: 'text' },
        { name: 'image', title: 'Image', type: 'image', options: { hotspot: true } },
      ]
    }),
    defineField({
      name: 'snapshot',
      title: 'Snapshot Highlights',
      type: 'array',
      of: [{ type: 'string' }],
    }),
    defineField({
      name: 'testimonial',
      title: 'Testimonial',
      type: 'object',
      fields: [
        { name: 'quote', title: 'Quote', type: 'text' },
        { name: 'authorName', title: 'Author Name', type: 'string' },
        { name: 'authorRole', title: 'Author Role', type: 'string' },
        { name: 'image', title: 'Image', type: 'image', options: { hotspot: true } },
      ],
    }),
    defineField({
      name: 'callToActionText',
      title: 'Call to Action Text',
      type: 'string',
    }),
    defineField({
      name: 'callToActionButton',
      title: 'CTA Button',
      type: 'object',
      fields: [
        { name: 'text', title: 'Button Text', type: 'string', validation: Rule => Rule.required() },
        { name: 'link', title: 'Button Link', type: 'url', validation: Rule => Rule.required() },
      ],
    }),

    // ✅ Visibility + sorting controls
    defineField({
      name: 'isHidden',
      title: 'Hide this Case Study?',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'ranking',
      title: 'Ranking (lower = higher priority)',
      type: 'number',
      description: 'Use small numbers (e.g., 0, 1, 2). Lower number means it shows earlier.',
      validation: Rule => Rule.min(0).integer(),
    }),
    defineField({
      name: 'order',
      title: 'Order (tie-breaker, lower = earlier)',
      type: 'number',
      description: 'Used when rankings are equal. Lower number is shown earlier.',
      validation: Rule => Rule.min(0).integer(),
    }),
  ],

  // Nice Studio list ordering options
  orderings: [
    {
      title: 'By Ranking (Asc, lower first)',
      name: 'rankingAsc',
      by: [{ field: 'ranking', direction: 'asc' }, { field: 'order', direction: 'asc' }, { field: '_createdAt', direction: 'desc' }],
    },
    {
      title: 'By Order (Asc, lower first)',
      name: 'orderAsc',
      by: [{ field: 'order', direction: 'asc' }, { field: '_createdAt', direction: 'desc' }],
    },
    {
      title: 'Newest First',
      name: 'createdDesc',
      by: [{ field: '_createdAt', direction: 'desc' }],
    },
  ],

  preview: {
    select: {
      title: 'title',
      subtitle: 'subtitle',
      media: 'mainImage',
      isHidden: 'isHidden',
      ranking: 'ranking',
      order: 'order',
    },
    prepare({ title, subtitle, media, isHidden, ranking, order }) {
      const prefix = isHidden ? '🚫 ' : ''
      const sub = [
        subtitle || 'No subtitle',
        ranking != null ? `rank:${ranking}` : null,
        order != null ? `order:${order}` : null,
      ].filter(Boolean).join(' • ')
      return {
        title: `${prefix}${title}`,
        subtitle: sub,
        media,
      }
    },
  },
})
