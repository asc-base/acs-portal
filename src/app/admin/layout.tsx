"use client";
import { ReactNode } from "react";
import { EdgeSidebarAdmin } from "@/components/edgesidebaradmin";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/store/auth";

const Layout = ({ children }: Readonly<{ children: ReactNode }>) => {
  const pathname = usePathname();
  const hideSidebar = pathname === "/admin/auth";

  const user = useAuthStore((state) => state.user);
  console.log("ข้อมูล User ใน Store คือ:", user);
  
  return (
    <div className="jun-layout flex h-screen">
      {!hideSidebar && (
        <aside className="jun-sidebar w-64">
          <EdgeSidebarAdmin username={user ? `${user.firstNameTh} ${user.lastNameTh}` : "Admin"} />
        </aside>
      )}
        <main className="jun-content flex-1 overflow-y-auto">
          {children}
        </main>
    </div>
  );
};

export default Layout;
