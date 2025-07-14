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
        {children}</body>
    </html>
  )
}
