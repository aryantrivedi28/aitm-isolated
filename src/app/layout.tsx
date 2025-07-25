// src/app/layout.tsx
import './globals.css'
import Header from '../components/Header';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  console.log('🛠  RootLayout rendered on the server')
  return (
    <html lang="en">
      <head/>
      <body>
        <Header />
        <main className="py-32 bg-[#241C15]"> {/* Adjust 'pt-16' as per your header height */}
          {children}
        </main>
      </body>
    </html>
  )
}
