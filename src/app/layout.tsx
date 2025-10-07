// src/app/layout.tsx
import './globals.css';
import Header from '../components/Header';
import GoogleAnalytics from '../components/GoogleAnalytic';
import Footer from '../components/Footer';
import PageTransition from '../components/PageTransition';
import { Toaster } from '@/components/ui/toaster';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Finzie',
  description: '',
  icons: {
    icon: '/finzie-logo.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <GoogleAnalytics /> {/* ✅ Correct placement */}
        <Header />
        <PageTransition>
          <main className="bg-[#fbf5e5]">
            {children}
          </main>
        </PageTransition>
        <Toaster />
        <Footer />
      </body>
    </html>
  );
}
