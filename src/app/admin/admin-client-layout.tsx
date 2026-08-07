"use client";
import { ReactNode } from "react";
import { EdgeSidebarAdmin } from "@/components/edgesidebaradmin";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/store/auth";

interface AdminClientLayoutProps {
  children: ReactNode;
  apiBase: string;
}

export default function AdminClientLayout({
  children,
  apiBase,
}: Readonly<AdminClientLayoutProps>) {
  const pathname = usePathname();
  const hideSidebar = pathname === "/admin/auth";

  const { user } = useAuthStore();

  return (
    <div className="jun-layout flex h-screen">
      {!hideSidebar && (
        <aside className="jun-sidebar w-64">
          <EdgeSidebarAdmin
            username={user ? `${user.firstNameTh} ${user.lastNameTh}` : "Admin"}
            imageUrl={user?.imageUrl}
            apiBase={apiBase}
          />
        </aside>
      )}
      <main className="jun-content flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}
