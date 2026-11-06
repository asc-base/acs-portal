"use client";

import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { isAdminUser } from "@/features/auth/lib/admin-access";
import { useAuthStore } from "@/features/auth/store/auth";
import { useCurrentUser } from "@/features/auth/client";

interface AdminRouteGuardProps {
  children: ReactNode;
}

/**
 * Verifies the current cookie-backed session before exposing any admin UI.
 * This is intentionally based on a fresh server profile, not persisted state.
 */
export const AdminRouteGuard = ({ children }: AdminRouteGuardProps) => {
  const router = useRouter();
  const storedUser = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);
  const clearUser = useAuthStore((state) => state.clearUser);
  const { data, isError, isFetchedAfterMount, isFetching } = useCurrentUser();
  const isAuthorized =
    isFetchedAfterMount &&
    !isFetching &&
    !isError &&
    isAdminUser(data) &&
    storedUser === data;

  useEffect(() => {
    if (!isFetchedAfterMount || isFetching) {
      return;
    }

    const user = isError ? null : data;
    if (user && isAdminUser(user)) {
      setUser(user);
      return;
    }

    if (isError || !user) {
      clearUser();
    } else {
      setUser(user);
    }
    router.replace("/home");
  }, [
    clearUser,
    data,
    isError,
    isFetchedAfterMount,
    isFetching,
    router,
    setUser,
    storedUser,
  ]);

  if (!isAuthorized) {
    return (
      <main
        aria-busy="true"
        aria-label="Checking access permission"
        className="min-h-screen bg-white"
      />
    );
  }

  return <>{children}</>;
};
