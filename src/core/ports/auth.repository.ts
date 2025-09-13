import { ApiResponse } from "@/interface/response";
import { LoginRequest, AuthResponse } from "../domain/auth";

export interface IAuthRepository {
  LoginAdmin(data: LoginRequest): Promise<ApiResponse<AuthResponse>>;
}
