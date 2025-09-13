import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Founders Gang",
  description:
    "Founders Gang is where entrepreneurs belong—a one-stop platform to connect, learn, share, and grow together in the startup journey.",
  authors: [{ name: "Founders Gang" }],
  keywords: [
    "Founders Gang",
    "Startup",
    "Founders",
    "Entrepreneurship",
    "Entrepreneur",
    "Startup Founder",
    "blog",
    "article",
  ],
  openGraph: {
    title: "Founders Gang",
    description:
      "Founders Gang is where entrepreneurs belong—a one-stop platform to connect, learn, share, and grow together in the startup journey.",
    type: "website",
    images: [
      {
        url: "https://i.ibb.co/9kbDbBWC/1.jpg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@founders_gang",
    images: ["https://i.ibb.co/9kbDbBWC/1.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Navbar /> {/* ✅ inside body, correct place */}
        <main className="pt-16">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
