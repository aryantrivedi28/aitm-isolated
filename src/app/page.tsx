// src/app/page.tsx (Updated Client Landing Page with New Design)

'use client';

import Link from 'next/link';

export default function ClientLandingPage() {
  return (
    <main className="flex flex-col">
      {/* Hero Section */}
      <section className="bg-[#241C15] text-white py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-semibold mb-4">
            On-demand talent for fast-moving startups
          </h1>
          <p className="text-lg md:text-xl mb-8">
            Pre-vetted freelancers & AI-smart teams for development, design, video & more. Match and onboard in 24 hours
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <Link href="/client-request" passHref>
              <button className="bg-[#FFE01B] hover:bg-yellow-300 text-black font-semibold px-8 py-3 rounded transition-all duration-200">
                Post a Request
              </button>
            </Link>
            <Link href="/all-freelancer" passHref>
              <button className="bg-[#FFE01B] hover:bg-yellow-300 text-black font-semibold px-8 py-3 rounded transition-all duration-200">
                Join as a Freelancer
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* How Finzie Works */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h2 className="text-3xl font-semibold">How Finzie Works</h2>
        </div>
        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8">
          <div className="text-center">
            <img src="/xyz.png" alt="Share your requirements" className="mx-auto rounded-lg w-full h-40 object-contain" />
            <h3 className="mt-4 font-semibold text-lg">Share your requirements</h3>
            <p className="mt-2 text-gray-600">
              Fill out our simple form, and our team will reach out to clarify your project’s requirements
            </p>
          </div>
          <div className="text-center">
            <img src="match.png" alt="Get matched" className="mx-auto rounded-lg w-full h-40 object-contain" />
            <h3 className="mt-4 font-semibold text-lg">Get matched</h3>
            <p className="mt-2 text-gray-600">
              Our AI engine analyzes your project profile & finds the perfect expert with manual verification within the next 24 hours
            </p>
          </div>
          <div className="text-center">
            <img src="manage.png" alt="Deliver & manage" className="mx-auto rounded-lg w-full h-40 object-contain" />
            <h3 className="mt-4 font-semibold text-lg">Deliver & manage</h3>
            <p className="mt-2 text-gray-600">
              We assign the right freelancer, manage delivery end to end & integrate our agile teams into your stack
            </p>
          </div>
        </div>
      </section>

      {/* Why Us Section */}
      <section className="bg-[#241C15] text-white py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-semibold mb-10">Why Us?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold text-lg">Pre-vetted experts ready to jump in</h3>
              <p className="mt-1 text-gray-300">
                Rigorous screening ensures top-tier talent every time
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-lg">AI-driven matching for a perfect fit</h3>
              <p className="mt-1 text-gray-300">
                Data-powered pairings deliver the exact skills you need
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-lg">Integrated agile teams</h3>
              <p className="mt-1 text-gray-300">
                Our freelancers become part of your team in the communication channel of your choice
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-lg">Flexible pricing that adapts to your budget</h3>
              <p className="mt-1 text-gray-300">
                Tailored quotes with no hidden fees
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-lg">World’s first AI talent aggregator</h3>
              <p className="mt-1 text-gray-300">
                Whether it’s workflow automation or a full autonomous agent, we’ve got the specialists to build it
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-lg">We handle the dirty work</h3>
              <p className="mt-1 text-gray-300">
                From agreements and onboarding to invoicing, Finzie takes care of it all so you can focus on growing your business
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Service Categories */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto mb-8">
          <h2 className="text-3xl font-semibold">Service Categories</h2>
        </div>
        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
          <div>
            <div className="flex items-center mb-2">
              <span className="text-xl mr-2">&lt;/&gt;</span>
              <h3 className="font-semibold">Development</h3>
            </div>
            <ul className="text-gray-600 list-disc list-inside">
              <li>Database Management</li>
              <li>Frontend Technologies</li>
              <li>Backend Frameworks</li>
            </ul>
          </div>
          <div>
            <div className="flex items-center mb-2">
              <span className="text-xl mr-2">🔈</span>
              <h3 className="font-semibold">Marketing</h3>
            </div>
            <ul className="text-gray-600 list-disc list-inside">
              <li>Digital Marketing</li>
              <li>SEO</li>
              <li>Content Creation</li>
            </ul>
          </div>
          <div>
            <div className="flex items-center mb-2">
              <span className="text-xl mr-2">✏️</span>
              <h3 className="font-semibold">Design</h3>
            </div>
            <ul className="text-gray-600 list-disc list-inside">
              <li>UI/UX</li>
              <li>Graphic Design</li>
              <li>Pitch Deck Designing</li>
            </ul>
          </div>
          <div>
            <div className="flex items-center mb-2">
              <span className="text-xl mr-2">🎥</span>
              <h3 className="font-semibold">Video Editing</h3>
            </div>
            <ul className="text-gray-600 list-disc list-inside">
              <li>Motion Graphics</li>
              <li>2D/3D Animations</li>
              <li>Video Creation</li>
            </ul>
          </div>
          <div>
            <div className="flex items-center mb-2">
              <span className="text-xl mr-2">🤖</span>
              <h3 className="font-semibold">AI</h3>
            </div>
            <ul className="text-gray-600 list-disc list-inside">
              <li>AI Agent Creation</li>
              <li>Workflow Automation</li>
              <li>AI Freelancer Outsourcing</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-12 bg-white text-center">
        <Link href="/client-request" passHref>
          <button className="bg-[#241C15] text-white font-semibold px-8 py-4 rounded">
            Start a Project Now
          </button>
        </Link>
      </section>
    </main>
  );
}