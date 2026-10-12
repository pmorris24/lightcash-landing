import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

const brittiSans = localFont({
  variable: "--font-britti-sans",
  src: [
    { path: "./fonts/britti-sans-medium.otf", weight: "500", style: "normal" },
    { path: "./fonts/britti-sans-semibold.otf", weight: "600", style: "normal" },
  ],
  adjustFontFallback: "Arial",
});

// Only used to draw the decorative ASCII texture on the gradient panels.
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Lightcash",
  description:
    "Live cash, projections and reports for small business owners and solo builders. No bookkeeper wait, no spreadsheets.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${brittiSans.variable} ${geistMono.variable} antialiased`}>
      <body>{children}</body>
    </html>
  );
}
