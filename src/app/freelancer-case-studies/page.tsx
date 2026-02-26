import { Suspense } from 'react'
import FreelancerCaseStudiesContent from './FreelancerCaseStudiesContent'

export default function FreelancerCaseStudiesPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50">
        <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-16">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Freelancer Case Studies</h1>
            <p className="text-xl text-blue-100 max-w-2xl">
              Real results from our talented freelancers. See how they've helped businesses like yours succeed.
            </p>
          </div>
        </section>
        <div className="container mx-auto px-4 py-12">
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    }>
      <FreelancerCaseStudiesContent />
    </Suspense>
  )
}