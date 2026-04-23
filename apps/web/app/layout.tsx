import type { Metadata } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space",
  weight: ["300", "400", "500", "600", "700"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "AimOS — Browser-Based Aim Trainer for Serious Players",
  description:
    "Train faster, aim smarter, win more. The most advanced browser-based aim training platform with real performance analytics. No download required.",
  keywords: ["aim trainer", "fps training", "reaction time", "aim lab", "browser aim trainer"],
  openGraph: {
    title: "AimOS — Browser-Based Aim Trainer",
    description: "The most advanced browser-based aim trainer built for competitive players.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${inter.variable}`}>
      <body suppressHydrationWarning style={{ fontFamily: "var(--font-space, 'Space Grotesk'), var(--font-inter, 'Inter'), system-ui, sans-serif" }}>
        {children}
      </body>
    </html>
  );
}
