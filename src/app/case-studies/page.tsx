// app/case-studies/page.tsx

import { client } from '../../sanity/lib/client';
import Image from 'next/image';
import Link from 'next/link';

export const metadata = {
  title: 'Case Studies | Finzie',
  description: 'Explore how Finzie transforms client products through development, design, and optimization case studies.',
};

interface CaseStudy {
  _id: string;
  title: string;
  description: string;
  slug: { current: string };
  mainImage: { asset: { url: string } };
}

export default async function CaseStudiesPage() {
  let caseStudies: CaseStudy[] = [];

  try {
    caseStudies = await client.fetch(`
      *[_type == "caseStudy"] | order(_createdAt desc) {
        _id,
        title,
        description,
        slug,
        mainImage {
          asset -> {
            url
          }
        }
      }
    `);
  } catch (error) {
    console.error('Error fetching case studies:', error);
  }

  if (!caseStudies || caseStudies.length === 0) {
    return (
      <div className="max-w-5xl mx-auto py-20 px-4 text-center text-gray-500">
        <h1 className="text-4xl font-bold mb-4">Case Studies</h1>
        <p>No case studies found. Please check back later.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Gradient Hero Section */}
      <section className="bg-[#241C15] text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Case Studies</h1>
          <p className="text-lg md:text-xl max-w-2xl mx-auto">
            Discover how Finzie transforms startups through design, engineering, and rapid iteration with real client stories.
          </p>
        </div>
      </section>

      {/* Case Studies Grid */}
      <section className="max-w-6xl mx-auto py-12 px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {caseStudies.map((study) => (
            <div
              key={study._id}
              className="group bg-white rounded-xl shadow hover:shadow-lg transition transform hover:-translate-y-1 flex flex-col overflow-hidden"
            >
              <div className="relative w-full h-56 bg-gray-200">
                {study.mainImage?.asset?.url ? (
                  <Image
                    src={study.mainImage.asset.url}
                    alt={study.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400">
                    No Image
                  </div>
                )}
              </div>
              <div className="p-5 flex flex-col flex-grow">
                <h2 className="text-xl font-semibold mb-2 text-gray-800 group-hover:text-yellow-600 transition">
                  {study.title}
                </h2>
                <p className="text-gray-600 text-sm line-clamp-3">
                  {study.description}
                </p>
              </div>
              <Link
                href={`/case-studies/${study.slug.current}`}
                className="mt-auto inline-block text-center bg-yellow-400 hover:bg-yellow-300 text-black font-medium py-2 px-4 rounded transition"
              >
                View Case Study →
              </Link>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
