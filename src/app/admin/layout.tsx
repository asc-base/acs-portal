"use client";
import { ReactNode } from "react";
import { EdgeSidebarAdmin } from "@/components/edgesidebaradmin";
import { usePathname } from "next/navigation";

const Layout = ({ children }: Readonly<{ children: ReactNode }>) => {
  const pathname = usePathname();
  const hideSidebar = pathname === "/admin/login";
  
  return (
    <div className="jun-layout flex h-screen">
      {!hideSidebar && (
        <aside className="jun-sidebar w-64">
          <EdgeSidebarAdmin username="Admin01" />
        </aside>
      )}
        <main className="jun-content flex-1 overflow-y-auto">
          {children}
        </main>
    </div>
  );
};

export default Layout;
