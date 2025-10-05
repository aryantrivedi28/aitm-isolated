// src/app/layout.tsx
import './globals.css';
import Header from '../components/Header';
import GoogleAnalytics from '../components/GoogleAnalytic';
import Footer from '../components/Footer';
import PageTransition from '../components/PageTransition';
import { Toaster } from '@/components/ui/toaster';

export const metadata = {
  title: 'Finzie',
  description: '',
  icons: {
    icon: '/finzie-logo.png', // You can also use .png or .svg
  },
};
export default function RootLayout({ children }: { children: React.ReactNode; }) {
  return (
    <html lang="en">
      <head>
        <GoogleAnalytics />
      </head>
      <body>
        <Header />
        <PageTransition>
          <main className="bg-[#fbf5e5]"> {/* Adjust 'pt-16' as per your header height */}
            {children}
          </main>

        </PageTransition>
        <Toaster />
        <Footer />
      </body>
    </html>
  );
}
