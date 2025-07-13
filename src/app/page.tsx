// src/app/page.tsx (Updated Client Landing Page with New Design)

'use client';

import Link from 'next/link';

export default function ClientLandingPage() {
  return (
    <main className="flex flex-col">
      {/* Hero Section */}
      <section className="bg-[#241C15] text-white py-20 px-4">
        <div className="max-w-6xl mx-auto text-start">
          <h1 className='text-4xl md:text-5xl font-bold mb-4'>About <span className='text-gray-100 font-extrabold text-5xl'>Finzie</span></h1>
          <h1 className="text-4xl md:text-5xl font-semibold mb-4">
            On-demand talent for fast-moving startups
          </h1>
          <p className="text-lg md:text-xl mb-10 max-w-xl text-gray-300">
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
        <div className="max-w-6xl mx-auto">
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

      {/* Team Members Section */}
      <section className="bg-gray-50 py-16 px-4">
        <div className="max-w-5xl mx-auto text-center mb-12">
          <h2 className="text-3xl font-semibold">Meet Our Team</h2>
          <p className="text-gray-600 mt-2">
            The builders, designers, and dreamers behind Finzie
          </p>
        </div>
        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {/* Team Member 1 */}
          <div className="bg-white rounded-lg shadow p-6 text-center hover:shadow-lg transition-shadow duration-200">
            <img
              src="/team/john.jpg"
              alt="Member 1"
              className="w-24 h-24 rounded-full mx-auto object-cover mb-4"
            />
            <h3 className="font-semibold text-lg">Member 1</h3>
            <p className="text-gray-500 text-sm">Co-Founder & CEO</p>
            <p className="text-gray-600 mt-2 text-sm">
              Product strategist passionate about building efficient teams for fast-scaling startups.
            </p>
          </div>
          {/* Team Member 2 */}
          <div className="bg-white rounded-lg shadow p-6 text-center hover:shadow-lg transition-shadow duration-200">
            <img
              src="/team/jane.jpg"
              alt="Member 2"
              className="w-24 h-24 rounded-full mx-auto object-cover mb-4"
            />
            <h3 className="font-semibold text-lg">Member 2</h3>
            <p className="text-gray-500 text-sm">Head of Operations</p>
            <p className="text-gray-600 mt-2 text-sm">
              Expert in workflow automation and operations, ensuring seamless delivery for every client.
            </p>
          </div>
          {/* Team Member 3 */}
          <div className="bg-white rounded-lg shadow p-6 text-center hover:shadow-lg transition-shadow duration-200">
            <img
              src="/team/ali.jpg"
              alt="Member 3"
              className="w-24 h-24 rounded-full mx-auto object-cover mb-4"
            />
            <h3 className="font-semibold text-lg">Member 3</h3>
            <p className="text-gray-500 text-sm">Lead Developer</p>
            <p className="text-gray-600 mt-2 text-sm">
              Full-stack engineer with a focus on scalable architecture and rapid MVP delivery.
            </p>
          </div>
        </div>
      </section>

      {/* Story of Finzie's */}
      <section className="bg-[#241C15] text-white py-16 px-4">
        <div className="max-w-6xl mx-auto text-start mb-12">
          <h2 className="text-3xl font-semibold">Finzie's Story</h2>
          <p className="text-gray-300 mt-2">
            From a small startup to a global talent aggregator
          </p>
        </div>
        <div className="max-w-6xl mx-auto text-gray-300">
          <p>
            Finzie was born out of the need for fast-moving startups to access top-tier talent quickly. Our founders, frustrated with the traditional hiring process, set out to create a platform that would streamline the way businesses connect with freelancers and AI specialists.
          </p>
          <p className="mt-4">
            Today, Finzie is proud to be the world’s first AI talent aggregator, providing on-demand access to pre-vetted experts across various domains. Our mission is to empower startups with the resources they need to scale efficiently and effectively.
          </p>
        </div>
      </section>

      {/* goals and impact section */}
      <section className="bg-gray-50 py-16 px-4">
        <div className="max-w-5xl mx-auto text-center mb-12">
          <h2 className="text-3xl font-semibold">Our Goals & Impact</h2>
          <p className="text-gray-600 mt-2">
            Committed to making a difference in the freelance ecosystem
          </p>
        </div>

        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition">
            <h3 className="text-xl font-bold text-indigo-600 mb-2">Empower Freelancers</h3>
            <p className="text-gray-600">
              Providing resources, mentorship, and opportunities for freelancers to grow and succeed in their careers.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition">
            <h3 className="text-xl font-bold text-indigo-600 mb-2">Build a Thriving Community</h3>
            <p className="text-gray-600">
              Fostering a supportive environment where freelancers connect, collaborate, and share knowledge to uplift each other.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition">
            <h3 className="text-xl font-bold text-indigo-600 mb-2">Drive Economic Impact</h3>
            <p className="text-gray-600">
              Enabling freelancers to access better opportunities, increase income stability, and contribute to the global economy.
            </p>
          </div>
        </div>
      </section>


      {/* Our Mission and Vision */}
      <section className="py-12 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center md:items-stretch justify-between relative">

            {/* Mission */}
            <div className="w-full md:w-1/2 p-6 text-center md:text-right">
              <h2 className="text-2xl font-bold mb-4 text-gray-800">Our Mission</h2>
              <p className="text-gray-600">
                To empower communities through education, technology, and sustainable solutions, creating opportunities for every individual to thrive and contribute to a better world.
              </p>
            </div>

            {/* Vertical Line */}
            <div className="hidden md:block w-[2px] bg-gray-400 h-40 absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>

            {/* Vision */}
            <div className="w-full md:w-1/2 p-6 text-center md:text-left">
              <h2 className="text-2xl font-bold mb-4 text-gray-800">Our Vision</h2>
              <p className="text-gray-600">
                To build a future where innovation and inclusivity drive societal progress, ensuring that technology and education are accessible to all, regardless of background.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Service Categories */}
      <section className="bg-[#241C15] py-16 px-4">
        <div className="max-w-6xl mx-auto mb-12 text-start">
          <h2 className="text-4xl md:text-4xl font-bold text-blue-100">Service Categories</h2>
          <p className="text-gray-300 mt-3 max-w-6xl mx-auto font-semibold">
            Explore a diverse range of services to empower your business, executed by skilled freelancers across categories.
          </p>
        </div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {[
            {
              icon: "< />",
              title: "Development",
              items: ["Database Management", "Frontend Technologies", "Backend Frameworks"],
            },
            {
              icon: "🔈",
              title: "Marketing",
              items: ["Digital Marketing", "SEO", "Content Creation"],
            },
            {
              icon: "✏️",
              title: "Design",
              items: ["UI/UX", "Graphic Design", "Pitch Deck Designing"],
            },
            {
              icon: "🎥",
              title: "Video Editing",
              items: ["Motion Graphics", "2D/3D Animations", "Video Creation"],
            },
            {
              icon: "🤖",
              title: "AI",
              items: ["AI Agent Creation", "Workflow Automation", "AI Freelancer Outsourcing"],
            },
          ].map((service, index) => (
            <div
              key={index}
              className="bg-[#2E251B] rounded-xl p-6 border border-gray-700 hover:border-indigo-500 hover:shadow-lg transition"
            >
              <div className="flex items-center mb-4 justify-center">
                <span className="text-2xl mr-2 text-blue-100">{service.icon}</span>
                <h3 className="text-lg font-semibold text-blue-50">{service.title}</h3>
              </div>
              <ul className="text-gray-300 list-disc list-inside space-y-1 text-sm">
                {service.items.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
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