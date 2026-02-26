import { supabase } from '../../../lib/SupabaseAuthClient'
import { cookies } from 'next/headers'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Calendar, User, Tag, ArrowLeft, Linkedin, Github, Globe, Award, Briefcase, Clock } from 'lucide-react'
import RelatedCaseStudies from '../components/RelatedCaseStudies'

interface Metric {
  label: string
  value: string | number
  type: 'percentage' | 'currency' | 'number'
}

export default async function FreelancerCaseStudyPage({ params }: { params: { slug: string } }) {

  
  const { data: caseStudy } = await supabase
    .from('freelancer_case_studies')
    .select(`
      *,
      freelancer:freelancers (
        id,
        full_name,
        avatar_url,
        title,
        hourly_rate,
        skills,
        experience_years,
        completed_projects,
        linkedin_url,
        github_url,
        portfolio_url,
        bio
      )
    `)
    .eq('slug', params.slug)
    .single()

  if (!caseStudy) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative h-[500px] bg-gradient-to-br from-blue-600 to-blue-800">
        <div className="absolute inset-0 overflow-hidden">
          <Image
            src={caseStudy.image_url}
            alt={caseStudy.title}
            fill
            className="object-cover opacity-20"
            priority
          />
        </div>
        
        <div className="relative container mx-auto px-4 h-full flex items-center">
          <div className="max-w-3xl text-white">
            <Link 
              href="/freelancer-case-studies"
              className="inline-flex items-center gap-2 text-blue-100 hover:text-white mb-6 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Case Studies
            </Link>
            
            <div className="flex gap-3 mb-4">
              <span className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium">
                {caseStudy.category}
              </span>
              <span className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium">
                {caseStudy.industry}
              </span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold mb-6">{caseStudy.title}</h1>
            
            <p className="text-xl text-blue-100 mb-8 max-w-2xl">
              {caseStudy.short_summary}
            </p>

            {/* Meta Info */}
            <div className="flex items-center gap-6 text-sm text-blue-100">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                {new Date(caseStudy.created_at).toLocaleDateString('en-US', {
                  month: 'long',
                  year: 'numeric'
                })}
              </div>
              <div className="flex items-center gap-2">
                <Tag className="h-4 w-4" />
                {caseStudy.technologies?.length || 0} technologies used
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content - 2 columns */}
          <div className="lg:col-span-2 space-y-8">
            {/* Problem Statement */}
            <div className="bg-white rounded-xl shadow-sm p-8">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <span className="w-1 h-8 bg-blue-600 rounded-full" />
                The Challenge
              </h2>
              <p className="text-gray-700 leading-relaxed">{caseStudy.problem_statement}</p>
            </div>

            {/* Strategy */}
            {caseStudy.strategy && (
              <div className="bg-white rounded-xl shadow-sm p-8">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <span className="w-1 h-8 bg-blue-600 rounded-full" />
                  Our Strategy
                </h2>
                <p className="text-gray-700 leading-relaxed">{caseStudy.strategy}</p>
              </div>
            )}

            {/* Solution */}
            <div className="bg-white rounded-xl shadow-sm p-8">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <span className="w-1 h-8 bg-blue-600 rounded-full" />
                The Solution
              </h2>
              <p className="text-gray-700 leading-relaxed">{caseStudy.solution_provided}</p>
            </div>

            {/* Implementation */}
            {caseStudy.implementation && (
              <div className="bg-white rounded-xl shadow-sm p-8">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <span className="w-1 h-8 bg-blue-600 rounded-full" />
                  Implementation
                </h2>
                <p className="text-gray-700 leading-relaxed">{caseStudy.implementation}</p>
              </div>
            )}

            {/* Gallery */}
            {caseStudy.gallery_images && caseStudy.gallery_images.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm p-8">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <span className="w-1 h-8 bg-blue-600 rounded-full" />
                  Project Gallery
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {caseStudy.gallery_images.map((image: string, index: number) => (
                        <div key={index} className="relative h-40 rounded-lg overflow-hidden group">
                          <Image
                              src={image}
                              alt={`Gallery image ${index + 1}`}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                    ))}
                </div>
              </div>
            )}

            {/* Testimonial */}
            {caseStudy.testimonial && (
              <div className="bg-blue-50 rounded-xl p-8 border border-blue-100">
                <svg className="h-8 w-8 text-blue-400 mb-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
                <blockquote className="text-xl text-gray-800 italic mb-4">
                  "{caseStudy.testimonial.content}"
                </blockquote>
                {caseStudy.testimonial.author && (
                  <div className="font-semibold">
                    — {caseStudy.testimonial.author}
                    {caseStudy.testimonial.role && (
                      <span className="text-gray-600 font-normal">
                        , {caseStudy.testimonial.role}
                      </span>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Sidebar - 1 column */}
          <div className="lg:col-span-1 space-y-6">
            {/* Freelancer Profile Card */}
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <User className="h-5 w-5 text-blue-600" />
                About the Freelancer
              </h3>
              
              <div className="text-center mb-6">
                <div className="relative h-24 w-24 mx-auto mb-4">
                  {caseStudy.freelancer?.avatar_url ? (
                    <Image
                      src={caseStudy.freelancer.avatar_url}
                      alt={caseStudy.freelancer.full_name}
                      fill
                      className="rounded-full object-cover border-4 border-blue-100"
                    />
                  ) : (
                    <div className="h-24 w-24 rounded-full bg-blue-100 flex items-center justify-center mx-auto border-4 border-blue-100">
                      <span className="text-3xl text-blue-600 font-semibold">
                        {caseStudy.freelancer?.full_name?.charAt(0)}
                      </span>
                    </div>
                  )}
                </div>
                
                <h4 className="font-semibold text-lg">{caseStudy.freelancer?.full_name}</h4>
                <p className="text-gray-600 text-sm mb-2">{caseStudy.freelancer?.title}</p>
                
                <div className="flex justify-center gap-3 mt-3">
                  {caseStudy.freelancer?.linkedin_url && (
                    <a href={caseStudy.freelancer.linkedin_url} target="_blank" rel="noopener noreferrer" 
                       className="p-2 bg-gray-100 rounded-full hover:bg-blue-100 transition-colors">
                      <Linkedin className="h-4 w-4 text-gray-600" />
                    </a>
                  )}
                  {caseStudy.freelancer?.github_url && (
                    <a href={caseStudy.freelancer.github_url} target="_blank" rel="noopener noreferrer"
                       className="p-2 bg-gray-100 rounded-full hover:bg-blue-100 transition-colors">
                      <Github className="h-4 w-4 text-gray-600" />
                    </a>
                  )}
                  {caseStudy.freelancer?.portfolio_url && (
                    <a href={caseStudy.freelancer.portfolio_url} target="_blank" rel="noopener noreferrer"
                       className="p-2 bg-gray-100 rounded-full hover:bg-blue-100 transition-colors">
                      <Globe className="h-4 w-4 text-gray-600" />
                    </a>
                  )}
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-center gap-1 text-gray-600 mb-1">
                    <Briefcase className="h-4 w-4" />
                  </div>
                  <div className="font-semibold">{caseStudy.freelancer?.experience_years || 0}+</div>
                  <div className="text-xs text-gray-500">Years</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-center gap-1 text-gray-600 mb-1">
                    <Award className="h-4 w-4" />
                  </div>
                  <div className="font-semibold">{caseStudy.freelancer?.completed_projects || 0}</div>
                  <div className="text-xs text-gray-500">Projects</div>
                </div>
              </div>

              {/* Skills */}
              {caseStudy.freelancer?.skills && (
                <div className="mb-6">
                  <h5 className="text-sm font-medium text-gray-700 mb-2">Skills</h5>
                  <div className="flex flex-wrap gap-2">
                  {(caseStudy.freelancer?.skills as string[])?.slice(0, 6).map((skill: string) => (
                        <span
                              key={skill}
                              className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
                        >
                              {skill}
                        </span>
                  ))}
                  </div>
                </div>
              )}

              <Link
                href={`/freelancer/p/${caseStudy.freelancer.id}`}
                className="block w-full text-center bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                View Full Profile
              </Link>
            </div>

            {/* Results Card */}
            <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl shadow-sm p-6 text-white">
              <h3 className="text-lg font-semibold mb-4">Key Results</h3>
              
            <div className="space-y-4 mb-6">
              {(caseStudy.metrics as Metric[]).map((metric: Metric, index: number) => (
                                                                  <div key={index} className="border-b border-blue-400/30 last:border-0 pb-4 last:pb-0">
                                                                        <div className="text-sm text-blue-200 mb-1">{metric.label}</div>
                                                                        <div className="text-3xl font-bold">
                                                                              {metric.type === 'percentage' 
                                                                                    ? `${metric.value}%`
                                                                                    : metric.type === 'currency'
                                                                                    ? `$${(metric.value as number).toLocaleString()}`
                                                                                    : metric.value}
                                                                        </div>
                                                                  </div>
                                                            ))}
              </div>
              
              <p className="text-blue-100 text-sm leading-relaxed">
                {caseStudy.results_overview}
              </p>
            </div>

            {/* Technologies */}
            {caseStudy.technologies && caseStudy.technologies.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold mb-4">Technologies Used</h3>
                <div className="flex flex-wrap gap-2">
                    {(caseStudy.technologies as string[]).map((tech: string) => (
                        <span
                          key={tech}
                          className="px-3 py-2 bg-gray-100 text-gray-700 text-sm rounded-lg"
                        >
                          {tech}
                        </span>
                    ))}
                </div>
              </div>
            )}

            {/* Project Link */}
            {caseStudy.project_url && (
              <a
                href={caseStudy.project_url}
                target="_blank"
                rel="noopener noreferrer"
                className="block bg-white rounded-xl shadow-sm p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold mb-1">View Live Project</h3>
                    <p className="text-sm text-gray-500">{caseStudy.project_url}</p>
                  </div>
                  <Globe className="h-5 w-5 text-blue-600" />
                </div>
              </a>
            )}
          </div>
        </div>
      </section>

      {/* Related Case Studies */}
      <section className="bg-white border-t py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8">More Case Studies</h2>
          <RelatedCaseStudies 
            currentId={caseStudy.id}
            category={caseStudy.category}
            freelancerId={caseStudy.freelancer_id}
          />
        </div>
      </section>
    </div>
  )
}