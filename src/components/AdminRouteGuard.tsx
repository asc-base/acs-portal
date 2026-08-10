"use client";

import { ReactNode, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AuthRepository } from "@/infra/repositories/auth.repository";
import { AuthService } from "@/core/service/auth.service";
import { isAdminUser } from "@/lib/admin-access";
import { useAuthStore } from "@/store/auth";

interface AdminRouteGuardProps {
  apiBase: string;
  children: ReactNode;
}

/**
 * Verifies the current cookie-backed session before exposing any admin UI.
 * This is intentionally based on the server profile, not persisted client
 * state, so a stale or edited local-storage value cannot grant access.
 */
export const AdminRouteGuard = ({
  apiBase,
  children,
}: AdminRouteGuardProps) => {
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);
  const clearUser = useAuthStore((state) => state.clearUser);
  const [isAuthorized, setIsAuthorized] = useState(false);

  const authService = useMemo(
    () => new AuthService(new AuthRepository(apiBase)),
    [apiBase],
  );

  useEffect(() => {
    let isActive = true;

    const verifyAccess = async () => {
      try {
        const user = await authService.getUser();

        if (!isActive) {
          return;
        }

        if (isAdminUser(user)) {
          setUser(user);
          setIsAuthorized(true);
          return;
        }

        if (user) {
          setUser(user);
        } else {
          clearUser();
        }
      } catch {
        // A failed profile request is treated as an unauthenticated session.
        if (isActive) {
          clearUser();
        }
      }

      if (isActive) {
        router.replace("/home");
      }
    };

    verifyAccess();

    return () => {
      isActive = false;
    };
  }, [authService, clearUser, router, setUser]);

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
