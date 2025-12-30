import React from "react";
import { FormClassbook } from "./form.classbook";
import { baseUrl } from "@/infra/container";

export const dynamic = "force-dynamic";

export default function pge() {
  return (
    <div>
      <FormClassbook apiBase={baseUrl} />
    </div>
  );
}
