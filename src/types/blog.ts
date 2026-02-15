// types/blog.ts

export interface BlogTableRow {
  _key?: string
  cells: string[]
}

export interface BlogTable {
  _key?: string
  hasHeader?: boolean
  rows: BlogTableRow[]
}

export interface BlogSubsection {
  _key: string
  subheading?: string
  content?: string[]
  listItems?: string[]
}

export interface BlogSection {
  _key: string
  heading: string
  paragraphs?: string[]
  subsections?: BlogSubsection[]

  // ✅ NEW
  tables?: BlogTable[]
}

export interface BlogPost {
  _id: string
  _type: 'blogPost'
  title: string
  slug: {
    current: string
  }
  excerpt?: string
  featuredImage?: any
  sections: BlogSection[]
  finalThoughts?: string[]
  publishedAt: string
  category?: string
  readTime?: number
}
