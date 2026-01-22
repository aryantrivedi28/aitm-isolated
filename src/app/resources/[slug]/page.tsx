// src/app/resources/[slug]/page.tsx

import { client } from '@/src/sanity/lib/client'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { urlFor } from '@/src/sanity/lib/image'
// import { BlogPost } from '../../../types/blog'
import BlogContent from '../../../components/blog/BlogContent'
import Link from 'next/link'


interface BlogPost {
  _id: string
  title: string
  slug: { current: string }
  excerpt: string
  featuredImage: any
  sections: any[]
  finalThoughts: string[]
  publishedAt: string
  category: string
  readTime: number
}

async function getPost(slug: string): Promise<BlogPost | null> {
  const query = `
    *[_type == "blogPost" && slug.current == $slug][0] {
      _id,
      title,
      slug,
      excerpt,
      featuredImage,
      sections,
      finalThoughts,
      publishedAt,
      category,
      readTime
    }
  `

  const post = await client.fetch(query, { slug })
  return post
}

async function getAllPosts() {
  const query = `*[_type == "blogPost"] { slug }`
  const posts = await client.fetch(query)
  return posts
}

export const revalidate = 3600

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = await getPost(slug)

  if (!post) {
    return {
      title: 'Post Not Found',
      description: 'The requested blog post could not be found.',
    }
  }

  return {
    title: `${post.title} | Blog`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
    },
  }
}

export async function generateStaticParams() {
  const posts = await getAllPosts()
  return posts.map((post: any) => ({
    slug: post.slug.current,
  }))
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = await getPost(slug)

  if (!post) {
    notFound()
  }

  const formattedDate = new Date(post.publishedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <article className="min-h-screen bg-[#faf4e5]">
      {/* Hero Section */}
      <section className="bg-[#faf4e5] py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-[#f7af00] font-semibold mb-4">{post.category}</p>
            <h1 className="text-4xl md:text-5xl font-bold text-[#050504] mb-6">
              {post.title}
            </h1>
            <div className="flex flex-wrap justify-center gap-4 text-[#31302f] text-sm">
              <span>{formattedDate}</span>
              <span>•</span>
              <span>{post.readTime || 5} min read</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Featured Image */}
        {post.featuredImage && (
          <div className="mb-12 rounded-xl overflow-hidden shadow-lg">
            <div className="relative w-full bg-gray-200" style={{ paddingBottom: '56.25%' }}>
              <Image
                src={urlFor(post.featuredImage).url() || "/placeholder.svg"}
                alt={post.title}
                fill
                className="absolute top-0 left-0 w-full h-full object-cover"
                priority={true}
              />
            </div>
          </div>
        )}

        {/* Excerpt */}
        {post.excerpt && (
          <div className="mb-12 bg-[#f0eadd] p-6 rounded-lg border-l-4 border-[#f7af00]">
            <p className="text-lg text-[#31302f] italic">{`"${post.excerpt}"`}</p>
          </div>
        )}

        {/* Content */}
        <div className="mb-12">
          <BlogContent sections={post.sections} finalThoughts={post.finalThoughts} />
        </div>

        {/* CTA Section */}
        <div className="bg-[#f0eadd] p-8 rounded-lg text-center mb-12">
          <h3 className="text-2xl font-bold text-[#050504] mb-4">Enjoyed this article?</h3>
          <p className="text-[#31302f] mb-6">Share it with your network.</p>
          <Link
            href="/resources"
            className="inline-block px-6 py-3 bg-[#f7af00] text-[#050504] font-semibold rounded-lg hover:bg-[#050504] hover:text-white transition-colors"
          >
            ← Back to Blog
          </Link>
        </div>
      </div>
    </article>
  )
}
