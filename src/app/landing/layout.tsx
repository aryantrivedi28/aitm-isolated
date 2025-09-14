// src/app/landing/layout.tsx
export default function LandingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* No header here */}
      {children}
    </>
  );
}