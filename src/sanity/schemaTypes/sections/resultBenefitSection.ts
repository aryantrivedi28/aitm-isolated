import { defineType, defineField } from "sanity";

export const resultBenefitSection = defineType({
  name: "resultBenefitSection",
  title: "Result & Benefit Section",
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
      name: "benefits",
      title: "Benefits List",
      type: "array",
      of: [
        defineField({
          name: "benefit",
          title: "Benefit",
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
