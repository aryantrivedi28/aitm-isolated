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

// Hero Section Component
function HeroSection() {
  return (
    <section className="relative bg-[#faf4e5] overflow-hidden">      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-24">
        <div className="text-center">
          {/* Icon decoration */}
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#f7af00]/20 mb-6">
            <svg 
              className="w-8 h-8 text-[#31302f]" 
              fill="currentColor" 
              viewBox="0 0 24 24"
            >
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#050504] mb-6 tracking-tight">
            Our <span className="text-[#31302f]">Blog</span>
          </h1>
          
          <p className="text-lg md:text-xl text-[#31302f] max-w-3xl mx-auto mb-8 leading-relaxed">
            Insights, stories, and perspectives from our team. 
            Discover articles on technology, design, and innovation.
          </p>
          
          {/* Stats bar */}
          <div className="inline-flex flex-wrap justify-center gap-6 md:gap-12 bg-[#f0eadd] px-6 py-4 rounded-2xl shadow-sm">
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-[#050504]">50+</div>
              <div className="text-sm text-[#31302f]">Articles</div>
            </div>
            <div className="hidden md:block w-px h-12 bg-[#31302f]/20"></div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-[#050504]">10K+</div>
              <div className="text-sm text-[#31302f]">Readers</div>
            </div>
            <div className="hidden md:block w-px h-12 bg-[#31302f]/20"></div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-[#050504]">15+</div>
              <div className="text-sm text-[#31302f]">Categories</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Wave divider */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg 
          className="w-full h-12 md:h-16" 
          viewBox="0 0 1200 120" 
          preserveAspectRatio="none"
        >
          <path 
            d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" 
            opacity=".25" 
            fill="#f7af00"
          ></path>
          <path 
            d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35,6.36,119.13-6.25,33-11,66.1-28.68,94.32-50.34,25.34-19.34,46.05-44.16,66.6-68.87C1001.69,0,1053.28,0,1101,0H1200V0Z" 
            opacity=".5" 
            fill="#f7af00"
          ></path>
          <path 
            d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" 
            fill="#faf4e5"
          ></path>
        </svg>
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
      {/* Permanent Hero Section */}
      <HeroSection />
      
      {/* Main Content Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 md:-mt-12 relative z-10">
        {/* Blog Post Card */}
        <div className="bg-[#f0eadd] rounded-3xl shadow-lg overflow-hidden mb-12 border border-[#31302f]/10">
          {/* Featured Image */}
          {post.featuredImage && (
            <div className="relative h-64 md:h-80 lg:h-96">
              <Image
                src={urlFor(post.featuredImage).url()}
                alt={post.title}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1024px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#050504]/60 to-transparent" />
              
              {/* Category badge on image */}
              {post.category && (
                <div className="absolute top-6 left-6">
                  <span className="inline-block px-4 py-2 bg-[#f7af00] text-[#050504] text-sm font-medium rounded-full shadow-md">
                    {post.category}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Post Content */}
          <div className="p-6 md:p-8 lg:p-10">
            {/* If no featured image, show category badge here */}
            {!post.featuredImage && post.category && (
              <span className="inline-block px-4 py-2 bg-[#f7af00] text-[#050504] text-sm font-medium rounded-full mb-6 shadow-sm">
                {post.category}
              </span>
            )}

            {/* Title and Meta */}
            <div className="mb-8">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#050504] mb-6 leading-tight">
                {post.title}
              </h1>
              
              <div className="flex flex-wrap items-center gap-4 text-[#31302f] border-b border-[#31302f]/20 pb-6">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13H11v6l5.2 3.2.8-1.3-4.5-2.7V7z"/>
                  </svg>
                  <time dateTime={post.publishedAt}>{formattedDate}</time>
                </div>
                
                {post.readTime && (
                  <div className="flex items-center gap-2">
                    <span className="w-1 h-1 bg-[#31302f] rounded-full"></span>
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm1-13h-2v6l5.25 3.15.75-1.23-4-2.37V7z"/>
                    </svg>
                    <span>{post.readTime} min read</span>
                  </div>
                )}
              </div>
            </div>

            {/* Excerpt */}
            {post.excerpt && (
              <div className="mb-10 p-6 bg-[#faf4e5] rounded-2xl border-l-4 border-[#f7af00]">
                <p className="text-lg md:text-xl text-[#31302f] italic leading-relaxed">
                  {post.excerpt}
                </p>
              </div>
            )}

            {/* Main Content */}
            <BlogContent 
              sections={post.sections} 
              finalThoughts={post.finalThoughts}
            />

            {/* Final Thoughts */}
            {post.finalThoughts && (
              <div className="mt-12 p-8 bg-gradient-to-r from-[#f7af00]/10 to-[#faf4e5] rounded-3xl border border-[#f7af00]/20">
                <div className="flex items-center gap-3 mb-6">
                  <svg className="w-8 h-8 text-[#050504]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                  </svg>
                  <h3 className="text-2xl font-bold text-[#050504]">Final Thoughts</h3>
                </div>
                <div className="text-[#31302f] leading-relaxed space-y-4">
                  {post.finalThoughts.map((paragraph: string, index: number) => (
                    <p key={index}>{paragraph}</p>
                  ))}
                </div>
              </div>
            )}

            {/* Share and Navigation Section */}
            <div className="mt-12 pt-8 border-t border-[#31302f]/20">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                {/* Share buttons */}
                <div>
                  <h3 className="text-lg font-semibold text-[#050504] mb-4">Share this article</h3>
                  <div className="flex items-center gap-3">
                    {[
                      { icon: 'facebook', color: 'hover:bg-[#1877F2]' },
                      { icon: 'twitter', color: 'hover:bg-[#1DA1F2]' },
                      { icon: 'linkedin', color: 'hover:bg-[#0A66C2]' },
                      { icon: 'link', color: 'hover:bg-[#31302f]' }
                    ].map((social) => (
                      <button
                        key={social.icon}
                        className={`p-3 rounded-xl bg-[#faf4e5] text-[#31302f] ${social.color} hover:text-[#faf4e5] transition-all duration-300 shadow-sm hover:shadow-md`}
                        aria-label={`Share on ${social.icon}`}
                      >
                        {social.icon === 'facebook' && (
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                          </svg>
                        )}
                        {social.icon === 'twitter' && (
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.213c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                          </svg>
                        )}
                        {social.icon === 'linkedin' && (
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                          </svg>
                        )}
                        {social.icon === 'link' && (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/>
                          </svg>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Back to Blog button */}
                <a 
                  href="/blog" 
                  className="inline-flex items-center gap-3 px-6 py-3 bg-[#f7af00] text-[#050504] font-medium rounded-xl hover:bg-[#f7af00]/90 transition-colors shadow-md hover:shadow-lg"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
                  </svg>
                  Back to Blog
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Related Posts Section (Placeholder) */}
        <div className="mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-[#050504] mb-8 text-center">
            More Articles
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-[#f0eadd] rounded-2xl p-6 hover:shadow-lg transition-shadow border border-[#31302f]/10">
                <div className="w-full h-40 bg-gradient-to-r from-[#f7af00]/20 to-[#faf4e5] rounded-xl mb-4"></div>
                <span className="inline-block px-3 py-1 bg-[#f7af00] text-[#050504] text-xs font-medium rounded-full mb-3">
                  Category
                </span>
                <h3 className="font-semibold text-[#050504] mb-2 line-clamp-2">
                  Related article title goes here
                </h3>
                <p className="text-sm text-[#31302f] line-clamp-2 mb-4">
                  A brief excerpt from the related article...
                </p>
                <a href="#" className="text-sm font-medium text-[#050504] hover:text-[#f7af00] transition-colors">
                  Read More →
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </article>
  )
}