import Image from 'next/image'
import Link from 'next/link'
import { urlFor } from '@/src/sanity/lib/image'
import { BlogPost } from '../../types/blog'

interface BlogCardProps {
  post: BlogPost
}

export default function BlogCard({ post }: BlogCardProps) {
  const formattedDate = new Date(post.publishedAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })

  return (
    <Link href={`/resources/${post.slug.current}`}>
      <article className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden h-full flex flex-col">
        {/* Featured Image */}
        {post.featuredImage && (
          <div className="relative w-full h-48 bg-gray-200 overflow-hidden">
            <Image
              src={urlFor(post.featuredImage).url() || "/placeholder.svg"}
              alt={post.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        )}

        {/* Header */}
        <div className="bg-gradient-to-r from-[#f7af00]/10 to-[#ffcc33]/10 px-6 py-4">
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="text-xs font-semibold text-[#f7af00] uppercase tracking-wide">
              {post.category}
            </span>
            <span className="text-xs text-[#31302f]">{post.readTime || 5} min</span>
          </div>
          <h3 className="text-lg font-bold text-[#050504] line-clamp-2">{post.title}</h3>
        </div>

        {/* Body */}
        <div className="px-6 py-4 flex-grow">
          <p className="text-sm text-[#31302f] line-clamp-3 leading-relaxed">
            {post.excerpt}
          </p>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#31302f]">{formattedDate}</span>
            <span className="text-[#f7af00] font-semibold text-sm">Read →</span>
          </div>
        </div>
      </article>
    </Link>
  )
}
