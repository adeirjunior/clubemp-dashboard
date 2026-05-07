import type { Metadata } from "next";
import { DashboardLayoutFrame } from "@/components/dashboard-layout-frame";
import { readBackendSession } from "@/lib/backend";
import "./globals.css";

export const metadata: Metadata = {
  title: "Clubemp Dashboard",
  description:
    "Dashboard Clubemp em Next.js integrado exclusivamente com a API backend.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await readBackendSession();

  return (
    <html lang="pt-BR" data-theme="clubemp-luxe">
      <body>
        <DashboardLayoutFrame session={session}>
          {children}
        </DashboardLayoutFrame>
      </body>
    </html>
  );
}
