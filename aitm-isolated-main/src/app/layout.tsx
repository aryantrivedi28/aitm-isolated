// src/app/layout.tsx
import './globals.css'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  console.log('🛠  RootLayout rendered on the server')
  return (
    <html lang="en">
      <head/>
      <body>{children}</body>
    </html>
  )
}
