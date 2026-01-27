import { client } from '@/src/sanity/lib/client'
import BlogCard from '../../components/blog/BlogCard'
import { BlogPost } from '@/src/types/blog'
import { notFound } from 'next/navigation'


// BlogPost type is now imported from '@/src/types/blog'

async function getPosts(): Promise<BlogPost[]> {
  const query = `
    *[_type == "blogPost"] | order(publishedAt desc) {
      _id,
      _type,
      title,
      slug,
      excerpt,
      featuredImage,
      publishedAt,
      category,
      readTime,
      sections
    }
  `
  
  const posts = await client.fetch(query)
  return posts
}

export const revalidate = 3600 // Revalidate every hour

export default async function BlogPage() {
  const posts = await getPosts()
  const categories = ['All Posts', 'Shopify', 'Migration', 'E-commerce', 'CRO', 'SEO']

  return (
    <main className="min-h-screen bg-[#faf4e5]">
      {/* Hero Section */}
      <section className="bg-[#faf4e5] py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-medium text-[#050504] mb-4">
              Blog & Resources
            </h1>
            <p className="text-lg text-[#31302f] max-w-2xl mx-auto">
              Discover expert insights, industry trends, and practical guides to help you grow your business.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {posts.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-lg text-[#31302f]">No articles found yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <BlogCard key={post._id} post={post} />
            ))}
          </div>
        )}
      </section>
    </main>
  )
}
