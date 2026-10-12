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
  title: "Lightcash · Your finances, at the speed of light",
  description:
    "Lightcash gives you a live view of your cash, sensible projections of where you’re heading, and every report you need, without a bookkeeper in the loop.",
};

// Hides the animated elements before first paint (see html.motion in globals.css). If the motion code
// has not started within 3 seconds, it shows everything rather than leave the page blank.
const motionInit = `if(!matchMedia("(prefers-reduced-motion: reduce)").matches){var h=document.documentElement;h.classList.add("motion");setTimeout(function(){if(!h.dataset.motionReady)h.classList.remove("motion")},3000)}`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${brittiSans.variable} ${geistMono.variable} antialiased`} suppressHydrationWarning>
      <head>
        <script id="motion-init" dangerouslySetInnerHTML={{ __html: motionInit }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
