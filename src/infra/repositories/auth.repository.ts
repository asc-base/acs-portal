import { IAuthRepository } from "@/core/ports/auth.repository";
import {
  ForgetPasswordResponse,
  LoginRequest,
} from "@/core/domain/auth";
import { HttpHelper } from "@/lib/http";
import { ApiResponse } from "@/interface/response";
import { IUser } from "@/interface/user";
import { UserProfile } from "@/core/domain/user";
import { authErrorHandler } from "@/lib/auth-error-handler";

export class AuthRepository implements IAuthRepository {
  private readonly http: HttpHelper;
  private readonly baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
    this.http = new HttpHelper(this.baseUrl);
  }

  async getUserData(token: string): Promise<ApiResponse<UserProfile>> {
    const response = await this.http.get<ApiResponse<UserProfile>>(
      `/v1/users/profile`,
      {
        Authorization: `Bearer ${token}`,
      },
    );
    return response;
  }

  async Login(data: LoginRequest): Promise<ApiResponse<IUser>> {
    const response = await this.http.post<ApiResponse<IUser>>(
      `/v1/auth/login`,
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

  async getUser(): Promise<UserProfile | null> {
    return authErrorHandler.withAuthErrorHandling(async () => {
      const response =
        await this.http.get<ApiResponse<UserProfile>>(`/v1/users/profile`);
      if (!response.data) {
        return null;
      }
      return response.data;
    });
  }

  async Logout(): Promise<void> {
    authErrorHandler.withAuthErrorHandling(async () => {
      await this.http.post<void>(`/v1/auth/logout`);
    });
  }
}
