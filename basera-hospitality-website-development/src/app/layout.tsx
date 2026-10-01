import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { DM_Sans, Fraunces } from "next/font/google";
import "./globals.css";
import { business, fullAddress, mapsOpenUrl } from "@/data/business";
import { pexelsUrl } from "@/components/Photo";
import { images } from "@/data/business";
import MotionProvider from "@/components/MotionProvider";
import { CartProvider } from "@/components/CartProvider";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import StickyMobileCta from "@/components/StickyMobileCta";
import WelcomeBubble from "@/components/WelcomeBubble";

const fraunces = Fraunces({ subsets: ["latin"], variable: "--font-fraunces", display: "swap" });
const dmSans = DM_Sans({ subsets: ["latin"], variable: "--font-dm-sans", display: "swap" });

const title = "Basera Restaurant & Hotel | Restaurant, Stay & Events in Mathura";
const description =
  "Discover vegetarian dining, comfortable stays and event facilities at Basera Restaurant & Hotel in Mathura.";
const ogImage = images.hero.src ?? pexelsUrl(images.hero.pexelsId ?? 0, 1200);

export const metadata: Metadata = {
  metadataBase: new URL(business.siteUrl),
  title: { default: title, template: "%s | Basera Restaurant & Hotel, Mathura" },
  description,
  keywords: ["Basera", "vegetarian restaurant Mathura", "hotel Mathura", "banquet Mathura", "Delhi Agra bypass", "Chourah"],
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: business.name,
    title,
    description,
    url: "/",
    images: [{ url: ogImage, width: 1200, height: 800, alt: "Dining at Basera Restaurant & Hotel, Mathura" }],
  },
  twitter: { card: "summary_large_image", title, description, images: [ogImage] },
  alternates: { canonical: "/" },
};

export const viewport: Viewport = {
  themeColor: "#2a1c13",
  width: "device-width",
  initialScale: 1,
};

// Structured data. Only facts supplied by the business: no ratings, reviews or awards.
const jsonLd = {
  "@context": "https://schema.org",
  "@type": ["Restaurant", "LodgingBusiness"],
  name: business.name,
  url: business.siteUrl,
  telephone: business.phoneTel,
  servesCuisine: ["Indian", "Vegetarian"],
  image: ogImage,
  hasMap: mapsOpenUrl,
  sameAs: [business.instagramUrl],
  address: {
    "@type": "PostalAddress",
    streetAddress: `${business.address.line1}, ${business.address.line2}`,
    addressLocality: business.address.city,
    addressRegion: business.address.state,
    postalCode: business.address.postalCode,
    addressCountry: business.address.country,
  },
  description: `${business.name}, ${fullAddress}.`,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en-IN" className={`${fraunces.variable} ${dmSans.variable}`}>
      <body className="antialiased">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <MotionProvider>
          <CartProvider>
            <a
              href="#main"
              className="sr-only z-[60] rounded-full bg-gold px-4 py-2 font-semibold text-espresso focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
            >
              Skip to content
            </a>
            <Header />
            <main id="main">{children}</main>
            <Footer />
            <StickyMobileCta />
            <WelcomeBubble />
          </CartProvider>
        </MotionProvider>
      </body>
    </html>
  );
}
