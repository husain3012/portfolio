import { defineArrayMember, defineField, defineType } from "sanity";

export const researchPaper = defineType({
  name: "researchPaper",
  title: "Research Paper",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title" },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "abstract",
      title: "Abstract",
      type: "text",
      rows: 4,
      validation: (rule) => rule.required(),
    }),
    defineField({ name: "venue", title: "Venue", type: "string" }),
    defineField({ name: "publishedAt", title: "Published At", type: "date" }),
    defineField({
      name: "authors",
      title: "Authors",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
    }),
    defineField({
      name: "tags",
      title: "Tags",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
    }),
    defineField({
      name: "featured",
      title: "Featured",
      type: "boolean",
      initialValue: false,
    }),
    defineField({ name: "paperUrl", title: "Paper URL", type: "url" }),
    defineField({
      name: "paperFile",
      title: "Paper PDF",
      type: "file",
      description: "Upload a PDF for unpublished or internally shared research papers.",
      options: { accept: ".pdf" },
    }),
    defineField({ name: "codeUrl", title: "Code URL", type: "url" }),
    defineField({
      name: "coverImage",
      title: "Cover Image",
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({ name: "alt", title: "Alt Text", type: "string" }),
      ],
    }),
    defineField({
      name: "body",
      title: "Paper Details",
      type: "array",
      of: [
        defineArrayMember({ type: "block" }),
        defineArrayMember({ type: "image", options: { hotspot: true } }),
      ],
    }),
  ],
  preview: {
    select: { title: "title", subtitle: "venue", media: "coverImage" },
  },
});