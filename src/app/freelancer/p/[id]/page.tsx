import { supabase } from '../../../../lib/SupabaseAuthClient'
import { notFound } from 'next/navigation'

interface ProfilePageProps {
  params: Promise<{
    publicId: string
  }>
}

export default async function PublicFreelancerProfilePage({ params }: ProfilePageProps) {
  const resolvedParams = await params

   console.log("🔍 [DEBUG] Full params object:", resolvedParams)
  console.log("🔍 [DEBUG] All keys in params:", Object.keys(resolvedParams))
  
  // Try different parameter names
  const publicId = resolvedParams.publicId || 
                   (resolvedParams as any).id || 
                   (resolvedParams as any).publicID
  
  console.log("🔍 [DEBUG] Trying to get publicId:", publicId)
  console.log("🔍 [DEBUG] Type of publicId:", typeof publicId)

  if (!publicId || publicId === 'undefined') {
    console.log("❌ No valid publicId found")
    notFound()
  }

  console.log("✅ Using publicId:", publicId)
//   const { publicId } = resolvedParams

  console.log("🔍 Fetching profile for public ID:", publicId)

  if (!publicId || publicId === 'undefined') {
    notFound()
  }

  // Fetch freelancer data using public_id
  const { data: freelancer, error } = await supabase
    .from('freelancers')
    .select('*')
    .eq('public_id', publicId)
    .single()

  console.log("👤 Fetched freelancer data:", freelancer)

  if (error || !freelancer) {
    console.log("❌ Error fetching freelancer:", error)
    notFound()
  }

  // Only show public information (exclude contact details)
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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {publicProfile.name}
              </h1>
              {publicProfile.title && (
                <p className="text-xl text-gray-600 mb-4">{publicProfile.title}</p>
              )}
              {publicProfile.bio && (
                <p className="text-gray-600 text-lg mb-4">{publicProfile.bio}</p>
              )}
            </div>
            {publicProfile.public_profile_url && (
              <div className="text-sm text-gray-500">
                Public Profile
              </div>
            )}
          </div>
          
          <div className="flex flex-wrap gap-2 mt-4">
            {publicProfile.experience_years && (
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                {publicProfile.experience_years} years experience
              </span>
            )}
            {publicProfile.profile_rating && (
              <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm">
                ⭐ {publicProfile.profile_rating}/10 Rating
              </span>
            )}
            {publicProfile.skills?.slice(0, 5).map((skill: string, index: number) => (
              <span key={index} className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                {skill}
              </span>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Skills */}
            {publicProfile.skills && publicProfile.skills.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Skills & Expertise</h2>
                <div className="flex flex-wrap gap-2">
                  {publicProfile.skills.map((skill: string, index: number) => (
                    <span key={index} className="bg-gray-100 text-gray-800 px-3 py-2 rounded-lg text-sm">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Experience */}
            {publicProfile.experience_years && publicProfile.experience_years > 0 && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Experience</h2>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
                    <div>
                      <p className="font-semibold text-gray-900">{publicProfile.experience_years}+ years of professional experience</p>
                      <p className="text-gray-600">Full-stack development and software engineering</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Projects */}
            {publicProfile.projects && publicProfile.projects.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Projects</h2>
                <div className="space-y-4">
                  {publicProfile.projects.map((project: any, index: number) => (
                    <div key={index} className="border-l-4 border-purple-500 pl-4">
                      <h3 className="font-semibold text-gray-900 text-lg">{project.name}</h3>
                      <p className="text-gray-600 mt-2">{project.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Education */}
            {publicProfile.education && publicProfile.education.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Education</h2>
                <div className="space-y-3">
                  {publicProfile.education.map((edu: string | any, index: number) => (
                    <div key={index} className="flex items-start">
                      <div className="w-3 h-3 bg-green-500 rounded-full mr-3 mt-1.5"></div>
                      <div>
                        {typeof edu === 'string' ? (
                          <p className="text-gray-900">{edu}</p>
                        ) : (
                          <>
                            <h3 className="font-semibold text-gray-900">{edu.degree}</h3>
                            <p className="text-gray-600">{edu.institution}</p>
                            {edu.year && (
                              <p className="text-gray-500 text-sm">{edu.year}</p>
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

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Portfolio Links */}
            {(publicProfile.portfolio_url || publicProfile.github_url || publicProfile.linkedin_url) && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Portfolio & Links</h2>
                <div className="space-y-2">
                  {publicProfile.github_url && (
                    <a 
                      href={publicProfile.github_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                      </svg>
                      GitHub Profile
                    </a>
                  )}
                  {publicProfile.portfolio_url && (
                    <a 
                      href={publicProfile.portfolio_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"/>
                      </svg>
                      Portfolio Website
                    </a>
                  )}
                  {publicProfile.linkedin_url && (
                    <a 
                      href={publicProfile.linkedin_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                      </svg>
                      LinkedIn Profile
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* Certifications */}
            {publicProfile.certifications && publicProfile.certifications.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Certifications</h2>
                <div className="space-y-2">
                  {publicProfile.certifications.map((cert: string, index: number) => (
                    <div key={index} className="flex items-center">
                      <div className="w-2 h-2 bg-gray-400 rounded-full mr-3"></div>
                      <span className="text-gray-600">{cert}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Rating */}
            {publicProfile.profile_rating && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Profile Rating</h2>
                <div className="flex items-center">
                  <div className="text-3xl font-bold text-yellow-600 mr-3">
                    {publicProfile.profile_rating}/10
                  </div>
                  <div className="text-yellow-500 text-2xl">
                    {'⭐'.repeat(Math.round(publicProfile.profile_rating / 2))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}