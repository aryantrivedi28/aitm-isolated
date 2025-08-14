import { createClient } from "@supabase/supabase-js"
const supabaseUrl = 'https://vdxmxeprvqiwbuimjmzh.supabase.co'  //process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZkeG14ZXBydnFpd2J1aW1qbXpoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NTY5NDQzNywiZXhwIjoyMDYxMjcwNDM3fQ.EueWLYeKF9SCcaR2EUnZHhkTozeaS_0zDXKDp27W7po'      //process.env.SUPABASE_SERVICE_ROLE_KEY!
// Server-only admin client with service role key (bypasses RLS)
export const supabaseAdmin = createClient(
supabaseUrl,
supabaseServiceKey,
  {
    auth: {
      persistSession: false,
    },
  },
)
