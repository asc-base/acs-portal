"use client";
import { ReactNode } from "react";
import { NavbarMain } from "@/components/navbar";
import { Footer } from "@/components/footer";

const layout = ({ children }: Readonly<{ children: ReactNode }>) => {
  return (
    <div className="jun-layout w-full">
      <header className="jun-header jun-layout-h-[7.375rem] h-full">
        <NavbarMain />
      </header>
      <main className="jun-content">{children}</main>
      <footer className="jun-footer">
        <Footer />
      </footer>
    </div>
  );
};

export default layout;
