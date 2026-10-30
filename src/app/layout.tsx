import type { Metadata } from "next";
import { Inter, Roboto_Slab, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const robotoSlab = Roboto_Slab({
  subsets: ["latin"],
  variable: "--font-headline",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Arboris Industrial Plywood | From Forest to Finished Panel",
  description: "A scroll-driven journey through our precision engineered plywood manufacturing facility. Follow a single sustainable log through rotary peeling, high-heat pressing, and dimensional finishing.",
  keywords: ["plywood manufacturer", "architectural timber", "rotary peeling", "BWP marine plywood", "sustainable forestry", "engineered wood panels"],
  openGraph: {
    title: "Arboris Industrial Plywood — Manufacturing Story",
    description: "Follow the transformation of raw sustainable timber into high-grade engineered panels.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${robotoSlab.variable} ${jetbrainsMono.variable}`}>
      <body className="font-sans bg-ink text-birch antialiased selection:bg-amber-glue selection:text-ink">
        {children}
      </body>
    </html>
  );
}

