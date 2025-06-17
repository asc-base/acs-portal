"use client";
import { ReactNode } from "react";
import { EdgeSidebarAdmin } from "@/components/edgesidebaradmin";

const layout = ({ children }: Readonly<{ children: ReactNode }>) => {
  return (
    <div className="jun-layout flex h-screen">
      <aside className="jun-sidebar w-64">
        <EdgeSidebarAdmin />
      </aside>
        <main className="jun-content flex-1 overflow-y-auto">
          {children}
        </main>
    </div>
  );
};

export default layout;
