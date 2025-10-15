import { ApiResponse } from "@/interface/response";
import { LoginRequest, AuthResponse } from "../domain/auth";
import { IUser } from "../domain/user";

export interface IAuthRepository {
  LoginAdmin(data: LoginRequest): Promise<ApiResponse<AuthResponse>>;
  getUserData(token: string): Promise<ApiResponse<IUser>>;
  LoginV2(data: LoginRequest): Promise<ApiResponse<IUser>>;
}
