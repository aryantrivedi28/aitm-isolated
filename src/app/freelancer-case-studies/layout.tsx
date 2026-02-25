import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Freelancer Case Studies | Our Talented Freelancers Work',
  description: 'Explore real-world results from our network of expert freelancers. See how they\'ve helped businesses achieve their goals.',
  openGraph: {
    title: 'Freelancer Case Studies',
    description: 'Real results from talented freelancers',
    type: 'website',
  },
}

export default function FreelancerCaseStudiesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      {children}
    </>
  )
}