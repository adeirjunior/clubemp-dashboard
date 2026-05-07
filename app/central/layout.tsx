import { redirect } from "next/navigation";
import { readBackendSession } from "@/lib/backend";

export const dynamic = "force-dynamic";

export default async function CentralLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await readBackendSession();
  const role = session.auth_user?.role;

  if (role !== "admin" && role !== "employee") {
    redirect("/login");
  }

  return children;
}
