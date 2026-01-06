import React from "react";
import { FormProfesssors } from "./form.professor";
import { baseUrl } from "@/infra/container";

export const dynamic = "force-dynamic";

export default function page() {
  return <FormProfesssors apiBase={baseUrl} />;
}
