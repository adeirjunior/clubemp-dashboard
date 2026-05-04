import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Clubemp Dashboard",
  description:
    "Dashboard Clubemp em Next.js integrado exclusivamente com a API backend.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" data-theme="clubemp-luxe">
      <body>{children}</body>
    </html>
  );
}
