import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Sidebar } from "@/components/layout/Sidebar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://gamecodeswiki.com';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Gamecodeswiki - Roblox Game Codes & Rewards",
    template: "%s | Gamecodeswiki",
  },
  description: "Daily updated Roblox game codes. Find the latest rewards, boosts, and items for your favorite Roblox games.",
  openGraph: {
    type: 'website',
    siteName: 'Gamecodeswiki',
    title: 'Gamecodeswiki - Roblox Game Codes & Rewards',
    description: 'Daily updated Roblox game codes. Find the latest rewards, boosts, and items.',
    url: SITE_URL,
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Gamecodeswiki - Roblox Game Codes & Rewards',
    description: 'Daily updated Roblox game codes. Find the latest rewards, boosts, and items.',
    images: ['/og-image.png'],
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/icon-192.png',
  },
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
        <Navbar />
        <main className="flex-1 container mx-auto px-4 py-8 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-3">
              {children}
            </div>
            <div className="hidden lg:block">
              <Sidebar />
            </div>
          </div>
        </main>
        <Footer />
      </body>
    </html>
  );
}
