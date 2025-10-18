import type { Metadata } from "next";
// Removed Google Fonts to avoid network timeouts during build
import "./globals.css";
import UniversalThemeProvider from "@/components/providers/mui/UniversalThemeProvider";
import appIcon from "./logoacs-nonbg.png";

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
      <body className="antialiased">
        <UniversalThemeProvider>{children}</UniversalThemeProvider>
      </body>
    </html>
  );
}
