import React from "react";
import ForgetpasswordAuth from "@/features/auth/components/public/forget-password/forgetpassword.auth";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function Page() {
  
  return (
    <div className="w-full">
      <ForgetpasswordAuth />
    </div>
  );
}