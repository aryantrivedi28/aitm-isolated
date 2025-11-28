import { defineType, defineField } from "sanity";

export const theSolutionSection = defineType({
  name: "theSolutionSection",
  title: "The Solution Section",
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
      name: "solutions",
      title: "Solutions List",
      type: "array",
      of: [
        defineField({
          name: "solution",
          title: "Solution",
          type: "string",
          validation: (Rule) => Rule.required(),
        }),
      ],
      validation: (Rule) => Rule.min(1).required(),
    }),
  ],
  preview: {
    select: { title: "heading", subtitle: "subheading" },
  },
});
