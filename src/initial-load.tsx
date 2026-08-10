"use client";
import { AuthRepository } from "./infra/repositories/auth.repository";
import { AuthService } from "./core/service/auth.service";
import { useAuthStore } from "./store/auth";

export const initialLoad = async (apiBase: string) => {
  const authRepository = new AuthRepository(apiBase);
  const authService = new AuthService(authRepository);
  try {
    const user = await authService.getUser();
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
