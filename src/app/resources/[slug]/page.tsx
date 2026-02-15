// src/app/resources/[slug]/page.tsx

import { client } from '@/src/sanity/lib/client'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { urlFor } from '@/src/sanity/lib/image'
import BlogContent from '../../../components/blog/BlogContent'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

interface BlogPost {
  _id: string
  title: string
  slug: { current: string }
  excerpt: string
  featuredImage: any
  sections: any[]
  finalThoughts: string[]
  category: string
  readTime: number
}

/* =========================
   FETCH SINGLE POST
========================= */

async function getPost(slug: string): Promise<BlogPost | null> {
  if (!slug) return null

  const query = `
  *[_type == "blogPost" && slug.current == $slug][0] {
    _id,
    _type,
    title,
    slug,
    excerpt,
    featuredImage,
    publishedAt,
    category,
    readTime,
    finalThoughts,

    sections[] {
      _key,
      heading,
      paragraphs,
      subsections[] {
        _key,
        subheading,
        content,
        listItems
      },
      tables[] {
        _key,
        hasHeader,
        rows[] {
          _key,
          cells
        }
      }
    }
  }
`

  return await client.fetch(query, { slug })
}

/* =========================
   FETCH ALL SLUGS
========================= */

async function getAllPosts() {
  const query = `*[_type == "blogPost" && defined(slug.current)] { slug }`
  return await client.fetch(query)
}

export const revalidate = 3600

/* =========================
   DYNAMIC METADATA
========================= */

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>  // Change: params is a Promise
}) {
  const { slug } = await params  // Change: await params to get slug
  const post = await getPost(slug)

  if (!post) {
    return {
      title: 'Post Not Found',
      description: 'The requested blog post could not be found.',
    }
  }

  return {
    title: `${post.title} | Finzie Blog`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
    },
  }
}

/* =========================
   STATIC PARAMS (SSG)
========================= */

export async function generateStaticParams() {
  const posts = await getAllPosts()

  return posts.map((post: any) => ({
    slug: post.slug.current,
  }))
}

/* =========================
   BLOG PAGE
========================= */

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>  // Change: params is a Promise
}) {
  const { slug } = await params  // Change: await params to get slug
  const post = await getPost(slug)

  if (!post) {
    notFound()
  }

  return (
    <article className="min-h-screen bg-[#faf4e5]">

      {/* Hero Section */}
      <section className="py-8 md:py-12 lg:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Back Button */}
          <div className="mb-6 md:mb-8">
            <Link
              href="/resources"
              className="inline-flex items-center gap-2 text-[#31302f] hover:text-[#f7af00] transition-colors group"
            >
              <ArrowLeft className="w-4 h-4 md:w-5 md:h-5 group-hover:-translate-x-1 transition-transform" />
              <span className="text-sm md:text-base font-medium">
                Back to Resources
              </span>
            </Link>
          </div>

          {/* Category */}
          {post.category && (
            <div className="mb-4 md:mb-6 text-center">
              <span className="inline-block px-4 py-1.5 bg-[#f7af00]/10 text-[#f7af00] text-sm font-semibold rounded-full border border-[#f7af00]/20">
                {post.category}
              </span>
            </div>
          )}

          {/* Title */}
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-medium text-[#050504] mb-6 text-center leading-tight">
            {post.title}
          </h1>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 lg:pb-20">

        {/* Featured Image */}
        {post.featuredImage && (
          <div className="mb-10 rounded-xl overflow-hidden shadow-lg">
            <div className="relative aspect-[16/9]">
              <Image
                src={urlFor(post.featuredImage).url() || "/placeholder.svg"}
                alt={post.title}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 800px"
                priority
              />
            </div>
          </div>
        )}

        {/* Excerpt */}
        {post.excerpt && (
          <div className="mb-12 bg-[#f0eadd] p-6 rounded-xl border-l-4 border-[#f7af00]">
            <p className="text-lg text-[#31302f] italic leading-relaxed">
              "{post.excerpt}"
            </p>
          </div>
        )}

        {/* Blog Content */}
        <div className="mb-16">
          <BlogContent
            sections={post.sections}
            finalThoughts={post.finalThoughts}
          />
        </div>

        {/* CTA */}
        <div className="bg-[#f0eadd] p-8 rounded-xl text-center">
          <h3 className="text-2xl font-medium text-[#050504] mb-4">
            Enjoyed this article?
          </h3>
          <p className="text-[#31302f] mb-6">
            Subscribe to our newsletter for more insights.
          </p>

          <Link
            href="/resources"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#f7af00] text-[#050504] font-semibold rounded-lg hover:bg-[#f7af00]/30 hover:text-[#31302f] transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Resources
          </Link>
        </div>

      </div>
    </article>
  )
}