import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Providers } from "@/components/providers";
import { SkiperProgress } from "@/components/skiper-progress";
import "./globals.css";

const display = Cormorant_Garamond({ subsets: ["latin"], variable: "--font-display", display: "swap" });
const sans = Manrope({ subsets: ["latin"], variable: "--font-sans", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL("https://composer-ulik.vercel.app"),
  title: { default: "Ulvin Najafov | Composer & Pianist", template: "%s | Ulvin Najafov" },
  description: "Scores, recordings and contemporary classical works by composer and pianist Ulvin Najafov.",
  applicationName: "Ulvin Najafov Composer Portfolio",
  authors: [{ name: "Ulvin Najafov" }],
  creator: "Ulvin Najafov",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Ulvin Najafov",
    title: "Ulvin Najafov | Composer & Pianist",
    description: "Engineering emotion into contemporary classical music.",
  },
  twitter: { card: "summary_large_image", title: "Ulvin Najafov | Composer & Pianist" },
};

export const viewport: Viewport = { colorScheme: "dark light", themeColor: "#0b0d10" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${display.variable} ${sans.variable}`}>
      <body>
        <a className="skip-link" href="#main-content">Skip to main content</a>
        <Providers>
          <SkiperProgress />
          <div className="site-shell">
            <SiteHeader />
            <main id="main-content" className="site-main">{children}</main>
            <SiteFooter />
          </div>
        </Providers>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
