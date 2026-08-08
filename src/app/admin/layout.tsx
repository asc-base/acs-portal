import { ReactNode } from "react";
import { baseUrl } from "@/infra/container";
import AdminClientLayout from "./admin-client-layout";

export const dynamic = "force-dynamic";

const Layout = ({ children }: Readonly<{ children: ReactNode }>) => {
  return <AdminClientLayout apiBase={baseUrl}>{children}</AdminClientLayout>;
};
export default Layout;
