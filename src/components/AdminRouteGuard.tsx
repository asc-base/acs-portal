"use client";

import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isAdminUser } from "@/lib/admin-access";
import { useAuthStore } from "@/store/auth";
import { clientAuthService } from "@/infra/auth-client";

interface AdminRouteGuardProps {
  children: ReactNode;
}

/**
 * Verifies the current cookie-backed session before exposing any admin UI.
 * This is intentionally based on the server profile, not persisted client
 * state, so a stale or edited local-storage value cannot grant access.
 */
export const AdminRouteGuard = ({ children }: AdminRouteGuardProps) => {
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);
  const clearUser = useAuthStore((state) => state.clearUser);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    let isActive = true;

    const verifyAccess = async () => {
      try {
        const user = await clientAuthService.getUser();

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
  }, [clearUser, router, setUser]);

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
