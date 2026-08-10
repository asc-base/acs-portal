"use client";

import { useEffect } from "react";
import { initialLoad } from "@/initial-load";

export default function InitialLoader({
  children,
  apiBase,
}: {
  children: React.ReactNode;
  apiBase: string;
}) {
  useEffect(() => {
    // Run initial load on client side
    initialLoad(apiBase).catch(console.error);
  }, [apiBase]);

  return <>{children}</>;
}
