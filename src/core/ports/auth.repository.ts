import { ApiResponse } from "@/interface/response";
import {
  LoginRequest,
  AuthResponse,
  ResetPasswordPayload,
  ForgetPasswordPayload,
  ForgetPasswordResponse,
} from "../domain/auth";
import { IUser } from "../domain/user";

export interface IAuthRepository {
  LoginAdmin(data: LoginRequest): Promise<ApiResponse<AuthResponse>>;
  getUserData(token: string): Promise<ApiResponse<IUser>>;
  Login(data: LoginRequest): Promise<ApiResponse<IUser>>;
  createCredentailForgetPassowrd(
    payload: ForgetPasswordPayload,
  ): Promise<ApiResponse<ForgetPasswordResponse>>;
  resetPassword(
    data: ResetPasswordPayload,
  ): Promise<ApiResponse<ForgetPasswordResponse>>;
  getUser(): Promise<IUser | null>;
  Logout(): Promise<void>;
}
