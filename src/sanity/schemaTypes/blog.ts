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
      options: { hotspot: true },
    },
    {
      name: 'excerpt',
      title: 'Excerpt',
      type: 'text',
      rows: 3,
    },

    /* =========================
       BLOG SECTIONS
    ========================= */

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
            },
            {
              name: 'paragraphs',
              title: 'Paragraphs',
              type: 'array',
              of: [{ type: 'text', rows: 4 }],
            },

            /* ✅ NEW TABLE FIELD */
            {
              name: 'tables',
              title: 'Tables (Optional)',
              type: 'array',
              of: [
                {
                  type: 'object',
                  name: 'table',
                  fields: [
                    {
                      name: 'hasHeader',
                      title: 'Include Header Row?',
                      type: 'boolean',
                      initialValue: true,
                    },
                    {
                      name: 'rows',
                      title: 'Rows',
                      type: 'array',
                      of: [
                        {
                          type: 'object',
                          fields: [
                            {
                              name: 'cells',
                              title: 'Cells',
                              type: 'array',
                              of: [{ type: 'string' }],
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
              ],
            },

            /* EXISTING SUBSECTIONS */
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
                    },
                    {
                      name: 'content',
                      title: 'Content',
                      type: 'array',
                      of: [{ type: 'text', rows: 3 }],
                    },
                    {
                      name: 'listItems',
                      title: 'List Items',
                      type: 'array',
                      of: [{ type: 'string' }],
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
