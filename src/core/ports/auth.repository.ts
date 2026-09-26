import { ApiResponse } from "@/interface/response";
import {
  AuthTokens,
  LoginRequest,
  ResetPasswordPayload,
  ForgetPasswordPayload,
  ForgetPasswordResponse,
} from "../domain/auth";
import { UserProfile } from "../domain/user";

export interface IAuthRepository {
  getUserData(token: string): Promise<ApiResponse<UserProfile>>;
  Login(data: LoginRequest): Promise<ApiResponse<AuthTokens>>;
  createCredentailForgetPassowrd(
    payload: ForgetPasswordPayload,
  ): Promise<ApiResponse<ForgetPasswordResponse>>;
  resetPassword(
    data: ResetPasswordPayload,
  ): Promise<ApiResponse<ForgetPasswordResponse>>;
  getUser(): Promise<UserProfile | null>;
  Logout(): Promise<void>;
}
