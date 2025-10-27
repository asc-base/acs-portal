import { ApiResponse } from "@/interface/response";
import { LoginRequest, AuthResponse } from "../domain/auth";

export type ForgetPasswordPayload = { email: string };
export type ForgetPasswordResponse = { message?: string };

export interface IAuthRepository {
  LoginAdmin(data: LoginRequest): Promise<ApiResponse<AuthResponse>>;

  createCredentailForgetPassowrd(
    payload: ForgetPasswordPayload
  ): Promise<ApiResponse<ForgetPasswordResponse>>;

  requestPasswordReset?(
    payload: ForgetPasswordPayload
  ): Promise<ApiResponse<ForgetPasswordResponse>>;
}
