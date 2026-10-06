import type { Metadata, Viewport } from "next";
import { IBM_Plex_Sans, Instrument_Serif, JetBrains_Mono } from "next/font/google";
import { Providers } from "@/components/layout/Providers";
import { profile } from "@/content/profile";
import { SITE_URL } from "@/lib/site";
import "./globals.css";

const plex = IBM_Plex_Sans({
  variable: "--font-plex",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

const mono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

const serif = Instrument_Serif({
  variable: "--font-instrument",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  display: "swap",
});

const title = "Soumik Sahoo — Engineering Physics | Quantum Devices & Topological Systems";
const description =
  "Soumik Sahoo is an Engineering Physics student at IIT Bombay working on experimental quantum devices, quantum transport, superconductivity, topological systems, non-Hermitian physics, and computational modeling.";

export const metadata: Metadata = {
  metadataBase: new URL(`${SITE_URL}/`),
  title,
  description,
  applicationName: "SOUMIK969",
  authors: [{ name: profile.name, url: profile.github }],
  creator: profile.name,
  keywords: [
    "Soumik Sahoo",
    "SOUMIK969",
    "IIT Bombay",
    "Engineering Physics",
    "quantum devices",
    "quantum dots",
    "spin qubits",
    "RF reflectometry",
    "quantum transport",
    "superconductivity",
    "topological insulators",
    "non-Hermitian physics",
    "condensed matter physics",
  ],
  alternates: { canonical: "./" },
  openGraph: {
    type: "profile",
    url: "./",
    siteName: "SOUMIK969",
    title,
    description,
    firstName: "Soumik",
    lastName: "Sahoo",
    images: [{ url: "og.png", width: 1200, height: 630, alt: "SOUMIK969 — Soumik Sahoo, Engineering Physics, IIT Bombay" }],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["og.png"],
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#03050a",
  colorScheme: "dark",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: profile.name,
  url: `${SITE_URL}/`,
  email: `mailto:${profile.emails.academic}`,
  jobTitle: "B.Tech student, Engineering Physics",
  affiliation: { "@type": "CollegeOrUniversity", name: profile.institute },
  alumniOf: { "@type": "CollegeOrUniversity", name: profile.institute },
  sameAs: [profile.github],
  knowsAbout: [
    "Experimental quantum devices",
    "Semiconductor quantum dots",
    "RF reflectometry",
    "Quantum transport",
    "Superconductivity",
    "Topological insulators",
    "Non-Hermitian physics",
    "Computational physics",
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${plex.variable} ${mono.variable} ${serif.variable}`}>
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <noscript>
          {/* Without JavaScript, show content that would otherwise wait for scroll-triggered reveals. */}
          <style>{`[style*="opacity:0"]{opacity:1!important;transform:none!important;filter:none!important;clip-path:none!important}`}</style>
        </noscript>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
