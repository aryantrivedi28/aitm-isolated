'use client'

export default function Footer({ text }: { text?: string }) {
  if (!text) return null

  return (
    <footer className="w-full text-[#241C15] bg-white py-6">
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-center">
        <p className="text-sm text-[#241C15]">{text}</p>
      </div>
    </footer>
  )
}
