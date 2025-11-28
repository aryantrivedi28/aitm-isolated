import { defineType, defineField } from "sanity";

export const ghlServicesSection = defineType({
  name: "ghlServicesSection",
  title: "GHL Services Section",
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
      name: "services",
      title: "Services List",
      type: "array",
      of: [
        defineField({
          name: "service",
          title: "Service",
          type: "object",
          fields: [
            defineField({
              name: "title",
              title: "Service Title",
              type: "string",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "description",
              title: "Service Description",
              type: "text",
            }),
          ],
          preview: {
            select: {
              title: "title",
            },
          },
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: "heading",
    },
  },
});
