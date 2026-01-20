import { client } from '@/src/sanity/lib/client'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { urlFor } from '@/src/sanity/lib/image'
import { BlogPost } from '../../../types/blog'
import BlogContent from '../../../components/blog/BlogContent'


interface BlogPostPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: BlogPostPageProps) {
  const { slug } = await params
  const post = await client.fetch(`
    *[_type == "blogPost" && slug.current == $slug][0] {
      title,
      excerpt,
      featuredImage
    }
  `, { slug })

  if (!post) {
    return {
      title: 'Post Not Found',
      description: 'The requested blog post could not be found.',
    }
  }

  const description = post.excerpt || post.title

  return {
    title: `${post.title} | Blog`,
    description: description,
    openGraph: {
      title: post.title,
      description: description,
      images: post.featuredImage ? [urlFor(post.featuredImage).url()] : [],
      type: 'article',
    },
  }
}

export async function generateStaticParams() {
  const posts = await client.fetch(`
    *[_type == "blogPost"] {
      "slug": slug.current
    }
  `)

  return posts.map((post: { slug: string }) => ({
    slug: post.slug,
  }))
}

// Updated Hero Section Component with post title
function HeroSection({ title }: { title: string }) {
  return (
    <section className="relative bg-[#faf4e5] overflow-hidden">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 lg:py-32">
        <div className="text-center">

          <h1 className="text-2xl md:text-4xl lg:text-5xl font-medium text-[#050504] mb-6 tracking-tight leading-tight">
            {title}
          </h1>

          <div className="inline-flex items-center gap-2 px-6 py-2 bg-white/50 backdrop-blur-sm rounded-full shadow-sm mb-8">
            <span className="w-2 h-2 bg-[#f7af00] rounded-full animate-pulse"></span>
            <span className="text-sm font-medium text-[#31302f]">Blog Article</span>
          </div>
        </div>
      </div>
    </section>
  )
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params

  const post: BlogPost = await client.fetch(`
    *[_type == "blogPost" && slug.current == $slug][0] {
      _id,
      title,
      slug,
      excerpt,
      featuredImage,
      sections[] {
        _key,
        heading,
        paragraphs,
        subsections[] {
          _key,
          subheading,
          content,
          listItems
        }
      },
      finalThoughts,
      publishedAt,
      category,
      readTime
    }
  `, { slug })

  if (!post) {
    notFound()
  }

  const formattedDate = new Date(post.publishedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  return (
    <article className="min-h-screen bg-[#faf4e5]">
      {/* Hero Section with post title */}
      <HeroSection title={post.title} />

      {/* Main Content Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-10">
        {/* Featured Image Card */}
        {post.featuredImage && (
          <div className="mb-10">
            <div className="relative h-64 md:h-80 lg:h-96 rounded-2xl overflow-hidden shadow-2xl transform hover:scale-[1.02] transition-transform duration-300">
              <Image
                src={urlFor(post.featuredImage).url()}
                alt={post.title}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1024px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#050504]/70 via-transparent to-transparent" />
              
              {/* Floating category badge */}
              {post.category && (
                <div className="absolute top-6 right-6">
                  <span className="inline-block px-4 py-2 bg-[#f7af00] text-[#050504] text-sm font-bold rounded-full shadow-lg backdrop-blur-sm">
                    {post.category}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Excerpt Card */}
        {post.excerpt && (
          <div className="mb-12 relative">
            <div className="bg-[#f7af00] to-transparent p-1 rounded-2xl">
              <div className="bg-[#f0eadd] backdrop-blur-sm p-6 md:p-8 rounded-2xl border-l-4 border-[#f7af00] shadow-lg">
                <div className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-[#f7af00] flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z" />
                  </svg>
                  <p className="text-lg md:text-xl text-[#31302f] italic leading-relaxed">
                    "{post.excerpt}"
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="bg-[#f0eadd] backdrop-blur-sm rounded-3xl p-6 md:p-8 mb-12 border border-white/50">
          <BlogContent
            sections={post.sections}
            finalThoughts={post.finalThoughts}
          />
        </div>

        {/* Final CTA Section */}
        <div className="mb-16 text-center">
          <div className="bg-[#f7af00] rounded-2xl p-8 md:p-10">
            <h3 className="text-2xl md:text-3xl font-bold text-[#050504] mb-4">
              Enjoyed this article?
            </h3>
            <p className="text-[#050504]/80 mb-6 max-w-2xl mx-auto">
              Share it with your network or explore more insights from our blog.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <a
                href="/blog"
                className="px-6 py-3 bg-white text-[#050504] font-bold rounded-xl hover:bg-[#050504] hover:text-white transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                ← Back to Blog
              </a>
              <button className="px-6 py-3 bg-[#050504] text-white font-bold rounded-xl hover:bg-white hover:text-[#050504] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                Share Article
              </button>
            </div>
          </div>
        </div>

        {/* Related Posts Section */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-[#050504]">
              Continue Reading
            </h2>
            <a href="/blog" className="text-[#f7af00] hover:text-[#050504] transition-colors font-medium">
              View all →
            </a>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="group cursor-pointer">
                <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-white/50">
                  <div className="h-48 bg-gradient-to-r from-[#f7af00]/20 to-[#f7af00]/40 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-[#050504]/10 to-transparent"></div>
                    <div className="absolute top-4 right-4">
                      <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-[#050504] text-xs font-bold rounded-full">
                        Category
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="font-bold text-[#050504] mb-3 line-clamp-2 group-hover:text-[#f7af00] transition-colors">
                      Related article title goes here with multiple lines if needed
                    </h3>
                    <p className="text-sm text-[#31302f] line-clamp-3 mb-4">
                      A brief excerpt from the related article that gives readers a preview of what to expect...
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-[#31302f]/60">5 min read</span>
                      <span className="text-[#f7af00] group-hover:translate-x-2 transition-transform">
                        Read →
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="mb-16 bg-gradient-to-br from-[#faf4e5] to-white rounded-2xl p-8 border border-[#f7af00]/20 shadow-lg">
          <div className="text-center">
            <svg className="w-12 h-12 mx-auto text-[#f7af00] mb-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
            </svg>
            <h3 className="text-2xl font-bold text-[#050504] mb-2">Stay Updated</h3>
            <p className="text-[#31302f] mb-6 max-w-md mx-auto">
              Get the latest articles and insights delivered directly to your inbox.
            </p>
            <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 bg-white/50 backdrop-blur-sm rounded-xl border border-[#f7af00]/30 focus:outline-none focus:ring-2 focus:ring-[#f7af00] focus:border-transparent"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-gradient-to-r from-[#f7af00] to-[#ffcc33] text-[#050504] font-bold rounded-xl hover:shadow-lg transition-shadow"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>
    </article>
  )
}