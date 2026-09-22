"use client";
import { clientAuthService } from "./infra/auth-client";
import { useAuthStore } from "./store/auth";

export const initialLoad = async () => {
  try {
    const user = await clientAuthService.getUser();
    if (!user) {
      useAuthStore.getState().setUser(null);
    } else {
      useAuthStore.getState().setUser(user);
    }
  } catch (error) {
    console.error("Failed to initialize user session:", error);
    // Ensure user state is cleared on any error
    useAuthStore.getState().setUser(null);
  }
};
