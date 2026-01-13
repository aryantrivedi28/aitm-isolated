// schemas/formConfig.js
export default {
  name: 'formConfig',
  title: 'Form Configuration',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Form Name',
      type: 'string',
      description: 'e.g., "Shopify Form", "GHL Form"'
    },
    {
      name: 'type',
      title: 'Form Type',
      type: 'string',
      options: {
        list: [
          { title: 'GoHighLevel Form', value: 'ghl' },
          { title: 'Shopify Form', value: 'shopify' },
          { title: 'General Form', value: 'general' }
        ]
      }
    },
    {
      name: 'title',
      title: 'Form Title',
      type: 'string',
      initialValue: 'Get Your Free Consultation'
    },
    {
      name: 'description',
      title: 'Form Description',
      type: 'text',
      rows: 2,
      initialValue: 'Fill out this form and our experts will contact you within 24 hours.'
    },
    {
      name: 'additionalFields',
      title: 'Additional Fields',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'fieldType',
              title: 'Field Type',
              type: 'string',
              options: {
                list: [
                  { title: 'Select Dropdown', value: 'select' },
                  { title: 'Checkbox Group', value: 'checkbox' },
                  { title: 'Radio Group', value: 'radio' },
                  { title: 'Text Input', value: 'text' },
                  { title: 'Textarea', value: 'textarea' }
                ]
              }
            },
            {
              name: 'label',
              title: 'Field Label',
              type: 'string'
            },
            {
              name: 'name',
              title: 'Field Name (for form data)',
              type: 'string',
              description: 'Use lowercase with underscores, e.g., "monthly_revenue"'
            },
            {
              name: 'required',
              title: 'Required Field?',
              type: 'boolean',
              initialValue: false
            },
            {
              name: 'options',
              title: 'Options (for select/checkbox/radio)',
              type: 'array',
              of: [{ type: 'string' }],
              hidden: ({ parent }: { parent?: any }) => !['select', 'checkbox', 'radio'].includes(parent?.fieldType)
            },
            {
              name: 'placeholder',
              title: 'Placeholder Text',
              type: 'string',
              hidden: ({ parent }: { parent?: any }) => !['text', 'textarea'].includes(parent?.fieldType)
            }
          ]
        }
      ]
    }
  ]
}