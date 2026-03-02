import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { supabase } from "../../../../lib/SupabaseAuthClient"

/*
|--------------------------------------------------------------------------
| GET - Fetch Logged-in Freelancer Case Studies
|--------------------------------------------------------------------------
*/

export async function GET(request: Request) {

  try {

    console.log("🚀 Freelancer Case Studies API Triggered")

    const { searchParams } = new URL(request.url)

    /* ---------------- COOKIE AUTH ---------------- */

    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get("freelancer_session")

    if (!sessionCookie?.value) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const session = JSON.parse(sessionCookie.value)
    const freelancerId = session.id

    console.log("👤 Freelancer ID:", freelancerId)


    /* ---------------- BASE QUERY ---------------- */

    let query = supabase
      .from("freelancer_case_studies")
      .select(`
        *,
        freelancer:freelancers (
          id,
          name,
          photo_url,
          title,
          skills,
          profile_rating,
          verified,
          public_profile_url
        )
      `)
      .eq("freelancer_id", freelancerId)


    /* ---------------- STATUS FILTER ---------------- */

    const status = searchParams.get("status")

    if (status) {

      const statuses = status.split(",")

      console.log("📌 Status:", statuses)

      query = query.in("status", statuses)

    }


    /* ---------------- CATEGORY ---------------- */

    const category = searchParams.get("category")

    if (category) {
      query = query.eq("category", category)
    }


    /* ---------------- INDUSTRY ---------------- */

    const industry = searchParams.get("industry")

    if (industry) {
      query = query.eq("industry", industry)
    }


    /* ---------------- TAG ---------------- */

    const tag = searchParams.get("tag")

    if (tag) {
      query = query.contains("tags", [tag])
    }


    /* ---------------- FEATURED ---------------- */

    if (searchParams.get("featured") === "true") {
      query = query.eq("is_featured", true)
    }


    /* ---------------- SEARCH ---------------- */

    const search = searchParams.get("search")

    if (search) {

      query = query.or(
        `title.ilike.%${search}%,short_summary.ilike.%${search}%`
      )

    }


    /* ---------------- SORT ---------------- */

    const sortBy = searchParams.get("sort") || "created_at"
    const order = searchParams.get("order") || "desc"

    query = query.order(sortBy, {
      ascending: order === "asc"
    })


    /* ---------------- PAGINATION ---------------- */

    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "12")

    const start = (page - 1) * limit
    const end = start + limit - 1


    /* ---------------- COUNT QUERY ---------------- */

    let countQuery = supabase
      .from("freelancer_case_studies")
      .select("*", { count: "exact", head: true })
      .eq("freelancer_id", freelancerId)


    if (status) {
      countQuery = countQuery.in(
        "status",
        status.split(",")
      )
    }


    const { count } = await countQuery


    /* ---------------- FETCH ---------------- */

    query = query.range(start, end)

    const { data, error } = await query

    if (error) {

      console.error("❌ Fetch Error:", error)

      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )

    }


    console.log("✅ Case Studies:", data?.length)


    return NextResponse.json({

      data,

      pagination: {
        page,
        limit,
        total: count,
        totalPages: Math.ceil((count || 0) / limit)
      }

    })


  } catch (err) {

    console.error("🔥 API Error:", err)

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    )

  }

}


/*
|--------------------------------------------------------------------------
| POST - Create Case Study
|--------------------------------------------------------------------------
*/

export async function POST(request: Request) {

  const cookieStore = await cookies()
  const sessionCookie = cookieStore.get("freelancer_session")

  if (!sessionCookie?.value) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    )
  }

  const session = JSON.parse(sessionCookie.value)
  const freelancerId = session.id


  const body = await request.json()


  /* ---------- Generate Slug ---------- */

  let slug = body.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")


  const { data: existing } =
    await supabase
      .from("freelancer_case_studies")
      .select("slug")
      .eq("slug", slug)
      .maybeSingle()


  if (existing) {
    slug = `${slug}-${Date.now()}`
  }


  /* ---------- Insert ---------- */

  const { data, error } =
    await supabase
      .from("freelancer_case_studies")
      .insert({
        ...body,
        freelancer_id: freelancerId,
        slug,
        status: "draft"
      })
      .select()
      .single()


  if (error) {

    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )

  }


  return NextResponse.json({ data })

}


/*
|--------------------------------------------------------------------------
| DELETE Case Study
|--------------------------------------------------------------------------
*/

export async function DELETE(request: Request) {

  const cookieStore = await cookies()
  const sessionCookie = cookieStore.get("freelancer_session")

  if (!sessionCookie?.value) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    )
  }

  const session = JSON.parse(sessionCookie.value)
  const freelancerId = session.id


  const { searchParams } =
    new URL(request.url)

  const id = searchParams.get("id")

  if (!id) {
    return NextResponse.json(
      { error: "Case study ID required" },
      { status: 400 }
    )
  }


  /* Only Owner Can Delete */

  const { error } =
    await supabase
      .from("freelancer_case_studies")
      .delete()
      .eq("id", id)
      .eq("freelancer_id", freelancerId)


  if (error) {

    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )

  }


  return NextResponse.json({
    success: true
  })

}