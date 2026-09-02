import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Playfair_Display } from "next/font/google";
import "./globals.css";
import { AppProviders } from "@/components/providers/AppProviders";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-editorial",
  display: "swap",
});

export const metadata: Metadata = {
  title: "PawAtelier | Boutique & Mobiliario de Autor para Mascotas",
  description:
    "E-commerce de diseño y bienestar para perros y gatos. Mobiliario ortopédico, arneses de piel vegetal y nutrición orgánica gourmet con garantía de 30 días.",
  keywords: [
    "mascotas",
    "boutique para perros",
    "camas ortopédicas",
    "arneses de cuero",
    "rascadores de madera",
    "gatos",
    "diseño sustentable",
  ],
  authors: [{ name: "PawAtelier" }],
  openGraph: {
    title: "PawAtelier | Mobiliario & Accesorios de Autor para Mascotas",
    description:
      "Diseños éticos y cálidos para tu compañero de cuatro patas. Envío gratis en órdenes superiores a $60.",
    siteName: "PawAtelier",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning className={`${jakarta.variable} ${playfair.variable}`}>
      <body
        suppressHydrationWarning
        className="min-h-screen bg-background font-sans text-foreground antialiased selection:bg-olive selection:text-white flex flex-col justify-between"
      >
        <AppProviders>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </AppProviders>
      </body>
    </html>
  );
}
