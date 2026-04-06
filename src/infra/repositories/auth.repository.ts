import { IAuthRepository } from "@/core/ports/auth.repository";
import {
  AuthResponse,
  ForgetPasswordResponse,
  LoginRequest,
} from "@/core/domain/auth";
import { HttpHelper } from "@/lib/http";
import { ApiResponse } from "@/interface/response";
import { IUser } from "@/interface/user";
import { authErrorHandler } from "@/lib/auth-error-handler";

export class AuthRepository implements IAuthRepository {
  private readonly http: HttpHelper;
  private readonly baseUrl: string;

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

  async resetPassword(payload: {
    refferenceCode: string;
    password: string;
  }): Promise<ApiResponse<ForgetPasswordResponse>> {
    const response = await this.http.post<ApiResponse<ForgetPasswordResponse>>(
      `/v1/auth/reset-password`,
      payload,
    );
    return response;
  }

  async getUser(): Promise<IUser | null> {
    return authErrorHandler.withAuthErrorHandling(async () => {
      const response = await this.http.get<ApiResponse<IUser>>(`/v2/auth/me`);
      if (response.data) {
        return response.data;
      }
      return null;
    });
  }

  async Logout(): Promise<void> {
    authErrorHandler.withAuthErrorHandling(async () => {
      await this.http.post<void>(`/v2/auth/logout`);
    });
  }
}
