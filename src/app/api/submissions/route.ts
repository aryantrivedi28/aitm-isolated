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
import { OpenAIProfileRater, parseResumeToProfile } from '../../../lib/open-ai-profile-rater'
import { ScrapingService } from '../../../lib/services/scrapingService'
import { createClient } from "../../../lib/supabase-server"


export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const submissionData = await request.json()

    const { data: submission, error } = await supabase
      .from("freelancer_submissions")
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
        custom_responses: submissionData.custom_responses,
      })
      .select()
      .single()

    if (error) {
      console.error("Submission error:", error)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    const freelancer = await findOrCreateFreelancer(submissionData, supabase)

    if (submissionData.resume_link) {
      // Fire and forget with 25 second timeout to avoid exceeding Vercel limit
      processResumeBackground(submission.id, freelancer.id, submissionData.resume_link, submissionData, supabase).catch(
        (err) => console.error("Background processing failed:", err),
      )
    }

    return NextResponse.json({
      success: true,
      submissionId: submission.id,
      freelancerId: freelancer.id,
      message: "Application submitted successfully",
    })
  } catch (error: any) {
    console.error("Submission error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

async function findOrCreateFreelancer(formData: any, supabase: any) {
  try {
    // Try to find existing freelancer by email
    const { data: existingFreelancer } = await supabase
      .from("freelancers")
      .select("*")
      .eq("email", formData.email)
      .single()

    if (existingFreelancer) {
      // Update existing freelancer with basic info
      const { data: updatedFreelancer } = await supabase
        .from("freelancers")
        .update({
          name: formData.name || existingFreelancer.name,
          phone: formData.phone || existingFreelancer.phone,
          experience_years: formData.years_experience || existingFreelancer.experience_years,
          portfolio_url: formData.portfolio_link || existingFreelancer.portfolio_url,
          github_url: formData.github_link || existingFreelancer.github_url,
          resume_url: formData.resume_link || existingFreelancer.resume_url,
          portfolio_links: {
            github: formData.github_link,
            portfolio: formData.portfolio_link,
          },
          updated_at: new Date().toISOString(),
        })
        .eq("id", existingFreelancer.id)
        .select()
        .single()

      return updatedFreelancer!
    }

    // Create new freelancer with public_id for shareable profile
    const { data: newFreelancer, error } = await supabase
      .from("freelancers")
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
          portfolio: formData.portfolio_link,
        },
        public_id: generatePublicId(),
        profile_status: "pending",
        profile_completed: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) throw error
    return newFreelancer
  } catch (error) {
    console.error("Error in findOrCreateFreelancer:", error)
    throw error
  }
}

async function processResumeBackground(
  submissionId: string,
  freelancerId: string,
  resumeUrl: string,
  formData: any,
  supabase: any,
) {
  try {
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Processing timeout - exceeded 25 seconds")), 25000),
    )

    const processingPromise = (async () => {
      console.log("🔄 Starting resume processing for submission:", submissionId)

      // Step 1: Extract text from resume using ScrapingService
      const parserService = new ScrapingService()
      const rawText = await parserService.parseResume(resumeUrl)

      if (!rawText || typeof rawText !== "string" || rawText.length < 50) {
        console.error("❌ Failed to extract resume text or text too short")
        return
      }

      console.log("📝 Resume text extracted, length:", rawText.length)

      // Step 2: Convert resume text → structured profile
      const structuredProfile = await parseResumeToProfile(rawText)
      console.log("🧩 Structured profile created")

      // Step 3: Rate structured profile
      const rater = new OpenAIProfileRater()
      const ratingResult = await rater.calculateAverageRating(structuredProfile)
      console.log("⭐ Profile rated:", ratingResult.rating)

      // Step 4: Combine profile with rating
      const parseResult = {
        profile: {
          ...structuredProfile,
          profile_rating: ratingResult.rating,
          rating_feedback: ratingResult.feedback,
        },
      }

      // Step 5: Update freelancer with parsed data
      await updateFreelancerWithParsedData(freelancerId, parseResult.profile, formData, supabase)

      // Step 6: Update submission to mark as processed
      await supabase
        .from("freelancer_submissions")
        .update({
          processed_at: new Date().toISOString(),
          extraction_data: parseResult.profile,
        })
        .eq("id", submissionId)

      console.log("✅ Resume processed successfully for submission:", submissionId)
    })()

    await Promise.race([processingPromise, timeoutPromise])
  } catch (error) {
    console.error("🚨 Background processing error:", error)
    try {
      await supabase
        .from("freelancer_submissions")
        .update({
          processing_error: error instanceof Error ? error.message : "Unknown error",
          processed_at: new Date().toISOString(),
        })
        .eq("id", submissionId)
    } catch (updateError) {
      console.error("Failed to update error status:", updateError)
    }
  }
}

async function updateFreelancerWithParsedData(freelancerId: string, parsedData: any, formData: any, supabase: any) {
  try {
    console.log("🔄 Updating freelancer with parsed data")

    const publicId = generatePublicId()
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL
      ? `https://${process.env.NEXT_PUBLIC_APP_URL}`
      : `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL || "finzie.co"}`

    const publicProfileUrl = `${baseUrl}/freelancer/p/${publicId}`

    const skillsArray = Array.isArray(parsedData.skills) ? parsedData.skills.map((skill: any) => String(skill)) : []

    const educationArray = Array.isArray(parsedData.education)
      ? parsedData.education.map((edu: any) => {
          if (typeof edu === "string") return edu
          return `${edu.degree || ""} at ${edu.institution || ""} ${edu.year || ""}`.trim()
        })
      : []

    const certificationsArray = Array.isArray(parsedData.certifications)
      ? parsedData.certifications.map((cert: any) => String(cert))
      : []

    const ratingFeedbackArray = Array.isArray(parsedData.rating_feedback)
      ? parsedData.rating_feedback.map((feedback: any) => String(feedback))
      : []

    const projectsArray = Array.isArray(parsedData.projects) ? parsedData.projects : []

    const updateData: any = {
      name: parsedData.name || formData.name,
      title: parsedData.title || "",
      bio: parsedData.bio || "",
      email: formData.email || "",
      phone: formData.phone || "",
      skills: skillsArray,
      experience_years: parsedData.experience_years || formData.years_experience || 0,
      education: educationArray,
      portfolio_url: parsedData.portfolio_url || formData.portfolio_link || "",
      github_url: parsedData.github_url || formData.github_link || "",
      linkedin_url: parsedData.linkedin_url || "",
      twitter_url: parsedData.twitter_url || "",
      projects: projectsArray,
      certifications: certificationsArray,
      profile_rating: parsedData.profile_rating || null,
      rating_feedback: ratingFeedbackArray,
      resume_url: formData.resume_link || "",
      public_id: publicId,
      public_profile_url: publicProfileUrl,
      profile_status: "active",
      profile_completed: true,
      verified: false,
      email_verified: false,
      updated_at: new Date().toISOString(),
      last_profile_update: new Date().toISOString(),
      portfolio_links: {
        github: formData.github_link,
        portfolio: formData.portfolio_link,
      },
    }

    if (parsedData.education && parsedData.education.length > 0) {
      const firstEducation = parsedData.education[0]
      if (firstEducation && firstEducation.year) {
        const yearMatch = firstEducation.year.toString().match(/(20\d{2})/)
        if (yearMatch) {
          updateData.graduation_year = Number.parseInt(yearMatch[1])
        }
      }
    }

    const { data, error } = await supabase.from("freelancers").update(updateData).eq("id", freelancerId).select()

    if (error) {
      console.error("🚨 Supabase update error:", error)
      throw error
    }

    return data
  } catch (error) {
    console.error("🚨 Error in updateFreelancerWithParsedData:", error)
    throw error
  }
}

function generatePublicId(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}
