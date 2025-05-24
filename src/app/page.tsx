// src/app/page.tsx (Client Landing Page with Separate Button Below Typewriter)
'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

const fullText = 'One AI-powered freelancer can do the work of ten.';

export default function ClientLandingPage() {
  const [displayText, setDisplayText] = useState('');

  useEffect(() => {
    let idx = 0;
    const timer = setInterval(() => {
      setDisplayText(fullText.slice(0, idx + 1));
      idx++;
      if (idx >= fullText.length) clearInterval(timer);
    }, 50); // typing speed (ms)
    return () => clearInterval(timer);
  }, []);

  return (
    <main className="relative min-h-screen bg-[#241C15] text-white flex flex-col justify-center items-center px-4">
      {/* Top-right Freelancer button */}
      <header className="absolute top-6 right-6">
        <Link href="/freelancer">
          <button className="bg-[#FFE01B] hover:bg-yellow-300 text-black font-bold py-2 px-4 rounded">
            Freelancer
          </button>
        </Link>
      </header>

      {/* Typewriter Text */}
      <div className="w-full text-center">
        <h1 className="text-2xl md:text-4xl font-playfair whitespace-nowrap overflow-x-auto">
          {displayText}
        </h1>
      </div>

      {/* Always-present Post a Request button below typewriter */}
      <div className="mt-6">
        <Link href="/client-request">
          <button className="bg-[#FFE01B] hover:bg-yellow-300 text-black font-bold py-3 px-8 rounded-xl">
            Post a Request
          </button>
        </Link>
      </div>
    </main>
  );
}
