import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/SiteHeader";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://naviz.me";
const description =
  "Naviz Khoja — Software Engineer shipping mobile, backend, and GenAI products.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Naviz Khoja — Software Engineer",
    template: "%s · Naviz Khoja",
  },
  description,
  keywords: [
    "Naviz Khoja",
    "Software Engineer",
    "Flutter",
    "Next.js",
    "GenAI",
    "Mobile Engineer",
    "Backend Engineer",
  ],
  authors: [{ name: "Naviz Khoja" }],
  creator: "Naviz Khoja",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    title: "Naviz Khoja — Software Engineer",
    description,
    siteName: "Naviz Khoja",
  },
  twitter: {
    card: "summary_large_image",
    creator: "@iam_viz",
    title: "Naviz Khoja — Software Engineer",
    description,
  },
  robots: { index: true, follow: true },
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Naviz Khoja",
  url: siteUrl,
  email: "mailto:naveezkhoja1063@gmail.com",
  jobTitle: "Software Engineer",
  worksFor: { "@type": "Organization", name: "Adora Inc." },
  sameAs: [
    "https://www.linkedin.com/in/naviz-khoja/",
    "https://github.com/naveeez10",
    "https://twitter.com/iam_viz",
    "https://codeforces.com/profile/theviz",
    "https://leetcode.com/nvz10/",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        <div className="min-h-dvh bg-[var(--nb-bg)] text-[var(--nb-text)]">
          <SiteHeader />
          {children}
        </div>
      </body>
    </html>
  );
}
