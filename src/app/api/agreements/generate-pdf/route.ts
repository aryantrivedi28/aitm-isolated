import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "../../../../lib/agreements/supabase-server"
import { PDFGenerator } from "../../../../lib/agreements/pdf-generator"
import { put } from "@vercel/blob"

export async function POST(request: NextRequest) {
  try {
    console.log("📌 Incoming request to generate PDF");

    const supabase = await createClient();
    console.log("✅ Supabase client created");

    const body = await request.json();
    console.log("📌 Request body:", body);

    const { agreementId, type } = body;
    if (!agreementId || !type) {
      console.error("❌ Missing agreementId or type");
      return NextResponse.json({ error: "Agreement ID and type are required" }, { status: 400 });
    }

    const tableName = type === "client" ? "client_agreements" : "freelancer_agreements";
    console.log("📌 Fetching from table:", tableName);

    const { data: agreement, error: agreementError } = await supabase
      .from(tableName)
      .select("*")
      .eq("id", agreementId)
      .single();

    if (agreementError || !agreement) {
      console.error("❌ Agreement fetch error:", agreementError);
      return NextResponse.json({ error: "Agreement not found" }, { status: 404 });
    }
    console.log("✅ Agreement found:", agreement);

    let pdfBuffer: Buffer;
    console.log("📌 Generating PDF for type:", type);

    if (type === "client") {
      pdfBuffer = await PDFGenerator.generateClientAgreementPDF(agreement);
    } else {
      pdfBuffer = await PDFGenerator.generateFreelancerAgreementPDF(agreement);
    }

    console.log("✅ PDF generated, uploading to blob...");

    const filename = `${type}-agreement-${agreementId}-${Date.now()}.pdf`;
    const blob = await put(filename, pdfBuffer, {
      access: "public",
      contentType: "application/pdf",
    });

    console.log("✅ PDF uploaded:", blob.url);

    const { error: updateError } = await supabase
      .from(tableName)
      .update({
        pdf_url: blob.url,
        updated_at: new Date().toISOString(),
      })
      .eq("id", agreementId);

    if (updateError) {
      console.error("❌ Error updating DB with PDF URL:", updateError);
    } else {
      console.log("✅ Supabase updated with PDF URL");
    }

    return NextResponse.json({
      pdfUrl: blob.url,
      message: "PDF generated successfully",
    });
  } catch (error) {
    console.error("🔥 Fatal error generating PDF:", error);
    return NextResponse.json({ error: "Failed to generate PDF" }, { status: 500 });
  }
}
