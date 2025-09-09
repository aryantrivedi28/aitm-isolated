import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "../../../lib/agreements/supabase-server"
import type { ClientAgreement, FreelancerAgreement } from "../../../types/agreement"

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const type = searchParams.get("type")
    const status = searchParams.get("status")

    let query

    if (type === "client") {
      query = supabase.from("client_agreements").select("*")
    } else if (type === "freelancer") {
      query = supabase.from("freelancer_agreements").select("*")
    } else {
      // Get both types
      const [clientResult, freelancerResult] = await Promise.all([
        supabase.from("client_agreements").select("*"),
        supabase.from("freelancer_agreements").select("*"),
      ])

      if (clientResult.error || freelancerResult.error) {
        throw new Error("Failed to fetch agreements")
      }

      const combined = [
        ...clientResult.data.map((item) => ({ ...item, type: "client" })),
        ...freelancerResult.data.map((item) => ({ ...item, type: "freelancer" })),
      ]

      return NextResponse.json({ agreements: combined })
    }

    if (status) {
      query = query.eq("status", status)
    }

    const { data, error } = await query.order("created_at", { ascending: false })

    if (error) {
      throw new Error(error.message)
    }

    return NextResponse.json({ agreements: data })
  } catch (error) {
    console.error("Error fetching agreements:", error)
    return NextResponse.json({ error: "Failed to fetch agreements" }, { status: 500 })
  }
}


export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const body = await request.json()
    const { type } = body

    let result

    if (type === "client") {
      const clientAgreement: Partial<ClientAgreement> = {
        client_name: body.client_name,
        client_address: body.client_address,
        client_email: body.client_email,
        project_title: body.project_title,
        scope: body.scope,
        payment_terms: body.payment_terms,
        deliverables: body.deliverables,
        terms: body.terms,
        payment_amount: body.payment_amount,
        currency: body.currency,
        status: "pending",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }

      result = await supabase.from("client_agreements").insert([clientAgreement]).select().single()
    } else if (type === "freelancer") {
      const freelancerAgreement: Partial<FreelancerAgreement> = {
        freelancer_name: body.freelancer_name,
        freelancer_email: body.freelancer_email,
        work_type: body.work_type,
        nda: body.nda,
        ip_rights: body.ip_rights,
        hourly_rate: body.hourly_rate,
        project_duration: body.project_duration,
        status: "pending",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }

      result = await supabase.from("freelancer_agreements").insert([freelancerAgreement]).select().single()
    } else {
      return NextResponse.json({ error: "Invalid agreement type" }, { status: 400 })
    }

    if (result.error) throw new Error(result.error.message)

    return NextResponse.json({
      agreement: result.data,
      message: "Agreement created successfully",
    })
  } catch (error) {
    console.error("Error creating agreement:", error)
    return NextResponse.json({ error: "Failed to create agreement" }, { status: 500 })
  }
}


export async function PUT(request: NextRequest) {
  try {
    const supabase = await createClient()
    const body = await request.json()
    const { id, type, ...updateData } = body

    if (!id || !type) {
      return NextResponse.json({ error: "Agreement ID and type are required" }, { status: 400 })
    }

    const tableName = type === "client" ? "client_agreements" : "freelancer_agreements"

    const { data, error } = await supabase
      .from(tableName)
      .update({
        ...updateData,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single()

    if (error) {
      throw new Error(error.message)
    }

    return NextResponse.json({
      agreement: data,
      message: "Agreement updated successfully",
    })
  } catch (error) {
    console.error("Error updating agreement:", error)
    return NextResponse.json({ error: "Failed to update agreement" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")
    const type = searchParams.get("type")

    if (!id || !type) {
      return NextResponse.json({ error: "Agreement ID and type are required" }, { status: 400 })
    }

    const tableName = type === "client" ? "client_agreements" : "freelancer_agreements"

    const { error } = await supabase.from(tableName).delete().eq("id", id)

    if (error) {
      throw new Error(error.message)
    }

    return NextResponse.json({
      message: "Agreement deleted successfully",
    })
  } catch (error) {
    console.error("Error deleting agreement:", error)
    return NextResponse.json({ error: "Failed to delete agreement" }, { status: 500 })
  }
}
