import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { supabase } from "../../../../lib/SupabaseAuthClient"



export async function GET(request: NextRequest) {

  try {

    console.log("🚀 Admin Case Studies API")


    /* ---------- AUTH ---------- */

    const cookieStore = await cookies()

    const sessionCookie = cookieStore.get("token")

    if (!sessionCookie?.value) {

      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )

    }


    /* ---------- PARAMS ---------- */

    const { searchParams } =
      new URL(request.url)


    const status =
      searchParams.get("status") || "all"

    const page =
      parseInt(
        searchParams.get("page") || "1"
      )

    const limit =
      parseInt(
        searchParams.get("limit") || "20"
      )

    const start =
      (page - 1) * limit

    const end =
      start + limit - 1


    console.log({
      status,
      page,
      limit
    })


    /* ---------- MAIN QUERY ---------- */

    let query =
      supabase
        .from("freelancer_case_studies")
        .select(`
          *,
          freelancer:freelancers(
            id,
            name,
            email,
            photo_url,
            title
          )
        `)


    if (status !== "all") {

      query =
        query.eq("status", status)

    }


    query =
      query.order(
        "created_at",
        { ascending: false }
      )


    query =
      query.range(start, end)



    const { data, error } =
      await query


    if (error) {

      console.error(error)

      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )

    }



    /* ---------- COUNT ---------- */

    let countQuery =
      supabase
        .from("freelancer_case_studies")
        .select("*", {
          count: "exact",
          head: true
        })


    if (status !== "all") {

      countQuery =
        countQuery.eq("status", status)

    }


    const { count } =
      await countQuery



    console.log("Total:", count)



    /* ---------- RESPONSE ---------- */

    return NextResponse.json({

      data,

      pagination: {

        page,

        limit,

        total: count || 0,

        totalPages:

          Math.ceil(
            (count || 0) / limit
          )

      }

    })

  }

  catch (err) {

    console.error(err)

    return NextResponse.json(
      { error: "Server Error" },
      { status: 500 }
    )

  }

}