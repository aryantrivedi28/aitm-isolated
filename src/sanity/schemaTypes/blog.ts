// sanity-studio/schemas/blogPost.ts
export default {
  name: 'blogPost',
  title: 'Blog Post',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule: any) => Rule.required()
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule: any) => Rule.required()
    },
    {
      name: 'featuredImage',
      title: 'Featured Image',
      type: 'image',
      options: {
        hotspot: true,
      },
    },
    {
      name: 'excerpt',
      title: 'Excerpt',
      type: 'text',
      rows: 3,
      description: 'Short summary shown on blog listing'
    },
    {
      name: 'sections',
      title: 'Blog Sections',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'section',
          fields: [
            {
              name: 'heading',
              title: 'Heading',
              type: 'string',
              description: 'H2 heading (## in markdown)'
            },
            {
              name: 'paragraphs',
              title: 'Paragraphs',
              type: 'array',
              of: [{ type: 'text', rows: 4 }],
              description: 'Multiple paragraphs for this section'
            },
            {
              name: 'subsections',
              title: 'Sub-sections',
              type: 'array',
              of: [
                {
                  type: 'object',
                  fields: [
                    {
                      name: 'subheading',
                      title: 'Sub-heading',
                      type: 'string',
                      description: 'Sub-heading within section'
                    },
                    {
                      name: 'content',
                      title: 'Content',
                      type: 'array',
                      of: [{ type: 'text', rows: 3 }]
                    },
                    {
                      name: 'listItems',
                      title: 'List Items',
                      type: 'array',
                      of: [{ type: 'string' }],
                      description: 'Bullet points/lists'
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    },
    {
      name: 'finalThoughts',
      title: 'Final Thoughts',
      type: 'array',
      of: [{ type: 'text', rows: 3 }]
    },
    {
      name: 'publishedAt',
      title: 'Published Date',
      type: 'datetime',
      validation: (Rule: any) => Rule.required()
    },
    {
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'Shopify', value: 'shopify' },
          { title: 'Migration', value: 'migration' },
          { title: 'E-commerce', value: 'ecommerce' },
          { title: 'CRO', value: 'cro' },
          { title: 'SEO', value: 'seo' }
        ]
      }
    },
    {
      name: 'readTime',
      title: 'Read Time (minutes)',
      type: 'number'
    }
  ],
  preview: {
    select: {
      title: 'title',
      media: 'featuredImage'
    }
  }
}