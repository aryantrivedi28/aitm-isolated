import { defineType, defineField } from "sanity"

export default defineType({
  name: "aboutUsSection",
  title: "About Us Section",
  type: "object",
  fields: [
    defineField({ name: "title", type: "string", title: "Title" }),
    defineField({ name: "description", type: "text", title: "Description" }),
    defineField({ name: "image", type: "image", title: "Right Side Image" }),
    defineField({
      name: "cta",
      title: "CTA",
      type: "object",
      fields: [
        defineField({ name: "label", type: "string", title: "Label" }),
        defineField({ name: "href", type: "url", title: "Link" }),
      ],
    }),
  ],
})
