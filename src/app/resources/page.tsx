import { client } from '@/src/sanity/lib/client'
import BlogCard from '../../components/blog/BlogCard'
import { BlogPost } from '../../types/blog'
import { notFound } from 'next/navigation'



export const metadata = {
  title: 'Blog | Expert Insights & Strategies',
  description: 'In-depth articles on Shopify migrations, e-commerce optimization, and digital growth',
}

export default async function BlogPage() {
  const posts = await client.fetch(`
    *[_type == "blogPost"] | order(publishedAt desc) {
      _id,
      title,
      slug,
      excerpt,
      featuredImage,
      publishedAt,
      category,
      readTime
    }
  `)

  const categories = ['Shopify', 'Migration', 'E-commerce', 'CRO', 'SEO']

  return (
    <main className="min-h-screen bg-[#faf4e5]">
      {/* Animated Hero Section */}
      <div className="relative overflow-hidden bg-dark text-white py-20">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 25px 25px, ${'#f7af00'} 2%, transparent 0%), radial-gradient(circle at 75px 75px, ${'#f7af00'} 2%, transparent 0%)`,
            backgroundSize: '100px 100px'
          }}></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center animate-slide-up">
            <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
              <svg className="w-5 h-5 animate-pulse-slow" fill="#f7af00" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z" clipRule="evenodd" />
              </svg>
              <span className="text-sm font-medium">Latest Insights</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Expert
              <span className="text-primary ml-3">Insights</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-10">
              In-depth articles on Shopify migrations, e-commerce optimization, 
              and digital growth strategies from industry experts
            </p>
            
            {/* Animated CTA Button */}
            <div className="animate-float">
              <a 
                href="#posts" 
                className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-dark font-bold rounded-lg hover:bg-opacity-90 transition-all duration-300 hover:shadow-xl"
              >
                Explore Articles
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Blog Posts Section */}
      <div id="posts" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Category Filter */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-dark mb-6 flex items-center gap-2">
            <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
            Browse Articles
          </h2>
          <div className="flex flex-wrap gap-3">
            <button className="px-5 py-2.5 bg-primary text-dark font-semibold rounded-lg shadow-sm hover:shadow-md transition-all">
              All Posts
            </button>
            {categories.map((category) => (
              <button 
                key={category}
                className="px-5 py-2.5 bg-white border border-light text-dark font-medium rounded-lg hover:bg-light hover:border-gray-800/20 transition-colors hover:shadow-sm"
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Blog Grid */}
        {posts.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-light">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 bg-light rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-dark mb-2">No posts yet</h3>
              <p className="text-gray-800">Check back soon for new articles!</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post: any, index: number) => (
              <div 
                key={post._id} 
                className="animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <BlogCard post={post} />
              </div>
            ))}
          </div>
        )}

        {/* Newsletter CTA */}
        <div className="mt-20 bg-gradient-to-r from-light to-secondary rounded-2xl p-8 border border-light shadow-sm">
          <div className="max-w-2xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 mb-4">
              <svg className="w-6 h-6 text-primary animate-float" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
              <h3 className="text-2xl font-bold text-dark">Stay Updated</h3>
            </div>
            <p className="text-gray-800 mb-6 text-lg">
              Get the latest insights delivered directly to your inbox
            </p>
            <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 border-2 border-light rounded-lg bg-white focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-dark text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors shadow-sm"
              >
                Subscribe
              </button>
            </form>
            <p className="text-sm text-gray-800 mt-4">
              No spam. Unsubscribe anytime.
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}