import { defineType, defineField } from "sanity"

export default defineType({
  name: "whatWeDoSection",
  title: "What We Do Section",
  type: "object",
  fields: [
    defineField({
      name: "heading",
      type: "string",
      title: "Heading",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "cards",
      title: "Cards",
      type: "array",
      of: [
        {
          type: "object",
          title: "Card",
          fields: [
            defineField({
              name: "title",
              type: "string",
              title: "Card Title",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "description",
              type: "text",
              title: "Card Description",
            }),
          ],
        },
      ],
    }),
    defineField({
      name: "ctas",
      title: "CTA Buttons",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "label",
              type: "string",
              title: "Button Label",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "href",
              type: "url",
              title: "Button Link",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "variant",
              title: "Variant",
              type: "string",
              options: {
                list: [
                  { title: "Primary", value: "primary" },
                  { title: "Secondary", value: "secondary" },
                ],
              },
            }),
          ],
        },
      ],
    }),
  ],
})
