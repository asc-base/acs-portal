import React from "react";
import ForgetpasswordAuth from "./forgetpassword.auth";
import { baseUrl } from "@/infra/container";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function Page() {
  return (
    <div className="w-full">
      <ForgetpasswordAuth apiBase={baseUrl} />
    </div>
  );
}
