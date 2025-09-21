// src/app/layout.tsx
import './globals.css';
import Header from '../components/Header';
import GoogleAnalytics from '../components/GoogleAnalytic';
import Footer from '../components/Footer';

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
        <main className="bg-[#241C15]"> {/* Adjust 'pt-16' as per your header height */}
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
