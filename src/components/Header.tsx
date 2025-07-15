'use client';

import { useRouter } from 'next/navigation';

export default function Header() {
  const router = useRouter();

  return (
    <div className="w-full bg-[#241C15] text-white flex justify-end px-4 py-4 space-x-4">
      <button
        onClick={() => router.push('/about')}
        className="bg-[#FFE01B] hover:bg-yellow-300 text-[#241C15] font-semibold px-6 py-2 rounded-lg transition-all duration-200"
      >
        About Us
      </button>
      <button
        onClick={() => router.push('/case-studies')}
        className="text-[#241C15] bg-[#FFE01B] font-semibold px-6 py-2 rounded-lg transition-all duration-200"
      >
        Case Studies
      </button>
      {/* <button
        onClick={() => router.push('/why')}
        className="bg-[#FFE01B] hover:bg-yellow-300 text-[#241C15] font-semibold px-6 py-2 rounded-lg transition-all duration-200"
      >
        Why Us
      </button>
      <button
        onClick={() => router.push('/services')}
        className="bg-[#FFE01B] hover:bg-yellow-300 text-[#241C15] font-semibold px-6 py-2 rounded-lg transition-all duration-200"
      >
        Services
      </button> */}
    </div>
  );
}
