import { defineType, defineField } from "sanity"

export default defineType({
  name: "howWeWorkSection",
  title: "How We Work Section",
  type: "object",
  fields: [
    defineField({ name: "title", type: "string", title: "Title" }),
    defineField({ name: "info", type: "text", title: "Right Side Info" }),
    defineField({
      name: "cta",
      title: "CTA Button",
      type: "object",
      fields: [
        defineField({ name: "label", type: "string", title: "Label" }),
        defineField({ name: "href", type: "url", title: "Link" }),
      ],
    }),
    defineField({ name: "video", type: "url", title: "Left Side Video URL" }),
  ],
})
