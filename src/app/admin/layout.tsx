import { ReactNode } from "react";
import AdminClientLayout from "@/app/_components/admin-client-layout";

export const dynamic = "force-dynamic";

const Layout = ({ children }: Readonly<{ children: ReactNode }>) => {
  return <AdminClientLayout>{children}</AdminClientLayout>;
};
export default Layout;
