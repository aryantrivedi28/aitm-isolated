export default function LandingLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-[#241C15]">
        {/* No header here */}
        {children}
      </body>
    </html>
  )
}
