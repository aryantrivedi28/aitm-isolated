'use client'

export default function Footer({ text }: { text?: string }) {
  if (!text) return null

  return (
    <footer className="w-full bg-[#241C15] text-white py-6">
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-center">
        <p className="text-sm text-white/70">{text}</p>
      </div>
    </footer>
  )
}
