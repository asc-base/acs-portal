"use client";

import * as React from "react";
import { ThemeProvider } from "@mui/material";
import { Theme } from "@/app/theme";

type Props = { children: React.ReactNode };

/**
 * ใช้ใน Client Components
 */
export default function ClientThemeProvider({ children }: Props) {
  return (
    <ThemeProvider theme={Theme}>
      {children}
    </ThemeProvider>
  );
}
