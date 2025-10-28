import { IAuthRepository } from "@/core/ports/auth.repository";
import { AuthResponse, LoginRequest } from "@/core/domain/auth";
import { HttpHelper } from "@/lib/http";
import { ApiResponse } from "@/interface/response";
import { IUser } from "@/interface/user";

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

  async getUserData(token: string): Promise<ApiResponse<IUser>> {
    const response = await this.http.get<ApiResponse<IUser>>(`/v1/auth/me`, {
      Authorization: `Bearer ${token}`,
    });
    return response;
  }

  async LoginV2(data: LoginRequest): Promise<ApiResponse<IUser>> {
    const response = await this.http.post<ApiResponse<IUser>>(
      `/v2/auth/login`,
      data,
    );
    console.log("response", response);

    return response;
  }

  async createCredentailForgetPassowrd(payload: {
    email: string;
  }): Promise<ApiResponse<{ message?: string }>> {
    const response = await this.http.post<ApiResponse<{ message?: string }>>(
      `/v1/auth/forget-password`,
      payload,
    );
    return response;
  }

  async requestPasswordReset(payload: {
    email: string;
  }): Promise<ApiResponse<{ message?: string }>> {
    const response = await this.createCredentailForgetPassowrd(payload);
    return response;
  }
}
