import Image from 'next/image'
import Link from 'next/link'
import { urlFor } from '@/src/sanity/lib/image'
import { BlogPost } from '../../types/blog'


interface BlogCardProps {
  post: {
    _id: string;
    title: string;
    slug: {
      current: string;
    };
    excerpt?: string;
    featuredImage?: any;
    publishedAt: string;
    category?: string;
    readTime?: number;
  }
}

export default function BlogCard({ post }: BlogCardProps) {
  const formattedDate = new Date(post.publishedAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })

  return (
    <article 
      className="group bg-white rounded-xl border border-light overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 animate-fade-in"
      style={{ animationDelay: `${Math.random() * 300}ms` }}
    >
      {/* Category Badge */}
      {post.category && (
        <div className="absolute top-4 left-4 z-10">
          <span className="px-3 py-1.5 bg-white/95 backdrop-blur-sm text-dark text-xs font-semibold rounded-full shadow-sm border border-light">
            {post.category}
          </span>
        </div>
      )}

      {/* Featured Image */}
      {post.featuredImage && (
        <div className="relative h-56 w-full overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-dark/30 to-transparent z-10" />
          <Image
            src={urlFor(post.featuredImage).url()}
            alt={post.title}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-700"
          />
        </div>
      )}

      {/* Content */}
      <div className="p-6 relative">
        {/* Date and Read Time */}
        <div className="flex items-center gap-3 mb-3">
          <div className="flex items-center gap-1.5 text-gray-800">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <time className="text-sm font-medium" dateTime={post.publishedAt}>
              {formattedDate}
            </time>
          </div>
          {post.readTime && (
            <div className="flex items-center gap-1.5 text-gray-800">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm">{post.readTime} min</span>
            </div>
          )}
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-dark mb-3 group-hover:text-primary transition-colors duration-300 line-clamp-2">
          <Link href={`/blog/${post.slug.current}`}>
            {post.title}
          </Link>
        </h3>

        {/* Excerpt */}
        {post.excerpt && (
          <p className="text-gray-800 mb-4 line-clamp-3 leading-relaxed">
            {post.excerpt}
          </p>
        )}

        {/* Read More Button */}
        <div className="pt-4 border-t border-light">
          <Link 
            href={`/blog/${post.slug.current}`}
            className="inline-flex items-center gap-2 text-dark font-semibold group/link"
          >
            <span className="relative">
              Read Full Article
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary group-hover/link:w-full transition-all duration-300"></span>
            </span>
            <svg 
              className="w-4 h-4 transition-transform group-hover/link:translate-x-1" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>
      </div>
    </article>
  )
}