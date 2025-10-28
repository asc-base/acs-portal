import { ApiResponse } from "@/interface/response";
import { LoginRequest, AuthResponse } from "../domain/auth";
import { IUser } from "../domain/user";

export type ForgetPasswordPayload = { email: string };
export type ForgetPasswordResponse = { message?: string };

export interface IAuthRepository {
  LoginAdmin(data: LoginRequest): Promise<ApiResponse<AuthResponse>>;
  getUserData(token: string): Promise<ApiResponse<IUser>>;
  LoginV2(data: LoginRequest): Promise<ApiResponse<IUser>>;

  createCredentailForgetPassowrd(
    payload: ForgetPasswordPayload,
  ): Promise<ApiResponse<ForgetPasswordResponse>>;

  requestPasswordReset?(
    payload: ForgetPasswordPayload,
  ): Promise<ApiResponse<ForgetPasswordResponse>>;
}
