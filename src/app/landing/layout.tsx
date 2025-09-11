export default function LandingLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {/* No header here */}
        {children}
      </body>
    </html>
  )
}
