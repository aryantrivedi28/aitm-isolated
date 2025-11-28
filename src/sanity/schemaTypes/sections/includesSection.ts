import { defineType, defineField } from "sanity";

export const includesSection = defineType({
  name: "includesSection",
  title: "Includes Section",
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
      title: "Included Items",
      type: "array",
      of: [
        defineField({
          name: "itemText",
          title: "Item Text",
          type: "string",
          validation: (Rule) => Rule.required(),
        }),
      ],
    }),
  ],
  preview: {
    select: { title: "heading" },
  },
});
