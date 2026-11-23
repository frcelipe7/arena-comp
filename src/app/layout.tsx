import type { Metadata, Viewport } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import { NavigationProgress } from "@/components/layout/NavigationProgress";
import { event } from "@/data/event";
import { withBase } from "@/lib/base-path";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-poppins",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://feliperaphael.com.br";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Arena Comp 2026 | Gincana de Engenharia de Software da UEPA",
    template: "%s | Arena Comp 2026",
  },
  description: event.description,
  applicationName: "Arena Comp 2026",
  keywords: ["Arena Comp", "UEPA", "Parauapebas", "Engenharia de Software", "gincana", "maratona de programação", "robótica"],
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: "Arena Comp 2026",
    title: "Arena Comp 2026",
    description: event.description,
    images: [{ url: withBase("/og.jpg"), width: 1200, height: 630, alt: "Arena Comp 2026, 03 e 04 de dezembro, UEPA Campus Parauapebas" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Arena Comp 2026",
    description: event.description,
    images: [withBase("/og.jpg")],
  },
};

export const viewport: Viewport = {
  themeColor: "#022442",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" className={poppins.variable}>
      <body
        className="flex min-h-dvh flex-col"
        style={{ ["--paper-texture" as string]: `url("${withBase("/brand/paper.webp")}")` }}
      >
        <SmoothScroll />
        <NavigationProgress />
        <Header />
        <main id="conteudo" className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
