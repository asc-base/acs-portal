"use client";

import "client-only";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import type { ApiResponse } from "@/shared/types/response";
import { AuthService } from "@/features/auth/service/auth.service";
import { AuthRepository } from "@/features/auth/repositories/auth.repository";
import type {
  ForgetPasswordPayload,
  ForgetPasswordResponse,
  LoginRequest,
  ResetPasswordPayload,
} from "@/features/auth/domain/auth";
import type { UserProfile } from "@/shared/domain/user";
import { baseUrl } from "@/shared/config/api.client";
import { useAuthStore } from "@/features/auth/store/auth";

const authService = new AuthService(new AuthRepository(baseUrl));

export const authQueryKeys = {
  currentUser: ["auth", "session", "current-user"] as const,
};

const currentUserQuery = {
  queryKey: authQueryKeys.currentUser,
  queryFn: () => authService.getUser(),
  retry: false,
  staleTime: 0,
  refetchOnMount: "always" as const,
  refetchOnWindowFocus: false,
};

const clearAuthQueries = async (queryClient: ReturnType<typeof useQueryClient>) => {
  await queryClient.cancelQueries();
  // Reset in place so mounted observers drop old data without refetching private queries.
  queryClient.getQueryCache().getAll().forEach((query) => query.reset());
};

const clearAuthSession = async (
  queryClient: ReturnType<typeof useQueryClient>,
) => {
  await clearAuthQueries(queryClient);
  useAuthStore.getState().clearUser();
};

export function useCurrentUser() {
  return useQuery<UserProfile | null>(currentUserQuery);
}

export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation<UserProfile, Error, LoginRequest>({
    mutationKey: ["auth", "login"],
    retry: false,
    mutationFn: async (credentials) => {
      await authService.Login(credentials);
      await clearAuthSession(queryClient);

      const user = await queryClient.fetchQuery<UserProfile | null>(
        currentUserQuery,
      );
      if (!user) {
        throw new Error("Unable to load the authenticated user");
      }

      useAuthStore.getState().setUser(user);
      return user;
    },
  });
}

export function useLogout({ clearSessionOnError = false } = {}) {
  const queryClient = useQueryClient();

  return useMutation<void, Error, void>({
    mutationKey: ["auth", "logout"],
    retry: false,
    mutationFn: () => authService.logout(),
    onSuccess: () => clearAuthSession(queryClient),
    onError: () =>
      clearSessionOnError ? clearAuthSession(queryClient) : undefined,
  });
}

export function useForgetPassword() {
  return useMutation<
    ApiResponse<ForgetPasswordResponse>,
    Error,
    ForgetPasswordPayload
  >({
    mutationKey: ["auth", "forget-password"],
    retry: false,
    mutationFn: (payload) => authService.createCredentailForgetPassowrd(payload),
  });
}

export function useResetPassword() {
  return useMutation<
    ApiResponse<ForgetPasswordResponse>,
    Error,
    ResetPasswordPayload
  >({
    mutationKey: ["auth", "reset-password"],
    retry: false,
    mutationFn: (payload) => authService.resetPassword(payload),
  });
}
