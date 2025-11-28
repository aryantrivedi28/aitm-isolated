import { defineType, defineField } from "sanity";

export const devIntegrationSection = defineType({
  name: "devIntegrationSection",
  title: "Development & Integration Section",
  type: "object",
  fields: [
    defineField({
      name: "heading",
      title: "Heading",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "subheading",
      title: "Subheading",
      type: "text",
    }),
    defineField({
      name: "items",
      title: "Services / Features",
      type: "array",
      of: [
        defineField({
          name: "item",
          title: "Item",
          type: "object",
          fields: [
            defineField({
              name: "title",
              title: "Title",
              type: "string",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "description",
              title: "Description",
              type: "text",
            }),
          ],
        }),
      ],
    }),
  ],
  preview: {
    select: { title: "heading" },
  },
});
