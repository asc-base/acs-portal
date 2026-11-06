import type { Metadata } from "next";
// Removed Google Fonts to avoid network timeouts during build
import "./globals.css";
import UniversalThemeProvider from "@/shared/theme/providers/mui/UniversalThemeProvider";
import appIcon from "./logoacs-nonbg.png";
import InitialLoader from "@/features/auth/components/InitialLoader";
import QueryProvider from "@/shared/theme/providers/query-provider";

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
        <QueryProvider>
          <UniversalThemeProvider>
            <InitialLoader>{children}</InitialLoader>
          </UniversalThemeProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
