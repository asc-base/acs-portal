import { IAuthRepository } from "@/core/ports/auth.repository";
import { AuthResponse, LoginRequest } from "@/core/domain/auth";
import { HttpHelper } from "@/lib/http";
import { ApiResponse } from "@/interface/response";
export class AuthRepository implements IAuthRepository {
  private http: HttpHelper;
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
    this.http = new HttpHelper(this.baseUrl);
  }

  async LoginAdmin(data: LoginRequest): Promise<ApiResponse<AuthResponse>> {
    return this.http.post<ApiResponse<AuthResponse>>(
      `/v1/auth/login-admin`,
      data
    );
  }

  async createCredentailForgetPassowrd(
    payload: { email: string }
  ): Promise<ApiResponse<{ message?: string }>> {
    return this.http.post<ApiResponse<{ message?: string }>>(
      `/v1/auth/forget-password`,
      payload
    );
  }

  async requestPasswordReset(
    payload: { email: string }
  ): Promise<ApiResponse<{ message?: string }>> {
    return this.createCredentailForgetPassowrd(payload);
  }
}
