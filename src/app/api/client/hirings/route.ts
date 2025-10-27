// src/app/api/client/hirings/route.ts
import { supabase } from "../../../../lib/SupabaseAuthClient"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const client_id = searchParams.get("client_id")

  if (!client_id)
    return Response.json({ success: false, error: "client_id missing" }, { status: 400 })

  const { data, error } = await supabase
    .from("forms")
    .select("*")
    .eq("owner_id", client_id)
    .order("created_at", { ascending: false })

  if (error) return Response.json({ success: false, error: error.message })

  return Response.json({ success: true, forms: data })
}
