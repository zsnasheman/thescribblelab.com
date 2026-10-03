import type { Metadata, Viewport } from "next";
import { Figtree, Josefin_Sans } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { INDEXING_ENABLED, SITE } from "@/lib/site";

const josefin = Josefin_Sans({
  variable: "--font-josefin",
  subsets: ["latin"],
  weight: ["300", "400", "600", "700"],
  display: "swap",
});
const figtree = Figtree({
  variable: "--font-figtree",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} — Interiors, exhibitions, events and kinetic windows in Dubai`,
    template: `%s — ${SITE.name}`,
  },
  description: SITE.description,
  openGraph: {
    type: "website",
    siteName: SITE.name,
    title: SITE.name,
    description: SITE.description,
    locale: "en_AE",
  },
  twitter: { card: "summary_large_image" },
  robots: INDEXING_ENABLED
    ? { index: true, follow: true }
    : { index: false, follow: false, nocache: true },
};

export const viewport: Viewport = {
  themeColor: "#2F2058",
  width: "device-width",
  initialScale: 1,
};

// Marks JS availability so scroll reveals can hide content only when they can also show it.
const initScript = `document.documentElement.classList.add("js");if(matchMedia("(prefers-reduced-motion: reduce)").matches)document.documentElement.classList.add("reduce-journey");setTimeout(function(){document.documentElement.classList.add('reveal-fallback')},4000);`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" suppressHydrationWarning className={`${josefin.variable} ${figtree.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: initScript }} />
      </head>
      <body className="flex min-h-dvh flex-col">
        <a
          href="#main"
          className="sr-only-focusable btn btn-coral fixed left-4 top-4 z-[100]"
        >
          Skip to content
        </a>
        <Header />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
