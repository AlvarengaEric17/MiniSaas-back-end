import type { Metadata } from "next";
import "./globals.scss";

export const metadata: Metadata = {
  title: "MiniSaaS - Catálogo Web",
  description: "Plataforma SaaS multiempresa de catálogo web",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-br">
      <body>{children}</body>
    </html>
  );
}
