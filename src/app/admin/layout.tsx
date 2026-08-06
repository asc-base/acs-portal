"use client";

import { ReactNode } from "react";
import { EdgeSidebarAdmin } from "@/components/edgesidebaradmin";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/store/auth";
import { AdminRouteGuard } from "@/components/AdminRouteGuard";
import { baseUrl } from "@/infra/container";

const Layout = ({ children }: Readonly<{ children: ReactNode }>) => {
  const pathname = usePathname();
  const user = useAuthStore((state) => state.user);

  if (pathname === "/admin/auth") {
    return <main className="jun-content">{children}</main>;
  }

  return (
    <AdminRouteGuard apiBase={baseUrl}>
      <div className="jun-layout flex h-screen">
        <aside className="jun-sidebar w-64">
          <EdgeSidebarAdmin username={user ? `${user.firstNameTh} ${user.lastNameTh}` : "Admin"} />
        </aside>
        <main className="jun-content flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </AdminRouteGuard>
  );
};

export default Layout;
