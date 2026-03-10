import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import Preloader from "@/components/PreLoader";
import SmoothScroll from "@/components/SmoothScroll";
import LayoutContent from "@/components/LayoutContent"; 

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Incarnet Life",
  description: "Experience spiritual motion and professional management.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Preloader />
        <SmoothScroll>
          {/* Navbar සහ Footer පාලනය කරන logic එක මෙතන තියෙන්නේ */}
          <LayoutContent>{children}</LayoutContent>
        </SmoothScroll>
      </body>
    </html>
  );
}