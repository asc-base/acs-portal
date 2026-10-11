import { IAuthRepository } from "../ports/auth.repository";
import { ApiResponse } from "@/shared/types/response";
import { UserProfile } from "@/shared/domain/user";
import {
  ForgetPasswordPayload,
  ForgetPasswordResponse,
  LoginRequest,
  ResetPasswordPayload,
} from "@/features/auth/domain/auth";
import {
  ForgetPasswordRequestSchema,
  LoginRequestSchema,
  ResetPasswordRequestSchema,
} from "@/features/auth/schema/auth";

export class AuthService {
  constructor(private readonly authRepository: IAuthRepository) {}

  async getUserData(token: string) {
    const response = await this.authRepository.getUserData(token);
    return response.data;
  }

  async Login(data: LoginRequest) {
    return this.authRepository.Login(LoginRequestSchema.parse(data));
  }

  async createCredentailForgetPassowrd(
    payload: ForgetPasswordPayload,
  ): Promise<ApiResponse<ForgetPasswordResponse>> {
    return this.authRepository.createCredentailForgetPassowrd(
      ForgetPasswordRequestSchema.parse(payload),
    );
  }

  async resetPassword(
    payload: ResetPasswordPayload,
  ): Promise<ApiResponse<ForgetPasswordResponse>> {
    return this.authRepository.resetPassword(
      ResetPasswordRequestSchema.parse(payload),
    );
  }

  async getUser(): Promise<UserProfile | null> {
    return this.authRepository.getUser();
  }

  async logout(): Promise<void> {
    await this.authRepository.Logout();
  }
}
