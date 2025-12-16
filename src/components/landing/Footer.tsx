'use client'

export default function Footer({ text }: { text?: string }) {
  if (!text) return null

  return (
    <footer className="w-full text-[#050504] bg-[#faf4e5] py-6">
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-center">
        <p className="text-base text-[#050504]">{text}</p>
      </div>
    </footer>
  )
}
