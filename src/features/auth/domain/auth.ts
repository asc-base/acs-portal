import type { z } from "zod";
import type {
  AuthTokensSchema,
  ForgetPasswordRequestSchema,
  ForgetPasswordResponseSchema,
  LoginRequestSchema,
  ResetPasswordRequestSchema,
} from "@/features/auth/schema/auth";

export interface Auth {
  id: string;
  email: string;
  name: string;
  role: string;
}

export type LoginRequest = z.infer<typeof LoginRequestSchema>;
export type AuthTokens = z.infer<typeof AuthTokensSchema>;
export type ForgetPasswordPayload = z.infer<typeof ForgetPasswordRequestSchema>;
export type ForgetPasswordResponse = z.infer<typeof ForgetPasswordResponseSchema>;
export type ResetPasswordPayload = z.infer<typeof ResetPasswordRequestSchema>;
