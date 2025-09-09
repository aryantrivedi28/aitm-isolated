// src/lib/agreements/storage.ts
import { supabaseAdmin } from "../supabase-admin"; // adjust path

export async function uploadPdfToSupabase(
  buffer: Buffer,
  filename: string,
  bucket: "client_agreements" | "freelancer_agreements" | "invoices"
) {
  // Upload to the selected bucket
  const { error } = await supabaseAdmin.storage
    .from(bucket)
    .upload(filename, buffer, {
      contentType: "application/pdf",
      upsert: true,
    });

  if (error) throw error;

  // Get public URL for the uploaded file
  const { data: publicUrl } = supabaseAdmin.storage.from(bucket).getPublicUrl(filename);

  return publicUrl.publicUrl;
}



// export async function uploadPdfToSupabase(buffer: Buffer, filename: string) {
//   // store in bucket 'agreements' (create first in Supabase)
//   const { data, error } = await supabaseAdmin.storage
//     .from('agreements')
//     .upload(filename, buffer, { contentType: 'application/pdf', upsert: true });

//   if (error) throw error;
//   const publicUrl = supabaseAdmin.storage.from('agreements').getPublicUrl(data.path).publicURL;
//   return publicUrl;
// }
