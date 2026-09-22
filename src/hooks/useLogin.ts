"use client";

import { useMutation, type UseMutationResult } from "@tanstack/react-query";
import { LoginRequest } from "@/core/domain/auth";
import { UserProfile } from "@/core/domain/user";
import { clientAuthService } from "@/infra/auth-client";

export function useLogin(): UseMutationResult<
  UserProfile,
  Error,
  LoginRequest
> {
  return useMutation({
    mutationKey: ["auth", "login"],
    mutationFn: async (credentials) => {
      await clientAuthService.Login(credentials);
      const user = await clientAuthService.getUser();

      if (!user) {
        throw new Error("Unable to load the authenticated user");
      }

      return user;
    },
  });
}
