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
    const response = await this.http.post<ApiResponse<AuthResponse>>(
      `/v1/auth/login-admin`,
      data,
    );
    return response;
  }
}
