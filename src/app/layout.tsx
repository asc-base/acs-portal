import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import UniversalThemeProvider from "@/components/providers/mui/UniversalThemeProvider";
import appIcon from "./logoacs-nonbg.png";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ACS KMUTT",
  description:
    "Applied Computer Science, King Mongkut's University of Technology Thonburi",
  icons: {
    icon: appIcon.src,
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
        <UniversalThemeProvider>{children}</UniversalThemeProvider>
      </body>
    </html>
  );
}
