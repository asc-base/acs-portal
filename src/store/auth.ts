import { IUser } from "@/core/domain/user";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthState {
  user: IUser | null;
}

export interface AuthActions {
  setUser: (user: IUser | null) => void;
  clearUser: () => void;
}

export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set(() => ({ user })),
      clearUser: () => set(() => ({ user: null })),
    }),
    {
      name: "auth-storage",
      // Optional: you can specify which parts of the state to persist
      partialize: (state) => ({ user: state.user }),
    },
  ),
);
