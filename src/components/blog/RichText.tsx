'use client'

import { urlFor } from '@/src/sanity/lib/image'
import Image from 'next/image'
import { PortableText as PortableTextComponent } from '@portabletext/react'


interface PortableTextImage {
  _type: 'image'
  asset: any
  alt?: string
}

const components = {
  types: {
    image: ({ value }: { value: PortableTextImage }) => {
      return (
        <div className="my-8">
          <Image
            src={urlFor(value).url()}
            alt={value.alt || 'Blog image'}
            width={800}
            height={500}
            className="rounded-lg"
          />
          {value.alt && (
            <p className="text-center text-sm text-gray-500 mt-2">
              {value.alt}
            </p>
          )}
        </div>
      )
    }
  },
  block: {
    h1: ({ children }: any) => (
      <h1 className="text-3xl font-bold mt-8 mb-4">{children}</h1>
    ),
    h2: ({ children }: any) => (
      <h2 className="text-2xl font-bold mt-6 mb-3">{children}</h2>
    ),
    h3: ({ children }: any) => (
      <h3 className="text-xl font-bold mt-5 mb-2">{children}</h3>
    ),
    h4: ({ children }: any) => (
      <h4 className="text-lg font-bold mt-4 mb-2">{children}</h4>
    ),
    normal: ({ children }: any) => (
      <p className="my-4">{children}</p>
    ),
    blockquote: ({ children }: any) => (
      <blockquote className="border-l-4 border-blue-500 pl-4 my-6 italic">
        {children}
      </blockquote>
    )
  }
}

interface PortableTextProps {
  value: any[]
}

export default function PortableText({ value }: PortableTextProps) {
  return <PortableTextComponent value={value} components={components} />
}