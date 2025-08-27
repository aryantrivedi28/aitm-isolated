export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";

export default async function OptionLayout({ children }: { children: ReactNode; }) {
  const cookieStore = await cookies();
  const authCookie = cookieStore.get("client_auth")?.value;

  if (!authCookie) {
    redirect("/find-talent");
  }

  return <>{children}</>;
}


