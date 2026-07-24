import { ApiResponse } from "@/interface/response";
import {
  LoginRequest,
  ResetPasswordCredential,
  ResetPasswordPayload,
  AuthResponse,
} from "../domain/auth";
import { IUser } from "../domain/user";

export interface IAuthRepository {
  LoginAdmin(data: LoginRequest): Promise<ApiResponse<AuthResponse>>;
  getUserData(token: string): Promise<ApiResponse<IUser>>;
  Login(data: LoginRequest): Promise<ApiResponse<IUser>>;
  createCredentialForgetPassword(
    email : string,
  ): Promise<ApiResponse<ResetPasswordCredential>>;
  getCredentials(referenceCode: string): Promise<ApiResponse<ResetPasswordCredential>>;
  resetPassword(
    data: ResetPasswordPayload,
  ): Promise<ApiResponse<{ msg?: string }>>;
  getUser(): Promise<IUser | null>;
  Logout(): Promise<void>;
}
