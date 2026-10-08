"use client";

import { useInitialLoad } from "@/features/auth/initial-load";

export default function InitialLoader({
  children,
}: {
  children: React.ReactNode;
}) {
  useInitialLoad();
  return <>{children}</>;
}
