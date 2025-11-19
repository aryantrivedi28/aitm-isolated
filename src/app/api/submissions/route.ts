// import { NextResponse } from "next/server"
// import { supabaseAdmin } from "../../../lib/supabase-admin"
// import OpenAI from "openai"

// const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY2 })

// export async function POST(req: Request) {
//   try {
//     const body = await req.json()

//     const {
//       form_id,
//       name,
//       email,
//       phone,
//       portfolio_link,
//       github_link,
//       resume_link,
//       years_experience,
//       proposal_link,
//       custom_responses,
//     } = body

//     // Validate required fields (minimal: form_id, name, email)
//     if (!form_id || !name || !email) {
//       return NextResponse.json({ error: "Missing required fields: form_id, name, email" }, { status: 400 })
//     }

//     // Fetch the client form
//     let formQuery = supabaseAdmin.from("forms").select("*")
//     const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(form_id)
//     formQuery = isUUID ? formQuery.eq("id", form_id) : formQuery.eq("form_id", form_id)

//     const { data: form, error: formError } = await formQuery.single()

//     if (formError) {
//       return NextResponse.json({ error: "Form not found" }, { status: 404 })
//     }

//     if (!form) {
//       return NextResponse.json({ error: "Form not found" }, { status: 404 })
//     }

//     if (!form.is_active) {
//       return NextResponse.json({ error: "Form submissions are closed" }, { status: 403 })
//     }

//     // Build submission data
//     const submissionData: any = {
//       form_id: form.id, // Use the actual form UUID, not the custom form_id
//       name,
//       email,
//       phone: phone || null,
//       portfolio_link: portfolio_link || null,
//       github_link: github_link || null,
//       resume_link: resume_link || null,
//       years_experience: years_experience ? Number(years_experience) : null,
//       proposal_link: proposal_link || null,
//       custom_responses: custom_responses || {},
//       profile_rating: null,
//     }

//     const { data: insertedSubmission, error: insertError } = await supabaseAdmin
//       .from("freelancer_submissions")
//       .insert([submissionData])
//       .select()
//       .single()

//     if (insertError) {
//       throw insertError
//     }

//     // Build AI prompt including dynamic required fields and form description
//     const clientRequirements = {
//       category: form.category,
//       subcategory: form.subcategory,
//       tech_stack: form.tech_stack,
//       tools: form.tools,
//       required_fields: form.required_fields,
//       custom_questions: form.custom_questions,
//       description: form.form_description || "",
//     }


//     const aiPrompt = `
// You are an AI evaluator for a client hiring platform.
// Evaluate the freelancer's profile according to the client requirements.

// Client Requirements: ${JSON.stringify(clientRequirements, null, 2)}

// Freelancer Submission: ${JSON.stringify(submissionData, null, 2)}

// Instructions:
// - Consider only the required_fields defined in the client form.
// - Evaluate skills, experience, and relevance to the client requirements.
// - Return only JSON: {"profile_rating": number between 1-10}
// `

//     // Call OpenAI
//     const aiRes = await openai.chat.completions.create({
//       model: "gpt-4o-mini",
//       messages: [{ role: "user", content: aiPrompt }],
//     })

//     // Safely parse AI response
//     let profileRating = 1
//     try {
//       let aiMessage = aiRes.choices[0].message?.content || ""
//       aiMessage = aiMessage.replace(/```json|```/g, "").trim()
//       const parsed = JSON.parse(aiMessage)
//       profileRating = Math.max(1, Math.min(10, parsed.profile_rating || 1))
//     } catch (err) {
//       profileRating = 1
//     }

//     // Update submission with profile rating
//     const { data: updatedSubmission, error: updateError } = await supabaseAdmin
//       .from("freelancer_submissions")
//       .update({ profile_rating: profileRating })
//       .eq("id", insertedSubmission.id)
//       .select()
//       .single()

//     if (updateError) {
//       throw updateError
//     }

//     return NextResponse.json({ submission: updatedSubmission, success: true })
//   } catch (err: any) {
//     console.error("[v0] Error creating submission:", err)
//     return NextResponse.json({ error: err.message || "Failed to create submission" }, { status: 500 })
//   }
// }



import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '../../../lib/SupabaseAuthClient'

export async function POST(request: NextRequest) {
  try {
    const submissionData = await request.json()

    // Insert into freelancer_submissions table
    const { data: submission, error } = await supabase
      .from('freelancer_submissions')
      .insert({
        form_id: submissionData.form_id,
        name: submissionData.name,
        email: submissionData.email,
        phone: submissionData.phone,
        portfolio_link: submissionData.portfolio_link,
        github_link: submissionData.github_link,
        resume_link: submissionData.resume_link,
        years_experience: submissionData.years_experience,
        proposal_link: submissionData.proposal_link,
        custom_responses: submissionData.custom_responses
      })
      .select()
      .single()

    if (error) {
      console.error('Submission error:', error)
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }

    // Create or update freelancer profile
    const freelancer = await findOrCreateFreelancer(submissionData)

    // Trigger resume processing if resume is provided
    if (submissionData.resume_link) {
      // Process in background - don't wait for completion
      processResumeBackground(submission.id, freelancer.id, submissionData.resume_link, submissionData)
    }

    return NextResponse.json({
      success: true,
      submissionId: submission.id,
      freelancerId: freelancer.id,
      message: 'Application submitted successfully'
    })

  } catch (error: any) {
    console.error('Submission error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

async function findOrCreateFreelancer(formData: any) {
  // Try to find existing freelancer by email
  const { data: existingFreelancer } = await supabase
    .from('freelancers')
    .select('*')
    .eq('email', formData.email)
    .single()

  if (existingFreelancer) {
    // Update existing freelancer with basic info
    const { data: updatedFreelancer } = await supabase
      .from('freelancers')
      .update({
        name: formData.name || existingFreelancer.name,
        phone: formData.phone || existingFreelancer.phone,
        experience_years: formData.years_experience || existingFreelancer.experience_years,
        portfolio_url: formData.portfolio_link || existingFreelancer.portfolio_url,
        github_url: formData.github_link || existingFreelancer.github_url,
        resume_url: formData.resume_link || existingFreelancer.resume_url,
        portfolio_links: {
          github: formData.github_link,
          portfolio: formData.portfolio_link
        },
        updated_at: new Date().toISOString()
      })
      .eq('id', existingFreelancer.id)
      .select()
      .single()

    return updatedFreelancer!
  }

  // Create new freelancer with public_id for shareable profile
  const { data: newFreelancer, error } = await supabase
    .from('freelancers')
    .insert({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      experience_years: formData.years_experience,
      portfolio_url: formData.portfolio_link,
      github_url: formData.github_link,
      resume_url: formData.resume_link,
      portfolio_links: {
        github: formData.github_link,
        portfolio: formData.portfolio_link
      },
      public_id: generatePublicId(),
      profile_status: 'pending',
      profile_completed: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })
    .select()
    .single()

  if (error) throw error
  return newFreelancer
}

// Process resume in background using your existing API
async function processResumeBackground(submissionId: string, freelancerId: string, resumeUrl: string, formData: any) {
  try {
    // Get the base URL for the application
    const baseUrl = process.env.NEXTAUTH_URL || "https://finzie.co"

    // Call your existing parse-resume API with absolute URL
    const response = await fetch(`${baseUrl}/api/freelancer/parse-resume`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fileUrl: resumeUrl,
        // You might need to adjust the payload based on your API requirements
      }),
    })

    if (response.ok) {
      const parseResult = await response.json()

      // Update freelancer with parsed data
      await updateFreelancerWithParsedData(freelancerId, parseResult.profile, formData)

      // Update submission to mark as processed
      await supabase
        .from('freelancer_submissions')
        .update({
          processed_at: new Date().toISOString(),
          extraction_data: parseResult.profile
        })
        .eq('id', submissionId)

      console.log('✅ Resume processed successfully for submission:', submissionId)
    } else {
      const errorText = await response.text()
      console.warn('❌ Resume parsing failed:', response.status, errorText)
      // Continue without extracted data
    }
  } catch (error) {
    console.error('🚨 Background processing error:', error)
    // Don't fail the submission if parsing fails
  }
}

async function updateFreelancerWithParsedData(freelancerId: string, parsedData: any, formData: any) {
  try {
    console.log('🔄 Updating freelancer with parsed data:', parsedData)

    // Generate public_id if it doesn't exist
    const publicId = generatePublicId()

    // Determine base URL based on environment
    const baseUrl = process.env.NEXTAUTH_URL || "https://finzie.co"

    const publicProfileUrl = `${baseUrl}/freelancer/p/${publicId}`

    // Convert complex arrays to text arrays for database compatibility
    const skillsArray = Array.isArray(parsedData.skills)
      ? parsedData.skills.map((skill: any) => String(skill))
      : [];

    const educationArray = Array.isArray(parsedData.education)
      ? parsedData.education.map((edu: any) => {
        if (typeof edu === 'string') return edu;
        return `${edu.degree || ''} at ${edu.institution || ''} ${edu.year || ''}`.trim();
      })
      : [];

    const certificationsArray = Array.isArray(parsedData.certifications)
      ? parsedData.certifications.map((cert: any) => String(cert))
      : [];

    const ratingFeedbackArray = Array.isArray(parsedData.rating_feedback)
      ? parsedData.rating_feedback.map((feedback: any) => String(feedback))
      : [];

    // Keep projects as JSONB (already correct)
    const projectsArray = Array.isArray(parsedData.projects) ? parsedData.projects : [];

    const updateData: any = {
      // Basic info
      name: parsedData.name || formData.name,
      title: parsedData.title || '',
      bio: parsedData.bio || '',

      // Contact info (from form)
      email: formData.email || '',
      phone: formData.phone || '',

      // Skills & expertise - convert to text[]
      skills: skillsArray,
      experience_years: parsedData.experience_years || formData.years_experience || 0,

      // Education - convert to text[]
      education: educationArray,

      // Portfolio links
      portfolio_url: parsedData.portfolio_url || formData.portfolio_link || '',
      github_url: parsedData.github_url || formData.github_link || '',
      linkedin_url: parsedData.linkedin_url || '',
      twitter_url: parsedData.twitter_url || '',

      // Projects - keep as JSONB
      projects: projectsArray,

      // Certifications - convert to text[]
      certifications: certificationsArray,

      // Rating info
      profile_rating: parsedData.profile_rating || null,
      rating_feedback: ratingFeedbackArray,

      // Resume URL
      resume_url: formData.resume_link || '',

      // Public profile info
      public_id: publicId,
      public_profile_url: publicProfileUrl,

      // Profile status
      profile_status: 'active',
      profile_completed: true,
      verified: false,
      email_verified: false,

      // Update timestamp
      updated_at: new Date().toISOString(),
      last_profile_update: new Date().toISOString(),

      // Store extraction data for reference in portfolio_links (JSONB field)
      portfolio_links: {
        github: formData.github_link,
        portfolio: formData.portfolio_link
      }
    }

    // Handle graduation year extraction
    if (parsedData.education && parsedData.education.length > 0) {
      const firstEducation = parsedData.education[0];
      if (firstEducation && firstEducation.year) {
        const yearMatch = firstEducation.year.toString().match(/(20\d{2})/);
        if (yearMatch) {
          updateData.graduation_year = parseInt(yearMatch[1]);
        }
      }
    }

    console.log('📝 Final update data for database:', JSON.stringify(updateData, null, 2))
    console.log('🔗 Public Profile URL:', publicProfileUrl)

    // First, let's check if the freelancer exists and see current data
    const { data: existingFreelancer, error: fetchError } = await supabase
      .from('freelancers')
      .select('*')
      .eq('id', freelancerId)
      .single()

    if (fetchError) {
      console.error('🚨 Error fetching freelancer:', fetchError)
      throw fetchError
    }

    console.log('📊 Existing freelancer before update:', existingFreelancer)

    // Perform the update
    const { data, error } = await supabase
      .from('freelancers')
      .update(updateData)
      .eq('id', freelancerId)
      .select()

    if (error) {
      console.error('🚨 Supabase update error:', error)
      console.error('🚨 Error details:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      })
      throw error
    }

    return data

  } catch (error) {
    console.error('🚨 Error in updateFreelancerWithParsedData:', error)
    throw error
  }
}

function generatePublicId(): string {
  return Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
}