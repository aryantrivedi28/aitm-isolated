import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { supabase } from "../../../../lib/SupabaseAuthClient"

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {

  const cookieStore = await cookies()

  const sessionCookie =
    cookieStore.get("token")

  if (!sessionCookie?.value) {

    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    )

  }

  const body = await request.json()

  const { error } =
    await supabase
      .from("freelancer_case_studies")
      .update({

        ...body,
        updated_at:
          new Date().toISOString()

      })
      .eq("id", params.id)


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