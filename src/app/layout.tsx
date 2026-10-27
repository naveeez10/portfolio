import type { Metadata } from "next";
import { Geist, Geist_Mono, Pixelify_Sans } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import "./globals.css";
import { TopNav } from "@/components/site/TopNav";
import { CommandMenu } from "@/components/shell/CommandMenu";
import { Toaster } from "@/components/shell/Toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const pixel = Pixelify_Sans({
  variable: "--font-pixel",
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://naviz.me";
const title = "Naviz Khoja — Software Engineer";
const description =
  "Naviz Khoja is a software engineer at Adora working across mobile, backend and AI, and building Oen in his free time. Codeforces Specialist and hackathon winner.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: title,
    template: "%s · Naviz Khoja",
  },
  description,
  keywords: [
    "Naviz Khoja",
    "Software Engineer",
    "Tech Lead",
    "Adora",
    "Flutter",
    "Next.js",
    "GenAI",
    "Mobile Engineer",
    "Backend Engineer",
    "Machine Learning",
  ],
  authors: [{ name: "Naviz Khoja" }],
  creator: "Naviz Khoja",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    title,
    description,
    siteName: "Naviz Khoja",
  },
  twitter: {
    card: "summary_large_image",
    creator: "@iam_viz",
    title,
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
  alumniOf: { "@type": "CollegeOrUniversity", name: "L.D. College of Engineering" },
  sameAs: [
    "https://www.linkedin.com/in/naviz-khoja/",
    "https://github.com/naveeez10",
    "https://twitter.com/iam_viz",
    "https://codeforces.com/profile/theviz",
    "https://leetcode.com/nvz10/",
  ],
};

const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} ${pixel.variable} font-sans antialiased`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        {children}
        <TopNav />
        <CommandMenu />
        <Toaster />
        {gaId ? <GoogleAnalytics gaId={gaId} /> : null}
      </body>
    </html>
  );
}
