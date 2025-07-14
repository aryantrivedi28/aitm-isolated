'use client';
export default function AboutPage() {
  return (
    <div className='flex flex-col'>
      {/* Hero Section */}
      <section className="bg-[#241C15] text-white py-20 px-4">
        <div className="max-w-6xl mx-auto text-start">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            About <span className="text-yellow-300">Finzie</span>
          </h1>
          <p className="text-lg md:text-xl mx-auto text-gray-400 mb-6">
            We connect startups with pre-vetted freelancers and AI-driven teams, making it easy to build, design, and scale your projects rapidly.
          </p>
          <p className="text-md md:text-lg mx-auto text-gray-400 mb-8">
            Our mission is to empower fast-moving startups by providing instant access to top-tier talent while fostering a thriving, inclusive freelancer community worldwide.
          </p>
          <a
            href="/client-request"
            className="bg-yellow-400 hover:bg-yellow-300 text-black font-semibold px-6 py-3 rounded transition duration-200"
          >
            Start Your Project Today
          </a>
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

    </div>
  )
}
