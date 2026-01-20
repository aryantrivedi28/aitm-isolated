// types/blog.ts
export interface BlogSection {
  _key: string;
  heading: string;
  paragraphs?: string[];
  subsections?: BlogSubsection[];
}

export interface BlogSubsection {
  _key: string;
  subheading?: string;
  content?: string[];
  listItems?: string[];
}

export interface BlogPost {
  _id: string;
  _type: 'blogPost';
  title: string;
  slug: {
    current: string;
  };
  excerpt?: string;
  featuredImage?: any;
  sections: BlogSection[];
  finalThoughts?: string[];
  publishedAt: string;
  category?: string;
  readTime?: number;
}