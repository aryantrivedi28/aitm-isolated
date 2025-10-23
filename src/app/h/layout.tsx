// app/landing/layout.tsx
export const metadata = {
  title: 'Landing Pages',
  description: 'Landing page layout without header/footer',
}

export default function LandingLayout({ children }: { children: React.ReactNode }) {
  // Just render the children, no Header/Footer
  return (
    <>
      {/* <body> */}
        {children}
      {/* </body> */}
    </>
  )
}
