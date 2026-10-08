"use client";

import { useEffect } from "react";
import { useCurrentUser } from "@/features/auth/client";
import { useAuthStore } from "@/features/auth/store/auth";

export function useInitialLoad() {
  const { data, isError, isFetchedAfterMount, isFetching } = useCurrentUser();
  const setUser = useAuthStore((state) => state.setUser);
  const clearUser = useAuthStore((state) => state.clearUser);

  useEffect(() => {
    if (!isFetchedAfterMount || isFetching) {
      return;
    }

    if (isError) {
      clearUser();
    } else {
      setUser(data ?? null);
    }
  }, [clearUser, data, isError, isFetchedAfterMount, isFetching, setUser]);
}
