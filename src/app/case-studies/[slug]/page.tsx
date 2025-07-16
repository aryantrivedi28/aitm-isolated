// app/case-studies/[slug]/page.tsx

import { client } from '../../../sanity/lib/client';
import { PortableText } from '@portabletext/react';
import Image from 'next/image';
import { notFound } from 'next/navigation';

interface CaseStudy {
  _id: string;
  title: string;
  description: string;
  content: any;
  image: { asset: { url: string } };
}

export default async function CaseStudyPage({
  params,
}: {
  params: { slug: string };
}) {
  const study: CaseStudy = await client.fetch(
    `
      *[_type == "caseStudy" && slug.current == $slug][0]{
        _id,
        title,
        description,
        content,
        image {
          asset -> {
            url
          }
        }
      }
    `,
    { slug: params.slug }
  );

  if (!study) {
    notFound();
  }

  return (
    <div className="max-w-3xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-4">{study.title}</h1>
      <p className="text-gray-600 mb-6">{study.description}</p>
      {study.image?.asset?.url && (
        <Image
          src={study.image.asset.url}
          alt={study.title}
          width={800}
          height={500}
          className="rounded-lg mb-8 w-full object-cover"
        />
      )}
      <div className="prose prose-lg">
        <PortableText value={study.content} />
      </div>
    </div>
  );
}
