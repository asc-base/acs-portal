"use client";
import { authService } from "./infra/container";
import { useAuthStore } from "./store/auth";

export const initialLoad = async () => {
  const user = await authService.getUser();
  if (!user) {
    useAuthStore.getState().setUser(null);
  } else {
    useAuthStore.getState().setUser(user);
  }
};
