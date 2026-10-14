import type { Metadata, Viewport } from "next";
import { Roboto } from "next/font/google";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { themeScript } from "@/components/ThemeToggle";
import { profile } from "@/content/profile";
import { SITE_URL } from "@/lib/site";
import "./globals.css";

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  display: "swap",
});

const description =
  "Soumik Sahoo is an Engineering Physics student at IIT Bombay working on experimental quantum devices, quantum transport, superconductivity, topological and non-Hermitian systems, and computational physics.";

export const metadata: Metadata = {
  metadataBase: new URL(`${SITE_URL}/`),
  title: {
    default: "Soumik Sahoo — Engineering Physics, IIT Bombay",
    template: "%s | Soumik Sahoo",
  },
  description,
  applicationName: "Soumik Sahoo",
  authors: [{ name: profile.name, url: profile.github }],
  creator: profile.name,
  keywords: [
    "Soumik Sahoo",
    "IIT Bombay",
    "Engineering Physics",
    "quantum devices",
    "quantum dots",
    "quantum transport",
    "superconductivity",
    "topological insulators",
    "non-Hermitian physics",
    "condensed matter physics",
  ],
  openGraph: {
    type: "website",
    siteName: "Soumik Sahoo",
    title: "Soumik Sahoo — Engineering Physics, IIT Bombay",
    description,
    images: [{ url: "og.png", width: 1200, height: 630, alt: "Soumik Sahoo — Engineering Physics, IIT Bombay" }],
  },
  twitter: { card: "summary_large_image", images: ["og.png"] },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#1c1c1d" },
  ],
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: profile.name,
  url: `${SITE_URL}/`,
  email: `mailto:${profile.emails.academic}`,
  affiliation: { "@type": "CollegeOrUniversity", name: profile.institute },
  sameAs: [profile.github],
  knowsAbout: ["Quantum devices", "Quantum transport", "Superconductivity", "Topological insulators", "Non-Hermitian physics", "Computational physics"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={roboto.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="flex min-h-screen flex-col">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <Navbar />
        <main id="content" className="mx-auto w-full max-w-[1000px] flex-1 px-4 pt-10 pb-8">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
