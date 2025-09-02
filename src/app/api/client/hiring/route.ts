"use server";

import { NextResponse } from "next/server";
import { supabaseAdmin } from "../../../../lib/supabase-admin";
import { cookies } from "next/headers";
import { sendEmail } from "../../../../lib/mailer";

export async function POST(req: Request) {
  try {

    const body = await req.json();

    const { role_type, job_title, description, budget_range, category, subcategory, tools } = body;

    // ✅ Basic validation
    if (!role_type || !job_title || !description || !budget_range || !category?.length) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // ✅ Read cookie for client session
    const cookieStore = await cookies();
    const session = cookieStore.get("client_auth")?.value;

    if (!session) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    let email: string | undefined;
    try {
      const parsed = JSON.parse(session);
      email = parsed?.email;
    } catch {
      return NextResponse.json({ success: false, error: "Invalid session cookie" }, { status: 400 });
    }

    if (!email) {
      return NextResponse.json({ success: false, error: "Invalid session" }, { status: 400 });
    }

    // ✅ Get client info from database
    const { data: clientData, error: clientError } = await supabaseAdmin
      .from("client_table")
      .select("*")
      .eq("email", email)
      .single();

    if (clientError || !clientData) {
      return NextResponse.json({ success: false, error: "Client not found" }, { status: 404 });
    }

    const client_id = clientData.id;

    // ✅ Insert new hiring request
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
      console.error("❌ DB insert error:", hiringError);
      return NextResponse.json({ success: false, error: "Failed to save hiring request" }, { status: 500 });
    }

    // ✅ Fetch all hiring requests for this client
    const { data: allRequests } = await supabaseAdmin
      .from("hiring_requests")
      .select("*")
      .eq("client_id", client_id);

    // ✅ Prepare HTML for admin email
    const requestsHtml = allRequests
      ?.map((req) => {
        const categories = Array.isArray(req.category) ? req.category : [];
        const subcategories = Array.isArray(req.subcategory) ? req.subcategory : [];
        const tools = Array.isArray(req.tools) ? req.tools : [];

        return `
      <tr style="border-bottom:1px solid #e5e7eb;">
        <td style="padding:16px;">
          <p style="margin:0; font-size:15px;">
            <strong style="color:#111827;">Role:</strong> ${req.role_type} - ${req.job_title}
          </p>
          <p style="margin:6px 0; font-size:15px;">
            <strong style="color:#111827;">Description:</strong> ${req.description}
          </p>
          <p style="margin:6px 0; font-size:15px;">
            <strong style="color:#111827;">Budget:</strong> ${req.budget_range}
          </p>
          <p style="margin:6px 0; font-size:15px;">
            <strong style="color:#111827;">Category:</strong> ${categories.join(", ") || "N/A"}
          </p>
          <p style="margin:6px 0; font-size:15px;">
            <strong style="color:#111827;">Subcategories:</strong> ${subcategories.join(", ") || "N/A"}
          </p>
          <p style="margin:6px 0; font-size:15px;">
            <strong style="color:#111827;">Tools:</strong> ${tools.join(", ") || "N/A"}
          </p>
        </td>
      </tr>
    `;
      })
      .join("");

    const adminEmailHtml = `
  <div style="font-family:Arial, sans-serif; color:#111827; max-width:800px; margin:auto; border:1px solid #e5e7eb; border-radius:8px; overflow:hidden;">
    <div style="background-color:#241C15; padding:20px;">
      <h2 style="margin:0; color:white; font-size:22px;"> New Hiring Submission</h2>
    </div>
    <div style="padding:20px;">
      <h3 style="margin-top:0; color:#241C15; font-size:18px;">Client Details</h3>
      <table style="width:100%; border-collapse:collapse; margin-bottom:24px;">
        <tr><td style="padding:6px;"><strong>Name:</strong></td><td>${clientData.name}</td></tr>
        <tr><td style="padding:6px;"><strong>Company:</strong></td><td>${clientData.company_name || "N/A"}</td></tr>
        <tr><td style="padding:6px;"><strong>Website:</strong></td><td>${clientData.website || "N/A"}</td></tr>
        <tr><td style="padding:6px;"><strong>Industry:</strong></td><td>${clientData.industry || "N/A"}</td></tr>
        <tr><td style="padding:6px;"><strong>Email:</strong></td><td>${clientData.email}</td></tr>
        <tr><td style="padding:6px;"><strong>Phone:</strong></td><td>${clientData.phone || "N/A"}</td></tr>
      </table>

      <h3 style="color:#241C15; font-size:18px;">Hiring Requests</h3>
      <table style="width:100%; border-collapse:collapse; border:1px solid #e5e7eb;">
        ${requestsHtml}
      </table>
    </div>
    <div style="background-color:#f9fafb; padding:14px; text-align:center; font-size:13px; color:#6b7280;">
      Finzie Hiring Platform • Confidential Report
    </div>
  </div>
`;


    // ✅ Send emails safely
    try {
      if (!process.env.SMTP_USER) {
        throw new Error("SMTP_USER not configured");
      }
      await sendEmail(process.env.SMTP_USER, "New Client Hiring Submission", adminEmailHtml);
      console.log("✅ Admin email sent");
    } catch (err) {
      console.error("❌ Failed to send admin email:", err);
    }

    try {
      const clientEmailHtml = `
        <p>Dear ${clientData.name},</p>
        <p>Thank you for submitting your hiring request with Finzie. We have successfully received your information and our team will review your requirements promptly.</p>
        <p>One of our representatives will reach out to you shortly to discuss the next steps and ensure a smooth onboarding process.</p>
        <p>We appreciate your trust in Finzie and look forward to assisting you in finding the best talent for your project.</p>
        <p>Best regards,<br/>The Finzie Team</p>
      `;
      await sendEmail(clientData.email, "Thank you for your hiring request", clientEmailHtml);
      console.log("✅ Client email sent");
    } catch (err) {
      console.error("❌ Failed to send client confirmation email:", err);
    }

    return NextResponse.json({ success: true, hiring: hiringData });
  } catch (err: any) {
    console.error("🔥 Unexpected error in hiring request API:", err);
    return NextResponse.json(
      { success: false, error: "Something went wrong, please try again later." },
      { status: 500 }
    );
  }
}
