import { IAuthRepository } from "@/features/auth/ports/auth.repository";
import {
  AuthTokens,
  ForgetPasswordPayload,
  ForgetPasswordResponse,
  LoginRequest,
  ResetPasswordPayload,
} from "@/features/auth/domain/auth";
import { HttpHelper } from "@/shared/lib/http";
import { ApiResponse } from "@/shared/types/response";
import { UserProfile } from "@/shared/domain/user";
import { authErrorHandler } from "@/features/auth/lib/auth-error-handler";
import {
  AuthTokensSchema,
  ForgetPasswordResponseSchema,
} from "@/features/auth/schema/auth";
import { UserProfileSchema } from "@/shared/schema/profile-response";

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
    response.data = UserProfileSchema.parse(response.data);
    return response;
  }

  async Login(data: LoginRequest): Promise<ApiResponse<AuthTokens>> {
    const response = await this.http.post<ApiResponse<AuthTokens>>(
      `/v1/auth/login`,
      data,
    );
    response.data = AuthTokensSchema.parse(response.data);
    return response;
  }

  async createCredentailForgetPassowrd(
    payload: ForgetPasswordPayload,
  ): Promise<ApiResponse<ForgetPasswordResponse>> {
    const response = await this.http.post<ApiResponse<ForgetPasswordResponse>>(
      `/v1/auth/credentials`,
      payload,
    );
    response.data = ForgetPasswordResponseSchema.parse(response.data);
    return response;
  }

  async resetPassword(
    payload: ResetPasswordPayload,
  ): Promise<ApiResponse<ForgetPasswordResponse>> {
    const response = await this.http.post<ApiResponse<ForgetPasswordResponse>>(
      `/v1/auth/reset-password/${encodeURIComponent(payload.token)}`,
      { newPassword: payload.newPassword },
    );
    response.data = ForgetPasswordResponseSchema.parse(response.data);
    return response;
  }

  async getUser(): Promise<UserProfile | null> {
    return authErrorHandler.withAuthErrorHandling(async () => {
      const response =
        await this.http.get<ApiResponse<UserProfile>>(`/v1/users/profile`);
      if (!response.data) {
        return null;
      }
      return UserProfileSchema.parse(response.data);
    });
  }

  async Logout(): Promise<void> {
    await authErrorHandler.withAuthErrorHandling(async () => {
      await this.http.post<void>(`/v1/auth/logout`);
    });
  }
}
