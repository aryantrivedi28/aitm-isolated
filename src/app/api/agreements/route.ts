import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "../../../lib/agreements/supabase-server";
import type { ClientAgreement, FreelancerAgreement } from "../../../types/agreement";

/**
 * GET — Fetch all agreements (client/freelancer/both)
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");
    const status = searchParams.get("status");

    // Fetch data based on type
    if (type === "client" || type === "freelancer") {
      const table = `${type}_agreements`;
      let query = supabase.from(table).select("*");

      if (status) query = query.eq("status", status);

      const { data, error } = await query.order("created_at", { ascending: false });
      if (error) throw new Error(error.message);

      return NextResponse.json({ agreements: data });
    }

    // Fetch both client and freelancer agreements
    const [clientResult, freelancerResult] = await Promise.all([
      supabase.from("client_agreements").select("*"),
      supabase.from("freelancer_agreements").select("*"),
    ]);

    if (clientResult.error || freelancerResult.error) {
      throw new Error("Failed to fetch agreements");
    }

    const combined = [
      ...clientResult.data.map((item) => ({ ...item, type: "client" })),
      ...freelancerResult.data.map((item) => ({ ...item, type: "freelancer" })),
    ];

    return NextResponse.json({ agreements: combined });
  } catch (error) {
    console.error("❌ Error fetching agreements:", error);
    return NextResponse.json({ error: "Failed to fetch agreements" }, { status: 500 });
  }
}

/**
 * POST — Create a new agreement (client or freelancer)
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const body = await request.json();
    const { type } = body;

    if (!type) {
      return NextResponse.json({ error: "Agreement type is required" }, { status: 400 });
    }

    let insertData;

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

      insertData = { table: "client_agreements", data: clientAgreement };
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
        rate_amount: body.rate_amount ? Number.parseFloat(body.rate_amount) : undefined,
        rate_type: body.rate_type || "hour",
        currency: body.currency || "USD",
        project_duration: body.project_duration,
        status: "pending",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      insertData = { table: "freelancer_agreements", data: freelancerAgreement };
    } else {
      return NextResponse.json({ error: "Invalid agreement type" }, { status: 400 });
    }

    // Insert into Supabase
    const { data, error } = await supabase
      .from(insertData.table)
      .insert([insertData.data])
      .select()
      .single();

    if (error) throw new Error(error.message);

    return NextResponse.json({
      agreement: data,
      message: "Agreement created successfully",
    });
  } catch (error) {
    console.error("🔥 Error creating agreement:", error);
    return NextResponse.json({ error: "Failed to create agreement" }, { status: 500 });
  }
}

/**
 * PUT — Update an existing agreement
 */
export async function PUT(request: NextRequest) {
  try {
    const supabase = await createClient();
    const body = await request.json();
    const { id, type, ...updateData } = body;

    if (!id || !type) {
      return NextResponse.json({ error: "Agreement ID and type are required" }, { status: 400 });
    }

    const tableName = type === "client" ? "client_agreements" : "freelancer_agreements";

    const { data, error } = await supabase
      .from(tableName)
      .update({
        ...updateData,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) throw new Error(error.message);

    return NextResponse.json({
      agreement: data,
      message: "Agreement updated successfully",
    });
  } catch (error) {
    console.error("❌ Error updating agreement:", error);
    return NextResponse.json({ error: "Failed to update agreement" }, { status: 500 });
  }
}

/**
 * DELETE — Remove an agreement
 */
export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const type = searchParams.get("type");

    if (!id || !type) {
      return NextResponse.json({ error: "Agreement ID and type are required" }, { status: 400 });
    }

    const tableName = type === "client" ? "client_agreements" : "freelancer_agreements";

    const { error } = await supabase.from(tableName).delete().eq("id", id);
    if (error) throw new Error(error.message);

    return NextResponse.json({ message: "Agreement deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting agreement:", error);
    return NextResponse.json({ error: "Failed to delete agreement" }, { status: 500 });
  }
}
