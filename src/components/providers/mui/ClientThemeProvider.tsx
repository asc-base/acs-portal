"use client";

import * as React from "react";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { Theme } from "@/app/theme";
// import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";

type Props = { children: React.ReactNode };

/**
 * ใช้ใน Client Components
 */
export default function ClientThemeProvider({ children }: Props) {
  return (
    // <AppRouterCacheProvider options={{ enableCssLayer: true }}>
    <ThemeProvider theme={Theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
    // </AppRouterCacheProvider>
  );
}
