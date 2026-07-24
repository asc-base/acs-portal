import { IAuthRepository } from "@/core/ports/auth.repository";
import {
  AuthResponse,
  LoginRequest,
  ResetPasswordCredential,
  ResetPasswordPayload,
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
    const response = await this.http.get<ApiResponse<IUser>>(
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

  async createCredentialForgetPassword(email: string): Promise<ApiResponse<ResetPasswordCredential>> {
    const response = await this.http.post<ApiResponse<ResetPasswordCredential>>(
      `/v1/auth/credentials`,
      { email },
    );
    return response;
  }

  async getCredentials(referenceCode: string): Promise<ApiResponse<ResetPasswordCredential>> {
    const response = await this.http.get<ApiResponse<ResetPasswordCredential>>(
      `/v1/auth/credentials/${referenceCode}`,
    );
    return response;
  }

  async resetPassword(
    payload : ResetPasswordPayload,
  ): Promise<ApiResponse<{ msg?: string }>> {
    const response = await this.http.post<ApiResponse<{ msg?: string }>>(
      `/v1/auth/reset-password/${payload.referenceCode}`,
      { newPassword: payload.newPassword },
    );
    return response;
  }

  async getUser(): Promise<IUser | null> {
    return authErrorHandler.withAuthErrorHandling(async () => {
      const response =
        await this.http.get<ApiResponse<IUser>>(`/v1/users/profile`);
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
