import { defineType, defineField } from "sanity"

export default defineType({
  name: "howWeWorkSection",
  title: "How We Work Section",
  type: "object",
  fields: [
    defineField({
      name: "title",
      type: "string",
      title: "Title",
    }),

    defineField({
      name: "steps",
      title: "Steps",
      type: "array",
      description: "Add each step of the process (e.g. Discovery Call, Proposal, etc.)",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "stepNumber",
              title: "Step Number",
              type: "number",
            }),
            defineField({
              name: "heading",
              title: "Step Title",
              type: "string",
            }),
            defineField({
              name: "subheading",
              title: "Short Subtitle / Quote",
              type: "string",
            }),
            defineField({
              name: "description",
              title: "Description",
              type: "text",
            }),
          ],
          preview: {
            select: {
              title: "heading",
              subtitle: "description",
            },
          },
        },
      ],
    }),

    defineField({
      name: "video",
      type: "url",
      title: "Left Side Video URL",
    }),

    defineField({
      name: "cta",
      title: "CTA Button",
      type: "object",
      fields: [
        defineField({ name: "label", type: "string", title: "Label" }),
        defineField({ name: "href", type: "url", title: "Link" }),
      ],
    }),
  ],
})
