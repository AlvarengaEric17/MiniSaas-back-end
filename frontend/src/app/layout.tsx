import type { Metadata } from "next";
import { CartProvider } from "@/contexts/CartContext";
import "./globals.scss";

export const metadata: Metadata = {
  title: "MiniSaaS - Catálogo Web",
  description: "Plataforma SaaS multiempresa de catálogo web",
};

function RootLayoutContent({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <body>
      <CartProvider>
        {children}
      </CartProvider>
    </body>
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-br">
      <RootLayoutContent>{children}</RootLayoutContent>
    </html>
  );
}
