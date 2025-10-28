import { defineType, defineField } from "sanity"

export default defineType({
  name: "whatWeDoSection",
  title: "What We Do Section",
  type: "object",
  fields: [
    defineField({ name: "heading", type: "string", title: "Heading" }),
    defineField({ name: "description", type: "text", title: "Description" }),
    defineField({
      name: "points",
      title: "Key Points",
      type: "array",
      of: [{ type: "string" }],
    }),
  ],
})
