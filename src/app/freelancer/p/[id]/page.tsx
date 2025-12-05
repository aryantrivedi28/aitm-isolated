import { createClient } from '@/src/lib/supabase-server'
import { supabase } from '../../../../lib/SupabaseAuthClient'
import { notFound } from 'next/navigation'

interface ProfilePageProps {
  params: Promise<{
    publicId: string
  }>
}

// Brand Colors - Update these with your actual brand colors
const BRAND_COLORS = {
  primary: {
    50: '#f0f9ff',
    100: '#e0f2fe',
    500: '#0ea5e9',
    600: '#0284c7',
    700: '#0369a1',
  },
  gray: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
  },
  accent: {
    500: '#8b5cf6',
    600: '#7c3aed',
  }
}

export default async function PublicFreelancerProfilePage({ params }: ProfilePageProps) {
   const resolvedParams = await params
  const publicId = resolvedParams.publicId || (resolvedParams as any).id || (resolvedParams as any).publicID

  if (!publicId || publicId === "undefined") {
    notFound()
  }

  const supabase = await createClient()

  // Fetch freelancer data
  const { data: freelancer, error } = await supabase.from("freelancers").select("*").eq("public_id", publicId).single()

  if (error || !freelancer) {
    notFound()
  }

  // Public profile data
  const publicProfile = {
    name: freelancer.name,
    title: freelancer.title,
    bio: freelancer.bio,
    skills: freelancer.skills || [],
    experience_years: freelancer.experience_years,
    education: freelancer.education || [],
    portfolio_url: freelancer.portfolio_url,
    github_url: freelancer.github_url,
    linkedin_url: freelancer.linkedin_url,
    projects: freelancer.projects || [],
    certifications: freelancer.certifications || [],
    profile_rating: freelancer.profile_rating,
    public_profile_url: freelancer.public_profile_url
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border border-gray-200">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            <div className="flex-1">
              {/* Name and Title */}
              <div className="mb-6">
                <h1 className="text-4xl font-bold text-gray-900 mb-3">
                  {publicProfile.name}
                </h1>
                {publicProfile.title && (
                  <p className="text-xl text-gray-600 font-medium mb-4">{publicProfile.title}</p>
                )}
                {publicProfile.bio && (
                  <p className="text-lg text-gray-700 leading-relaxed max-w-3xl">{publicProfile.bio}</p>
                )}
              </div>

              {/* Stats and Badges */}
              <div className="flex flex-wrap items-center gap-4">
                {publicProfile.experience_years && (
                  <div className="flex items-center bg-blue-50 px-4 py-2 rounded-full border border-blue-200">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                    <span className="text-blue-800 font-semibold text-sm">
                      {publicProfile.experience_years}+ years experience
                    </span>
                  </div>
                )}
                {publicProfile.profile_rating && (
                  <div className="flex items-center bg-yellow-50 px-4 py-2 rounded-full border border-yellow-200">
                    <span className="text-yellow-600 mr-1">⭐</span>
                    <span className="text-yellow-800 font-semibold text-sm">
                      Rated {publicProfile.profile_rating}/10
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex lg:flex-col gap-3 lg:min-w-48">
              {publicProfile.github_url && (
                <a 
                  href={publicProfile.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 bg-gray-900 text-white px-4 py-3 rounded-lg hover:bg-gray-800 transition-colors font-medium text-sm"
                >
                  <GitHubIcon className="w-4 h-4" />
                  GitHub
                </a>
              )}
              {publicProfile.portfolio_url && (
                <a 
                  href={publicProfile.portfolio_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 bg-indigo-600 text-white px-4 py-3 rounded-lg hover:bg-indigo-700 transition-colors font-medium text-sm"
                >
                  <PortfolioIcon className="w-4 h-4" />
                  Portfolio
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content - 2/3 width */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Skills Section */}
            {publicProfile.skills && publicProfile.skills.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-2 h-8 bg-blue-500 rounded-full"></div>
                  <h2 className="text-2xl font-bold text-gray-900">Skills & Expertise</h2>
                </div>
                <div className="flex flex-wrap gap-3">
                  {publicProfile.skills.map((skill: string, index: number) => (
                    <span 
                      key={index}
                      className="bg-gradient-to-r from-blue-50 to-blue-100 text-blue-800 px-4 py-2 rounded-xl font-medium border border-blue-200 hover:shadow-md transition-shadow"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Projects Section */}
            {publicProfile.projects && publicProfile.projects.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-2 h-8 bg-purple-500 rounded-full"></div>
                  <h2 className="text-2xl font-bold text-gray-900">Featured Projects</h2>
                </div>
                <div className="grid gap-6">
                  {publicProfile.projects.map((project: any, index: number) => (
                    <div 
                      key={index}
                      className="group border-l-4 border-purple-500 pl-6 py-2 hover:bg-gray-50 rounded-r-lg transition-colors"
                    >
                      <h3 className="font-bold text-gray-900 text-lg mb-2 group-hover:text-purple-700 transition-colors">
                        {project.name}
                      </h3>
                      <p className="text-gray-600 mb-3 leading-relaxed">{project.description}</p>
                      {project.tech_stack && project.tech_stack.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {project.tech_stack.map((tech: string, techIndex: number) => (
                            <span 
                              key={techIndex}
                              className="bg-gray-100 text-gray-700 px-3 py-1 rounded-lg text-sm border"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Experience Section */}
            {publicProfile.experience_years && publicProfile.experience_years > 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-2 h-8 bg-green-500 rounded-full"></div>
                  <h2 className="text-2xl font-bold text-gray-900">Professional Experience</h2>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
                    <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold text-lg">{publicProfile.experience_years}</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 text-lg">Years of Experience</h3>
                      <p className="text-gray-600 mt-1">Proven track record in full-stack development and software engineering</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Education Section */}
            {publicProfile.education && publicProfile.education.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-2 h-8 bg-orange-500 rounded-full"></div>
                  <h2 className="text-2xl font-bold text-gray-900">Education</h2>
                </div>
                <div className="space-y-4">
                  {publicProfile.education.map((edu: string | any, index: number) => (
                    <div 
                      key={index}
                      className="flex items-start gap-4 p-4 bg-orange-50 rounded-xl border border-orange-200 hover:shadow-md transition-shadow"
                    >
                      <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center flex-shrink-0">
                        <GraduationIcon className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        {typeof edu === 'string' ? (
                          <p className="text-gray-900 font-medium">{edu}</p>
                        ) : (
                          <>
                            <h3 className="font-semibold text-gray-900 text-lg">{edu.degree}</h3>
                            <p className="text-gray-600 mt-1">{edu.institution}</p>
                            {edu.year && (
                              <p className="text-orange-600 font-medium text-sm mt-1">{edu.year}</p>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar - 1/3 width */}
          <div className="space-y-8">
            
            {/* Contact & Links Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
              <h3 className="font-bold text-gray-900 text-lg mb-4">Connect & Explore</h3>
              <div className="space-y-3">
                {publicProfile.github_url && (
                  <SocialLink 
                    href={publicProfile.github_url}
                    icon={<GitHubIcon className="w-5 h-5" />}
                    label="GitHub Profile"
                    color="bg-gray-900 hover:bg-gray-800"
                  />
                )}
                {publicProfile.linkedin_url && (
                  <SocialLink 
                    href={publicProfile.linkedin_url}
                    icon={<LinkedInIcon className="w-5 h-5" />}
                    label="LinkedIn Profile"
                    color="bg-blue-600 hover:bg-blue-700"
                  />
                )}
                {publicProfile.portfolio_url && (
                  <SocialLink 
                    href={publicProfile.portfolio_url}
                    icon={<PortfolioIcon className="w-5 h-5" />}
                    label="Portfolio Website"
                    color="bg-indigo-600 hover:bg-indigo-700"
                  />
                )}
              </div>
            </div>

            {/* Certifications Card */}
            {publicProfile.certifications && publicProfile.certifications.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
                <h3 className="font-bold text-gray-900 text-lg mb-4">Certifications</h3>
                <div className="space-y-3">
                  {publicProfile.certifications.map((cert: string, index: number) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border">
                      <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                      <span className="text-gray-700 text-sm font-medium">{cert}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Rating Card */}
            {publicProfile.profile_rating && (
              <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl shadow-lg p-6 border border-yellow-200">
                <h3 className="font-bold text-gray-900 text-lg mb-4">Profile Rating</h3>
                <div className="text-center">
                  <div className="text-4xl font-bold text-yellow-600 mb-2">
                    {publicProfile.profile_rating}/10
                  </div>
                  <div className="text-yellow-500 text-2xl mb-3">
                    {'⭐'.repeat(Math.round(publicProfile.profile_rating / 2))}
                  </div>
                  <p className="text-yellow-700 text-sm font-medium">
                    AI-Powered Profile Assessment
                  </p>
                </div>
              </div>
            )}

            {/* Skills Summary Card */}
            {publicProfile.skills && publicProfile.skills.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
                <h3 className="font-bold text-gray-900 text-lg mb-4">Top Skills</h3>
                <div className="space-y-2">
                  {publicProfile.skills.slice(0, 8).map((skill: string, index: number) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-gray-700 text-sm">{skill}</span>
                      <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-blue-500 rounded-full"
                          style={{ width: `${Math.min(90, 70 + (index * 5))}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// Social Link Component
function SocialLink({ href, icon, label, color }: { href: string; icon: React.ReactNode; label: string; color: string }) {
  return (
    <a 
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`flex items-center gap-3 ${color} text-white px-4 py-3 rounded-lg transition-all hover:shadow-md font-medium text-sm`}
    >
      {icon}
      {label}
    </a>
  )
}

// Icon Components
function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
    </svg>
  )
}

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
    </svg>
  )
}

function PortfolioIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"/>
    </svg>
  )
}

function GraduationIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z"/>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"/>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14v6m0 0l-3-3m3 3l3-3"/>
    </svg>
  )
}