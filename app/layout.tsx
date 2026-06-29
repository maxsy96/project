import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Footer, Navbar } from "@/components/site-shell";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://cavm-opportunity-hub-uaeu-2026.netlify.app"),
  title: {
    default: "CAVM Club Website + Opportunity Hub",
    template: "%s | CAVM Club",
  },
  description:
    "The official digital home for CAVM Club activities, achievements, members, alumni, events, media, and student opportunities.",
  icons: {
    icon: [
      { url: "/icon.png", type: "image/png" },
      { url: "/images/brand/cavm-logo.png", type: "image/png" },
    ],
    apple: "/apple-icon.png",
  },
  openGraph: {
    title: "CAVM Club Website + Opportunity Hub",
    description:
      "A professional CAVM Club public presence and centralized Opportunity Hub for students and partners.",
    url: "https://cavm-opportunity-hub-uaeu-2026.netlify.app",
    siteName: "CAVM Club Opportunity Hub",
    images: [
      {
        url: "/images/brand/cavm-link-preview.png",
        width: 1200,
        height: 630,
        alt: "CAVM Club logo",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CAVM Club Website + Opportunity Hub",
    description:
      "The official digital home for CAVM Club activities, achievements, media, events, and student opportunities.",
    images: ["/images/brand/cavm-link-preview.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-[#f8faf7] text-slate-950">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
