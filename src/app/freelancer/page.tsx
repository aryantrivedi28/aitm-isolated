// src/app/freelancer/page.tsx
'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function FreelancerLandingPage() {
  const [displayedText, setDisplayedText] = useState('');
  const fullText = "AI won't take your job. But a person using AI will.";

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      setDisplayedText(fullText.slice(0, index + 1));
      index++;
      if (index === fullText.length) clearInterval(interval);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <main className="relative min-h-screen bg-[#241C15] text-white flex flex-col items-center justify-center px-4 text-center">
      {/* Top-right “For Business” button */}
      <header className="absolute top-6 right-6">
        <Link href="/">
          <button className="bg-[#FFE01B] hover:bg-yellow-300 text-black font-body font-bold py-2 px-4 rounded">
            For Businesses
          </button>
        </Link>
      </header>

      {/* Typewriter Effect Heading */}
      <h1 className="text-2xl md:text-3xl font-playfair mb-6">
        <span>{displayedText}</span>
        <span className="animate-pulse">|</span>
      </h1>

      {/* Start Onboarding Button */}
      <Link href="/ai-freelancer-onboarding">
        <button className=" bg-[#FFE01B] hover:bg-yellow-300 text-black font-body font-semibold px-6 py-3 rounded transition-all duration-200">
          Start Onboarding
        </button>
      </Link>
    </main>
  );
}
