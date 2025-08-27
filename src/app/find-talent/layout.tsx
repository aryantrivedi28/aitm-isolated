export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;

import type { ReactNode } from "react";

export default function FindTalentLayout({ children }: { children: ReactNode; }) {
  return <>{children}</>;
}
