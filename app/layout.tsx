import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import StarsBackground from "@/components/StarsBackground";
import ShootingStars from "@/components/ShootingStars";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "जैन धर्म ब्लॉग - जैन धर्म की शिक्षाएं और आध्यात्मिक ज्ञान",
  description: "जैन धर्म की पवित्र शिक्षाओं, भजनों, स्तुतियों और आध्यात्मिक ज्ञान का अन्वेषण करें। अहिंसा, सत्य और आत्म-शुद्धि के मार्ग पर चलें।",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="hi" className="scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black text-white`}
      >
        <StarsBackground />
        <ShootingStars />
        <div className="flex min-h-screen flex-col relative z-[10]">
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
