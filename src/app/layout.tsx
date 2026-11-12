import type { Metadata, Viewport } from "next";
import "./globals.css";
import { MobileNav } from "@/components/layout/MobileNav";

export const metadata: Metadata = {
  title: "Formosa Pádel Hub | Gestión de Partidos y Ranking",
  description:
    "Plataforma Mobile-First para carga de partidos 2vs2, ranking y gestión de jugadores de pádel.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#090D16",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="dark">
      <body className="min-h-screen bg-[#090D16] text-slate-100 pb-24">
        <div className="mx-auto max-w-md md:max-w-2xl px-4 pt-5">
          {children}
        </div>
        <MobileNav />
      </body>
    </html>
  );
}
