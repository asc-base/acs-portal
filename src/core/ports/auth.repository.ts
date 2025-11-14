import { ApiResponse } from "@/interface/response";
import {
  LoginRequest,
  AuthResponse,
  ResetPasswordPayload,
} from "../domain/auth";
import { IUser } from "../domain/user";
import { ForgetPasswordPayload, ForgetPasswordResponse } from "../domain/auth";

export interface IAuthRepository {
  LoginAdmin(data: LoginRequest): Promise<ApiResponse<AuthResponse>>;
  getUserData(token: string): Promise<ApiResponse<IUser>>;
  LoginV2(data: LoginRequest): Promise<ApiResponse<IUser>>;
  createCredentailForgetPassowrd(
    payload: ForgetPasswordPayload,
  ): Promise<ApiResponse<ForgetPasswordResponse>>;
  resetPassword(
    data: ResetPasswordPayload,
  ): Promise<ApiResponse<ForgetPasswordResponse>>;
  getUser(): Promise<IUser | null>;
}
