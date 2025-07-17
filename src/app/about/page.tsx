// src/app/about/page.tsx (Animated About Page)

'use client';

import { motion } from 'framer-motion';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.2 } },
};

export default function AboutPage() {
  return (
    <div className='flex flex-col'>
      {/* Hero Section */}
      <section className="bg-[#241C15] text-white py-20 px-4">
        <motion.div
          className="max-w-6xl mx-auto text-start"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={staggerContainer}
        >
          <motion.h1 variants={fadeUp} className="text-4xl md:text-5xl font-bold mb-4">
            About <span className="text-yellow-300">Finzie</span>
          </motion.h1>
          <motion.p variants={fadeUp} className="text-lg md:text-xl text-gray-100 mb-6">
            We connect startups with pre-vetted freelancers and AI-driven teams, making it easy to build, design, and scale your projects rapidly.
          </motion.p>
          <motion.p variants={fadeUp} className="text-md md:text-lg text-gray-100 mb-8">
            Our mission is to empower fast-moving startups by providing instant access to top-tier talent while fostering a thriving, inclusive freelancer community worldwide.
          </motion.p>
          <motion.a
            variants={fadeUp}
            href="/client-request"
            className="bg-yellow-400 hover:bg-yellow-300 text-black font-semibold px-6 py-3 rounded transition duration-200 inline-block"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
          >
            Start Your Project Today
          </motion.a>
        </motion.div>
      </section>

      {/* Team Members Section */}
      <section className="bg-gray-50 py-16 px-4">
        <motion.div
          className="max-w-5xl mx-auto text-center mb-12"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={staggerContainer}
        >
          <motion.h2 variants={fadeUp} className="text-3xl font-semibold">Meet Our Team</motion.h2>
          <motion.p variants={fadeUp} className="text-black/70 mt-2">
            The builders, designers, and dreamers behind Finzie
          </motion.p>
        </motion.div>

        <motion.div
          className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={staggerContainer}
        >
          {[{
            name: 'Aryan Trivedi',
            role: 'Founder & CEO',
            desc: 'Product strategist passionate about building efficient teams for fast-scaling startups.',
            img: '/aryan_t.jpg'
          }, {
            name: 'Aryan Verma',
            role: 'OPS Manager',
            desc: 'Expert in workflow automation and operations, ensuring seamless delivery for every client.',
            img: '/aryan_verma.jpg'
          }, {
            name: 'Kunal Sharma',
            role: 'Product Manager',
            desc: 'Full-stack engineer with a focus on scalable architecture and rapid MVP delivery.',
            img: '/kunal.png'
          }].map((member, idx) => (
            <motion.div key={idx} variants={fadeUp} className="bg-white rounded-lg shadow p-6 text-center hover:shadow-lg transition-shadow duration-200">
              <img src={member.img} alt={member.name} className="w-32 h-32 rounded-full mx-auto object-cover mb-4" />
              <h3 className="font-semibold text-lg">{member.name}</h3>
              <p className="text-black/70 text-sm">{member.role}</p>
              <p className="text-black/70 mt-2 text-sm">{member.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Story of Finzie's */}
      <section className="bg-[#241C15] text-white py-16 px-4">
        <motion.div
          className="max-w-6xl mx-auto text-start mb-12"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={staggerContainer}
        >
          <motion.h2 variants={fadeUp} className="text-3xl font-semibold">Finzie's Story</motion.h2>
          <motion.p variants={fadeUp} className="text-gray-300 mt-2">
            From a small startup to a global talent aggregator
          </motion.p>
        </motion.div>
        <motion.div
          className="max-w-6xl mx-auto text-gray-300 space-y-4"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={staggerContainer}
        >
          <motion.p variants={fadeUp}>
            Finzie was born out of the need for fast-moving startups to access top-tier talent quickly. Our founders, frustrated with the traditional hiring process, set out to create a platform that would streamline the way businesses connect with freelancers and AI specialists.
          </motion.p>
          <motion.p variants={fadeUp}>
            Today, Finzie is proud to be the world’s first AI talent aggregator, providing on-demand access to pre-vetted experts across various domains. Our mission is to empower startups with the resources they need to scale efficiently and effectively.
          </motion.p>
        </motion.div>
      </section>

      {/* Goals and Impact Section */}
      <section className="py-16 px-4">
        <motion.div
          className="max-w-5xl mx-auto text-center mb-12"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={staggerContainer}
        >
          <motion.h2 variants={fadeUp} className="text-3xl font-semibold">
            Our Goals & Impact
          </motion.h2>
          <motion.p variants={fadeUp} className="text-gray-600 mt-2">
            Committed to making a difference in the freelance ecosystem
          </motion.p>
        </motion.div>

        <motion.div
          className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={staggerContainer}
        >
          {[
            {
              title: 'Empower Freelancers',
              desc: 'Providing resources, mentorship, and opportunities for freelancers to grow and succeed in their careers.',
              imgSrc: '/Career.png'
            },
            {
              title: 'Build a Thriving Community',
              desc: 'Fostering a supportive environment where freelancers connect, collaborate, and share knowledge to uplift each other.',
              imgSrc: '/deals.svg'
            },
            {
              title: 'Drive Economic Impact',
              desc: 'Enabling freelancers to access better opportunities, increase income stability, and contribute to the global economy.',
              imgSrc: '/income.png'
            }
          ].map((goal, idx) => (
            <motion.div
              key={idx}
              variants={fadeUp}
              className="bg-white p-6 rounded-lg hover:shadow-md transition"
            >
              <img
                src={goal.imgSrc}
                alt={goal.title + " Icon"}
                className="mx-auto mb-4 h-28 w-28"
              />
              <h3 className="text-xl font-bold text-black/70 mb-2">{goal.title}</h3>
              <p className="text-gray-600">{goal.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>


      {/* Our Mission and Vision */}
      <section className="py-12 bg-white">
        <motion.div
          className="max-w-6xl mx-auto px-4"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={staggerContainer}
        >
          <div className="flex flex-col md:flex-row items-center md:items-stretch justify-between relative">
            {/* Mission */}
            <motion.div variants={fadeUp} className="w-full md:w-1/2 p-6 text-center md:text-right">
              <h2 className="text-2xl font-bold mb-4 text-gray-800">Our Mission</h2>
              <p className="text-gray-600">
                To empower communities through education, technology, and sustainable solutions, creating opportunities for every individual to thrive and contribute to a better world.
              </p>
            </motion.div>

            {/* Vertical Line */}
            <div className="hidden md:block w-[2px] bg-gray-400 h-40 absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>

            {/* Vision */}
            <motion.div variants={fadeUp} className="w-full md:w-1/2 p-6 text-center md:text-left">
              <h2 className="text-2xl font-bold mb-4 text-gray-800">Our Vision</h2>
              <p className="text-gray-600">
                To build a future where innovation and inclusivity drive societal progress, ensuring that technology and education are accessible to all, regardless of background.
              </p>
            </motion.div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
