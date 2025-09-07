"use client";
import React from "react";
import { ReactNode } from "react";
import { ThemeProvider } from "@mui/material/styles";
import { Theme } from "@/app/theme";

const Layout = ({ children }: Readonly<{ children: ReactNode }>) => {
  return (
    <ThemeProvider theme={Theme}>
      <main>{children}</main>
    </ThemeProvider>
  );
};

export default Layout;
