import React from "react";
import { FormProjects } from "./form.projects";
import { baseUrl } from "@/infra/container";

export const dynamic = "force-dynamic";

export default function page() {
  return <FormProjects apiBase={baseUrl} />;
}
