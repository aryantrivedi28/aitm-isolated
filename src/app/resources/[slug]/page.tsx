// src/app/resources/[slug]/page.tsx

import { client } from '@/src/sanity/lib/client'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { urlFor } from '@/src/sanity/lib/image'
import BlogContent from '../../../components/blog/BlogContent'
import Link from 'next/link'
import { Calendar, Clock, ArrowLeft } from 'lucide-react'

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

  return (
    <article className="min-h-screen bg-[#faf4e5]">
      {/* Hero Section */}
      <section className="bg-[#faf4e5] py-8 md:py-12 lg:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button - Mobile First */}
          <div className="mb-6 md:mb-8">
            <Link
              href="/resources"
              className="inline-flex items-center gap-2 text-[#31302f] hover:text-[#f7af00] transition-colors group"
            >
              <ArrowLeft className="w-4 h-4 md:w-5 md:h-5 group-hover:-translate-x-1 transition-transform" />
              <span className="text-sm md:text-base font-medium">Back to Resources</span>
            </Link>
          </div>

          <div className="text-center">
            {/* Category Badge */}
            <div className="mb-4 md:mb-6">
              <span className="inline-block px-3 py-1 md:px-4 md:py-1.5 bg-[#f7af00]/10 text-[#f7af00] text-xs md:text-sm font-semibold rounded-full border border-[#f7af00]/20">
                {post.category}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-medium text-[#050504] mb-4 md:mb-6 leading-tight">
              {post.title}
            </h1>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 md:pb-16 lg:pb-20">
        {/* Featured Image */}
        {post.featuredImage && (
          <div className="mb-8 md:mb-12 rounded-lg md:rounded-xl overflow-hidden shadow-lg">
            <div className="relative w-full bg-gray-200">
              <div className="relative aspect-[16/9] md:aspect-[21/9]">
                <Image
                  src={urlFor(post.featuredImage).url() || "/placeholder.svg"}
                  alt={post.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, (max-width: 768px) 90vw, (max-width: 1024px) 85vw, 800px"
                  priority={true}
                />
              </div>
            </div>
          </div>
        )}

        {/* Excerpt */}
        {post.excerpt && (
          <div className="mb-8 md:mb-12 bg-[#f0eadd] p-4 md:p-6 rounded-lg md:rounded-xl border-l-4 border-[#f7af00]">
            <p className="text-base md:text-lg lg:text-xl text-[#31302f] italic leading-relaxed">
              "{post.excerpt}"
            </p>
          </div>
        )}

        {/* Content */}
        <div className="mb-12 md:mb-16">
          <BlogContent sections={post.sections} finalThoughts={post.finalThoughts} />
        </div>



        {/* CTA Section */}
        <div className="bg-[#f0eadd] p-6 md:p-8 lg:p-10 rounded-lg md:rounded-xl text-center mb-12">
          <h3 className="text-xl md:text-2xl lg:text-3xl font-medium text-[#050504] mb-3 md:mb-4">
            Enjoyed this article?
          </h3>
          <p className="text-[#31302f] mb-6 md:mb-8 text-sm md:text-base lg:text-lg">
            Subscribe to our newsletter for more insights.
          </p>
          
          {/* Newsletter Form */}
          <div className="max-w-md mx-auto mb-6 md:mb-8">
            <form className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg border border-[#31302f]/20 focus:outline-none focus:border-[#f7af00] text-[#31302f] text-sm md:text-base"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-[#f7af00] text-[#050504] font-semibold rounded-lg hover:bg-[#f7af00]/30 hover:text-[#31302f] transition-colors text-sm md:text-base whitespace-nowrap"
              >
                Subscribe
              </button>
            </form>
          </div>

          <Link
            href="/resources"
            className="inline-flex items-center gap-2 px-6 py-3 md:px-8 md:py-4 bg-[#f7af00] text-[#050504] font-semibold rounded-lg hover:bg-[#f7af00]/30 hover:text-[#31302f] transition-colors border border-[#f0eadd] text-sm md:text-base group"
          >
            <ArrowLeft className="w-4 h-4 md:w-5 md:h-5 group-hover:-translate-x-1 transition-transform" />
            Back to Resources
          </Link>
        </div>
      </div>
    </article>
  )
}