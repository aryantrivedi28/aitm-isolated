import { type NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "../../../../../lib/supabase-admin"
import { cookies } from "next/headers"
import { v4 as uuidv4 } from "uuid"

// Get freelancer ID from cookie
async function getFreelancerId() {
  const cookieStore = await cookies()
  const sessionCookie = cookieStore.get("freelancer_session")
  if (!sessionCookie?.value) return null
  try {
    const session = JSON.parse(sessionCookie.value)
    return session.id
  } catch {
    return null
  }
}

// POST — Upload Image for Case Study
export async function POST(request: NextRequest) {

  try {
    const freelancerId = await getFreelancerId()
    if (!freelancerId)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const formData = await request.formData()
    const file = formData.get('file') as File
    const itemId = formData.get('itemId') as string

    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      )
    }

    if (!itemId) {
      return NextResponse.json(
        { error: "Item ID is required" },
        { status: 400 }
      )
    }

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed" },
        { status: 400 }
      )
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "File too large. Maximum size is 5MB" },
        { status: 400 }
      )
    }

    // Generate unique filename
    const fileExt = file.name.split('.').pop()
    const fileName = `${uuidv4()}.${fileExt}`
    const filePath = `case-studies/${freelancerId}/${fileName}`


    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
      .from('freelancer-assets')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (uploadError) {
      console.error("❌ Error uploading file:", uploadError)
      return NextResponse.json({ error: "Failed to upload file" }, { status: 500 })
    }

    // Get public URL
    const { data: { publicUrl } } = supabaseAdmin.storage
      .from('freelancer-assets')
      .getPublicUrl(filePath)


    if (itemId !== 'new-case-study') {
      // Get current case studies
      const { data: currentProfile, error: fetchError } = await supabaseAdmin
        .from("freelancers")
        .select("case_studies")
        .eq("id", freelancerId)
        .single()

      if (!fetchError && currentProfile.case_studies) {
        const caseStudies = currentProfile.case_studies || []
        const caseStudyIndex = caseStudies.findIndex((item: any) => item.id === itemId)
        
        if (caseStudyIndex !== -1) {
          // Update the case study with new image
          caseStudies[caseStudyIndex] = {
            ...caseStudies[caseStudyIndex],
            image_url: publicUrl,
            image_path: filePath,
            updated_at: new Date().toISOString(),
          }

          const { error: updateError } = await supabaseAdmin
            .from("freelancers")
            .update({
              case_studies: caseStudies,
              updated_at: new Date().toISOString(),
            })
            .eq("id", freelancerId)

          if (updateError) {
            console.error("❌ Error updating case study with image:", updateError)
            // Continue anyway - the file was uploaded successfully
          }
        }
      }
    }

    return NextResponse.json({
      success: true,
      imageUrl: publicUrl,
      imagePath: filePath
    })
  } catch (error) {
    console.error("❌ POST Image Upload Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// DELETE — Remove Image for Case Study
export async function DELETE(request: NextRequest) {

  try {
    const freelancerId = await getFreelancerId()
    if (!freelancerId)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { imagePath, itemId } = await request.json()

    if (!imagePath) {
      return NextResponse.json(
        { error: "Image path is required" },
        { status: 400 }
      )
    }


    // Delete from storage
    const { error: storageError } = await supabaseAdmin.storage
      .from('freelancer-assets')
      .remove([imagePath])


    if (itemId && itemId !== 'new-case-study') {
      // Get current case studies
      const { data: currentProfile, error: fetchError } = await supabaseAdmin
        .from("freelancers")
        .select("case_studies")
        .eq("id", freelancerId)
        .single()

      if (!fetchError && currentProfile.case_studies) {
        const caseStudies = currentProfile.case_studies || []
        const caseStudyIndex = caseStudies.findIndex((item: any) => item.id === itemId)
        
        if (caseStudyIndex !== -1) {
          // Update the case study to remove image
          caseStudies[caseStudyIndex] = {
            ...caseStudies[caseStudyIndex],
            image_url: null,
            image_path: null,
            updated_at: new Date().toISOString(),
          }

          const { error: updateError } = await supabaseAdmin
            .from("freelancers")
            .update({
              case_studies: caseStudies,
              updated_at: new Date().toISOString(),
            })
            .eq("id", freelancerId)

          if (updateError) {
            console.error("❌ Error updating case study after image deletion:", updateError)
            // Continue anyway - the image was deleted from storage
          }
        }
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("❌ DELETE Image Upload Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}