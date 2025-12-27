'use client';

import Link from 'next/link';

export default function ThankYouClient() {
  return (
    <main className="min-h-screen bg-[#faf4e5] text-[#050504] flex flex-col items-center justify-center px-4 text-center">
      <h1 className="text-2xl md:text-3xl font-serif mb-4" style={{ fontFamily: 'Playfair Display' }}>
        Thanks for submitting your request!
      </h1>
      <p className="text-lg max-w-xl" style={{ fontFamily: 'Roboto' }}>
        We’ll reach out to you on WhatsApp shortly with matched talent.
      </p>
      <Link href="/">
        <button className="mt-6 bg-[#f7af00] text-[#050504] font-semibold px-6 py-3 rounded transition-all duration-200" style={{ fontFamily: 'Roboto' }}>
          Back to Home
        </button>
      </Link>
    </main>
  );
}
