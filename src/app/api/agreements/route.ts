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
  console.log("📩 POST request received");

  try {
    const supabase = await createClient();
    console.log("✅ Supabase client created");

    const body = await request.json();
    console.log("📦 Request body:", body);

    const { type } = body;
    console.log("📝 Agreement type:", type);

    let result;

    if (type === "client") {
      const clientAgreement: Partial<ClientAgreement> = {
        client_name: body.client_name,
        client_address: body.client_address,
        client_email: body.client_email,
        freelancer_email: body.freelancer_email,
        project_title: body.project_title,
        scope: body.scope,
        payment_terms: body.payment_terms,
        deliverables: body.deliverables,
        terms: body.terms,
        payment_amount: body.payment_amount ? Number.parseFloat(body.payment_amount) : undefined,
        currency: body.currency || "USD",
        responsibilities: body.responsibilities,
        termination: body.termination,
        confidentiality: body.confidentiality,
        governing_law: body.governing_law,
        ownership: body.ownership,
        status: "pending",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      console.log("📝 Prepared client agreement:", clientAgreement);

      result = await supabase
        .from("client_agreements")
        .insert([clientAgreement])
        .select()
        .single();

      console.log("📊 Supabase insert result (client):", result);
    } else if (type === "freelancer") {
      const freelancerAgreement: Partial<FreelancerAgreement> = {
        freelancer_name: body.freelancer_name,
        freelancer_email: body.freelancer_email,
        client_name: body.client_name,
        client_email: body.client_email,
        work_type: body.work_type,
        nda: body.nda,
        ip_rights: body.ip_rights,
        deliverables: body.deliverables,
        terms: body.terms,
        hourly_rate: body.hourly_rate ? Number.parseFloat(body.hourly_rate) : undefined,
        project_duration: body.project_duration,
        status: "pending",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      console.log("📝 Prepared freelancer agreement:", freelancerAgreement);

      result = await supabase
        .from("freelancer_agreements")
        .insert([freelancerAgreement])
        .select()
        .single();

      console.log("📊 Supabase insert result (freelancer):", result);
    } else {
      console.error("❌ Invalid type:", type);
      return NextResponse.json({ error: "Invalid agreement type" }, { status: 400 });
    }

    if (result.error) {
      console.error("❌ Supabase insert error:", result.error);
      throw new Error(result.error.message);
    }

    console.log("✅ Agreement successfully created:", result.data);

    return NextResponse.json({
      agreement: result.data,
      message: "Agreement created successfully",
    });
  } catch (error) {
    console.error("🔥 Error creating agreement:", error);
    return NextResponse.json({ error: "Failed to create agreement" }, { status: 500 });
  }
}


export async function PUT(request: NextRequest) {
  try {
    console.log("📩 PUT request received");
    const supabase = await createClient()
    const body = await request.json()
    const { id, type, ...updateData } = body
console.log("📝 Update data:", body)
    if (!id || !type) {
      return NextResponse.json({ error: "Agreement ID and type are required" }, { status: 400 })
    }
console.log("🆔 Agreement ID:", id, "Type:", type)
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
console.log("✅ Agreement successfully updated:", data)
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
    console.log("📩 DELETE request received");
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")
    const type = searchParams.get("type")
console.log("🆔 Agreement ID:", id, "Type:", type)
    if (!id || !type) {
      return NextResponse.json({ error: "Agreement ID and type are required" }, { status: 400 })
    }
console.log("🆔 Agreement ID:", id, "Type:", type)
    const tableName = type === "client" ? "client_agreements" : "freelancer_agreements"

    const { error } = await supabase.from(tableName).delete().eq("id", id)
console.log("📊 Supabase delete result:", { error })
    if (error) {
      throw new Error(error.message)
    }
console.log("✅ Agreement successfully deleted")
    return NextResponse.json({
      message: "Agreement deleted successfully",
    })
  } catch (error) {
    console.error("Error deleting agreement:", error)
    return NextResponse.json({ error: "Failed to delete agreement" }, { status: 500 })
  }
}
