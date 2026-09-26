"use client";

import { useEffect } from "react";
import { initialLoad } from "@/initial-load";

export default function InitialLoader({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    // Run initial load on client side
    initialLoad().catch(console.error);
  }, []);

  return <>{children}</>;
}
