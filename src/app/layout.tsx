import type { Metadata } from "next";
import { Public_Sans, Barlow_Condensed, Red_Hat_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";

const publicSans = Public_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-public",
});

const barlow = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-barlow",
});

const redHat = Red_Hat_Mono({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--font-redhat",
});

export const metadata: Metadata = {
  title: "InsurFlow — Claims desk",
  description: "Adjudicator workstation for medical claims queues",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${publicSans.variable} ${barlow.variable} ${redHat.variable} ${publicSans.className} antialiased`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
