import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import AppShell from "@/components/AppShell";

export default async function SearchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // During static mobile export, we don't have session cookies, so we bypass server-side redirect
  if (process.env.IS_CAPACITOR === "true") {
    return <AppShell>{children}</AppShell>;
  }

  const user = await getSession();
  if (!user) redirect("/auth");

  return <AppShell user={user}>{children}</AppShell>;
}
