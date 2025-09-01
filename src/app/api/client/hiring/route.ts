"use server";

import { NextResponse } from "next/server";
import { supabaseAdmin } from "../../../../lib/supabase-admin";
import { cookies } from "next/headers";
import { sendEmail } from "../../../../lib/mailer"; // make sure you have this

export async function POST(req: Request) {
  try {
    console.log("📥 Incoming hiring request...");

    const body = await req.json();
    console.log("📝 Request body:", body);

    const { role_type, job_title, description, budget_range, category, subcategory, tools } = body;

    // ✅ Basic validation
    if (!role_type || !job_title || !description || !budget_range || !category) {
      console.error("⚠️ Missing required fields in request body");
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // ✅ Read cookie for client session
    const cookieStore = await cookies();
    const session = cookieStore.get("client_auth")?.value;
    console.log("🍪 Raw cookie session:", session);

    if (!session) {
      console.error("❌ No client_auth cookie found. Unauthorized request.");
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    let email: string | undefined;
    try {
      const parsed = JSON.parse(session);
      email = parsed?.email;
      console.log("✅ Parsed cookie:", parsed);
    } catch (err) {
      console.error("❌ Cookie JSON parse error:", err);
      return NextResponse.json({ success: false, error: "Invalid session cookie" }, { status: 400 });
    }

    if (!email) {
      console.error("❌ No email found in session cookie");
      return NextResponse.json({ success: false, error: "Invalid session" }, { status: 400 });
    }

    // ✅ Get client info from database
    console.log("🔎 Fetching client info for email:", email);
    const { data: clientData, error: clientError } = await supabaseAdmin
      .from("client_table")
      .select("*")
      .eq("email", email)
      .single();

    if (clientError) {
      console.error("❌ Error fetching client info:", clientError);
      return NextResponse.json({ success: false, error: clientError.message }, { status: 500 });
    }

    if (!clientData) {
      console.error("❌ No client found for email:", email);
      return NextResponse.json({ success: false, error: "Client not found" }, { status: 404 });
    }

    const client_id = clientData.id;
    console.log("✅ Found client_id:", client_id);

    // ✅ Insert new hiring request
    console.log("📤 Inserting new hiring request into 'hiring_requests'...");
    const { data: hiringData, error: hiringError } = await supabaseAdmin
      .from("hiring_requests")
      .insert([
        {
          client_id,
          role_type,
          job_title,
          description,
          budget_range,
          category,
          subcategory,
          tools,
        },
      ])
      .select("*")
      .single();

    if (hiringError) {
      console.error("❌ Error inserting hiring request:", hiringError);
      return NextResponse.json({ success: false, error: hiringError.message }, { status: 500 });
    }

    console.log("✅ Hiring request created successfully:", hiringData);

    // ✅ Fetch all hiring requests for this client
    console.log("🔎 Fetching all hiring requests for client...");
    const { data: allRequests, error: requestsError } = await supabaseAdmin
      .from("hiring_requests")
      .select("*")
      .eq("client_id", client_id);

    if (requestsError) {
      console.error("❌ Error fetching hiring requests:", requestsError);
    }
    console.log("📄 All client hiring requests:", allRequests);

    // ✅ Prepare HTML for admin email
    const requestsHtml = allRequests?.map(req => {
      const subcategories = Array.isArray(req.subcategory) ? req.subcategory : [];
      const tools = Array.isArray(req.tools) ? req.tools : [];

      return `
    <li>
      <strong>Role:</strong> ${req.role_type} - ${req.job_title}<br/>
      <strong>Description:</strong> ${req.description}<br/>
      <strong>Budget:</strong> ${req.budget_range}<br/>
      <strong>Category:</strong> ${req.category} - ${subcategories.join(", ")}<br/>
      <strong>Tools:</strong> ${tools.join(", ")}
    </li>
  `;
    }).join("<br/>");


    const adminEmailHtml = `
      <h3>Client Details</h3>
      <p>Name: ${clientData.name}</p>
      <p>Company: ${clientData.company_name}</p>
      <p>Website: ${clientData.website}</p>
      <p>Industry: ${clientData.industry}</p>
      <p>Email: ${clientData.email}</p>
      <p>Phone: ${clientData.phone}</p>
      <h3>Hiring Requests</h3>
      <ul>${requestsHtml}</ul>
    `;

    // ✅ Send email to admin
    console.log("✉️ Sending admin email...");
    if (!process.env.SMTP_USER) {
      throw new Error("SMTP_USER environment variable is not defined");
    }
    await sendEmail(process.env.SMTP_USER, "New Client Hiring Submission", adminEmailHtml);
    console.log("✅ Admin email sent");

    // ✅ Optional: send confirmation to client
   const clientEmailHtml = `
  <p>Dear ${clientData.name},</p>
  <p>Thank you for submitting your hiring request with Finzie. We have successfully received your information and our team will review your requirements promptly.</p>
  <p>One of our representatives will reach out to you shortly to discuss the next steps and ensure a smooth onboarding process.</p>
  <p>We appreciate your trust in Finzie and look forward to assisting you in finding the best talent for your project.</p>
  <p>Best regards,<br/>
  The Finzie Team</p>
`;

    console.log("✉️ Sending confirmation email to client...");
    await sendEmail(clientData.email, "Thank you for your hiring request", clientEmailHtml);
    console.log("✅ Client email sent");

    return NextResponse.json({ success: true, hiring: hiringData });
  } catch (err: any) {
    console.error("🔥 Unexpected error in hiring request API:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 400 });
  }
}
