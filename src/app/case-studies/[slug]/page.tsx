// app/case-studies/[slug]/page.tsx

import { client } from '../../../sanity/lib/client';
import { PortableText } from '@portabletext/react';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import Link from 'next/link';

interface CaseStudy {
  _id: string;
  title: string;
  subtitle: string;
  description: string;
  content: any;
  tags: string[];
  industry: string;
  service: string;
  snapshot: string[];
  teamMember: {
    name: string;
    role: string;
    image: { asset: { url: string } };
    bio: string;
  };
  testimonial: {
    quote: string;
    author: string;
  };
  callToAction: {
    text: string;
    link: string;
  };
  mainImage: { asset: { url: string } };
}

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const study: CaseStudy = await client.fetch(
    `
      *[_type == "caseStudy" && slug.current == $slug][0]{
        _id,
        title,
        subtitle,
        description,
        content,
        tags,
        industry,
        service,
        snapshot,
        teamMember->{name, role, bio, image { asset->{ url } }},
        testimonial,
        callToAction,
        mainImage { asset->{ url } }
      }
    `,
    { slug }
  );

  if (!study) {
    notFound();
  }

  return (
    <div className="max-w-3xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-2">{study.title}</h1>
      {study.subtitle && <h2 className="text-xl text-gray-700 mb-4">{study.subtitle}</h2>}
      <p className="text-gray-600 mb-6">{study.description}</p>

      {study.mainImage?.asset?.url && (
        <Image
          src={study.mainImage.asset.url}
          alt={study.title}
          width={800}
          height={500}
          className="rounded-lg mb-8 w-full object-cover"
        />
      )}

      <div className="mb-6 flex flex-wrap gap-2">
        {study.tags?.map((tag, idx) => (
          <span key={idx} className="bg-yellow-200 text-yellow-800 text-xs px-2 py-1 rounded">
            {tag}
          </span>
        ))}
      </div>

      <p className="text-sm text-gray-500 mb-2"><strong>Industry:</strong> {study.industry}</p>
      <p className="text-sm text-gray-500 mb-6"><strong>Service:</strong> {study.service}</p>

      <div className="prose prose-lg mb-8">
        <PortableText value={study.content} />
      </div>

      {/* Snapshot Section */}
      {study.snapshot && study.snapshot.length > 0 && (
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-2">Snapshot</h3>
          <ul className="list-disc list-inside text-gray-700">
            {study.snapshot.map((point, idx) => (
              <li key={idx}>{point}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Team Member Section */}
      {study.teamMember && (
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-2">Team Member</h3>
          <div className="flex items-center gap-4">
            {study.teamMember.image?.asset?.url && (
              <Image
                src={study.teamMember.image.asset.url}
                alt={study.teamMember.name}
                width={80}
                height={80}
                className="rounded-full object-cover"
              />
            )}
            <div>
              <p className="font-semibold">{study.teamMember.name}</p>
              <p className="text-sm text-gray-600">{study.teamMember.role}</p>
              <p className="text-gray-700 text-sm mt-1">{study.teamMember.bio}</p>
            </div>
          </div>
        </div>
      )}

      {/* Testimonial Section */}
      {study.testimonial?.quote && (
        <blockquote className="border-l-4 border-yellow-500 pl-4 italic text-gray-800 mb-8">
          “{study.testimonial.quote}”<br />
          <span className="block mt-2 text-sm text-gray-600">— {study.testimonial.author}</span>
        </blockquote>
      )}

      {/* Call to Action */}
      {study.callToAction?.text && study.callToAction?.link && (
        <Link
          href={study.callToAction.link}
          className="inline-block bg-yellow-400 hover:bg-yellow-300 text-black font-semibold px-6 py-3 rounded transition duration-200"
        >
          {study.callToAction.text}
        </Link>
      )}
    </div>
  );
}
