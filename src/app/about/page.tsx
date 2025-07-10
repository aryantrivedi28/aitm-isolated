'use client'

import React from 'react'
import Link from 'next/link'

export default function AboutPage() {
  return (
    <main className="flex flex-col">
      {/* Hero Section */}
      <section className="bg-[#241C15] text-white text-center py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">
            Simplifying Hiring with India’s Smartest Freelancers
          </h1>
          <p className="text-lg md:text-xl mb-8">
            We connect fast-moving startups with pre-vetted freelancers and AI-powered teams so work gets done in hours, not weeks.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <Link href="/client-request">
              <button className="bg-[#FFE01B] text-black font-semibold px-8 py-3 rounded">
                Post a Task
              </button>
            </Link>
            <Link href="/all-freelancer">
              <button className="border border-white text-white font-semibold px-8 py-3 rounded">
                Hire Smarter
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Quote Section */}
      <section className="bg-white text-center py-12 px-4">
        <blockquote className="text-xl font-medium">
          “We don’t sleep until you get the absolute right freelancer.”
        </blockquote>
        <hr className="w-32 h-1 bg-[#FFE01B] border-0 mx-auto mt-4" />
      </section>

      {/* Why We Exist / How We Got Here */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white border border-gray-200 shadow p-6">
            <h3 className="text-xl font-semibold mb-2">Why We Exist</h3>
            <p className="text-gray-700">
              Finzie bridges the gap between ambitious startups and elite freelancers. We’re here so founders can scale quickly without the hassle of hunting for talent.
            </p>
          </div>
          <div className="bg-white border border-gray-200 shadow p-6">
            <h3 className="text-xl font-semibold mb-2">How We Got Here</h3>
            <p className="text-gray-700">
              After years of working with startups, we realized the struggle of sourcing reliable experts. Finzie was built to streamline that process and bring proven specialists together.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="bg-[#241C15] text-white py-16 px-4">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-[#FFE01B] text-black p-6">
            <h3 className="text-xl font-semibold mb-2">Our Mission</h3>
            <p>
              To empower growing businesses with on-demand access to India’s smartest freelancers and AI-driven teams.
            </p>
          </div>
          <div className="bg-[#FFE01B] text-black p-6">
            <h3 className="text-xl font-semibold mb-2">Our Vision</h3>
            <p>
              To become the go-to platform for startups seeking rapid execution through a trusted network of experts.
            </p>
          </div>
        </div>
      </section>

      {/* Meet the Founder */}
      <section className="bg-white text-center py-16 px-4">
        <h2 className="text-3xl font-semibold mb-6">Meet the Founder</h2>
        <img
          src="/founder.jpg"
          alt="Founder"
          className="w-40 h-40 rounded-full mx-auto mb-4 object-cover"
        />
        <p className="max-w-3xl mx-auto text-gray-700">
          Our founder has spent over a decade building and scaling startups. With a passion for connecting people, they created Finzie to help businesses find the expertise they need faster than ever.
        </p>
      </section>

      {/* Finzie in Figures */}
      <section className="bg-[#241C15] text-white py-16 px-4">
        <div className="max-w-5xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-8 text-center mb-12">
          <div>
            <p className="text-3xl font-bold text-[#FFE01B]">100+</p>
            <p className="mt-1">Talent Recruited</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-[#FFE01B]">7+</p>
            <p className="mt-1">Countries Served</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-[#FFE01B]">50+</p>
            <p className="mt-1">Clients Helped</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-[#FFE01B]">200+</p>
            <p className="mt-1">Projects Completed</p>
          </div>
        </div>
        <div className="text-center">
          <Link href="/client-request">
            <button className="bg-[#FFE01B] text-black font-semibold px-8 py-4 rounded">
              Get Started with Finzie Today
            </button>
          </Link>
        </div>
      </section>
    </main>
  )
}

