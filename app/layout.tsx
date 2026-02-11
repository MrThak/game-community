import type { Metadata } from "next";
import Script from 'next/script'
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import GlobalHeader from "@/components/layout/GlobalHeader";
import Footer from "@/components/layout/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://thaktalker.vercel.app'

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "Thak Talker - ศูนย์รวมคนรักเกม",
    template: "%s | Thak Talker"
  },
  description: "ชุมชนคนเล่นเกม แลกเปลี่ยนความคิดเห็น รีวิวเกม และพูดคุยเรื่องเกมที่คุณชื่นชอบ",
  keywords: ["เกม", "ชุมชนเกม", "รีวิวเกม", "Game Community", "Board Game", "Mobile Game"],
  openGraph: {
    type: 'website',
    locale: 'th_TH',
    url: baseUrl,
    title: "Thak Talker - ศูนย์รวมคนรักเกม",
    description: "ชุมชนคนเล่นเกม แลกเปลี่ยนความคิดเห็น และพูดคุยเรื่องเกมที่คุณชื่นชอบ",
    siteName: "Thak Talker",
    images: [
      {
        url: '/og-image.jpg', // You should add an og-image.jpg to public folder later
        width: 1200,
        height: 630,
        alt: 'Game Community Preview',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Thak Talker - ศูนย์รวมคนรักเกม",
    description: "ชุมชนคนเล่นเกม แลกเปลี่ยนความคิดเห็น และพูดคุยเรื่องเกมที่คุณชื่นชอบ",
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <GlobalHeader />
        <main className="flex-1 flex flex-col">
          {children}
        </main>
        <Footer />

        {/* Google AdSense Global Script */}
        {/* Google AdSense Global Script */}
        {process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID && (
          <Script
            id="adsbygoogle-init"
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID}`}
            crossOrigin="anonymous"
            strategy="afterInteractive"
          />
        )}
      </body>
    </html>
  );
}
