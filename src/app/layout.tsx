import type { Metadata, Viewport } from "next";
import { Fraunces, Inter } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";
import "leaflet/dist/leaflet.css";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
  axes: ["opsz", "SOFT"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Summer 2026 — Mom & Dad's Road Trip",
  description: "Glacier · Yellowstone · Grand Tetons. Plan stops, pin ideas to days, and map the route. Aug 7 – Sep 24, 2026.",
};

export const viewport: Viewport = {
  themeColor: "#faf5ec",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${fraunces.variable} ${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-sand text-ink">
        {children}
        <Toaster
          position="top-center"
          richColors
          toastOptions={{ classNames: { toast: "!bg-paper !border-edge !text-ink !font-sans" } }}
        />
      </body>
    </html>
  );
}
