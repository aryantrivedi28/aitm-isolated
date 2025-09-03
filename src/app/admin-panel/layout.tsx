// app/admin-panel/layout.tsx
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { verifyToken } from ".././../lib/auth"; // ✅ import your JWT verify helper

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const cookieStore = await cookies();
  const authCookie = cookieStore.get("token")?.value; // ✅ match cookie name

  // ⛔️ If no cookie, redirect
  if (!authCookie) {
    redirect("/login");
  }

  // ✅ Verify the token server-side
  const decoded = verifyToken(authCookie);
  if (!decoded) {
    redirect("/login");
  }

  return <>{children}</>;
}
