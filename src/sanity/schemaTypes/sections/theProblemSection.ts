import { defineType, defineField } from "sanity";

export const theProblemSection = defineType({
  name: "theProblemSection",
  title: "The Problem Section",
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
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "paragraph",
      title: "Paragraph",
      type: "text",
      rows: 4,
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      title: "heading",
      subtitle: "subheading",
    },
  },
});
