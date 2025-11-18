import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { supabaseAdmin } from "../../../../lib/supabase-admin"
import { v4 as uuidv4 } from "uuid"

export async function POST(req: NextRequest) {
  try {
    // 1️⃣ — Validate Session
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get("freelancer_session")

    if (!sessionCookie?.value)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    let session
    try {
      session = JSON.parse(sessionCookie.value)
    } catch {
      return NextResponse.json({ error: "Invalid session format" }, { status: 400 })
    }

    const freelancerId = session?.id
    if (!freelancerId)
      return NextResponse.json({ error: "Invalid session data" }, { status: 400 })

    // 2️⃣ — Extract and Validate File
    const formData = await req.formData()
    const file = formData.get("file") as File | null
    const type = formData.get("type") as "resume" | "photo" | null

    if (!file || !type)
      return NextResponse.json({ error: "File or type missing" }, { status: 400 })

    const validMimeTypes = {
      resume: [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ],
      photo: ["image/jpeg", "image/png", "image/webp"],
    }

    if (!validMimeTypes[type].includes(file.type))
      return NextResponse.json({ error: `Invalid ${type} file type` }, { status: 400 })

    const sizeLimit = type === "resume" ? 5 * 1024 * 1024 : 5 * 1024 * 1024
    if (file.size > sizeLimit)
      return NextResponse.json(
        { error: `${type} file size exceeds ${sizeLimit / 1024 / 1024}MB limit` },
        { status: 400 }
      )

    // 3️⃣ — File Upload Setup
    const bucketName = type === "resume" ? "freelancer_resumes" : "freelancer_uploads"
    const ext = file.name.split(".").pop()
    const filePath = `${freelancerId}/${type}-${uuidv4()}.${ext}`
    const buffer = Buffer.from(await file.arrayBuffer())

    // 4️⃣ — Upload File to Supabase Storage
    const { error: uploadError } = await supabaseAdmin.storage
      .from(bucketName)
      .upload(filePath, buffer, {
        contentType: file.type,
        upsert: false,
      })

    if (uploadError)
      return NextResponse.json({ error: uploadError.message }, { status: 500 })

    // 5️⃣ — Get Public URL
    const { data: publicUrlData } = supabaseAdmin.storage
      .from(bucketName)
      .getPublicUrl(filePath)

    const fileUrl = publicUrlData?.publicUrl
    if (!fileUrl)
      return NextResponse.json({ error: "Failed to generate public URL" }, { status: 500 })

    // 6️⃣ — Update Database
    const fieldToUpdate = type === "resume" ? "resume_url" : "photo_url"
    const { error: dbError } = await supabaseAdmin
      .from("freelancers")
      .update({
        [fieldToUpdate]: fileUrl,
        updated_at: new Date().toISOString(),
      })
      .eq("id", freelancerId)

    if (dbError)
      return NextResponse.json({ error: dbError.message }, { status: 500 })

    // 7️⃣ — Return Success
    return NextResponse.json({
      success: true,
      fileUrl,
      fieldUpdated: fieldToUpdate,
    })
  } catch (err: any) {
    console.error("❌ [Upload Error]", err)
    return NextResponse.json(
      { error: err.message || "Internal Server Error" },
      { status: 500 }
    )
  }
}

