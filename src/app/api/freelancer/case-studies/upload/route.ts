import { NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "../../../../../lib/supabase-admin"
import { cookies } from "next/headers"
import { v4 as uuidv4 } from "uuid"

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

/* ===========================
   POST — Upload Image
=========================== */

export async function POST(request: NextRequest) {
  try {
    const freelancerId = await getFreelancerId()
    if (!freelancerId)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const formData = await request.formData()
    const file = formData.get("file") as File
    const caseStudyId = formData.get("caseStudyId") as string

    if (!file || !caseStudyId)
      return NextResponse.json(
        { error: "File and caseStudyId required" },
        { status: 400 }
      )

    const fileExt = file.name.split(".").pop()
    const fileName = `${uuidv4()}.${fileExt}`
    const filePath = `case-studies/${freelancerId}/${fileName}`

    const { error: uploadError } = await supabaseAdmin.storage
      .from("freelancer-assets")
      .upload(filePath, file)

    if (uploadError)
      return NextResponse.json(
        { error: "Upload failed" },
        { status: 500 }
      )

    const { data: { publicUrl } } = supabaseAdmin.storage
      .from("freelancer-assets")
      .getPublicUrl(filePath)

    // Update case study record
    await supabaseAdmin
      .from("freelancer_case_studies")
      .update({
        image_url: publicUrl,
        updated_at: new Date().toISOString()
      })
      .eq("id", caseStudyId)
      .eq("freelancer_id", freelancerId)

    return NextResponse.json({
      success: true,
      imageUrl: publicUrl
    })

  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

/* ===========================
   DELETE — Remove Image
=========================== */

export async function DELETE(request: NextRequest) {
  try {
    const freelancerId = await getFreelancerId()
    if (!freelancerId)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { caseStudyId } = await request.json()

    const { data } = await supabaseAdmin
      .from("freelancer_case_studies")
      .select("image_url")
      .eq("id", caseStudyId)
      .eq("freelancer_id", freelancerId)
      .single()

    if (!data?.image_url)
      return NextResponse.json({ success: true })

    const imagePath = data.image_url.split("/storage/v1/object/public/freelancer-assets/")[1]

    await supabaseAdmin.storage
      .from("freelancer-assets")
      .remove([imagePath])

    await supabaseAdmin
      .from("freelancer_case_studies")
      .update({ image_url: null })
      .eq("id", caseStudyId)
      .eq("freelancer_id", freelancerId)

    return NextResponse.json({ success: true })

  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
