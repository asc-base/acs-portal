import React from "react";
import StudentAuthLandingPage from "./student.auth.landingpage";

export default function Page() {
  // ไม่มีการเรียกหลังบ้าน ใส่ UI-only
  return (
    <div className="w-full">
      <StudentAuthLandingPage />
    </div>
  );
}
