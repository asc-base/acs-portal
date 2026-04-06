import React from "react";
import AdminLoginLandingPage from "./admin.login.landingpage";
import { baseUrl } from "@/infra/container";

export const dynamic = "force-dynamic";

export default function Page() {
  // ไม่มีการเรียกหลังบ้าน ใส่ UI-only
  return (
    <div className="w-full">
      <AdminLoginLandingPage apiBase={baseUrl} />
    </div>
  );
}
