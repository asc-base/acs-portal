import { IUser } from "@/core/domain/user";
import { create } from "zustand";

interface AuthState {
  user: IUser | null;
}

export interface AuthActions {
  setUser: (user: IUser | null) => void;
  clearUser: () => void;
}

export const useAuthStore = create<AuthState & AuthActions>((set) => ({
  user: null,
  setUser: (user) => set(() => ({ user })),
  clearUser: () => set(() => ({ user: null })),
}));
