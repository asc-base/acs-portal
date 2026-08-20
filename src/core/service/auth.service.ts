import { IAuthRepository } from "../ports/auth.repository";
import { ApiResponse } from "@/interface/response";
import { UserProfile } from "../domain/user";
import {
  ForgetPasswordPayload,
  ForgetPasswordResponse,
  ResetPasswordPayload,
} from "../domain/auth";

export class AuthService {
  constructor(private readonly authRepository: IAuthRepository) {}

  async getUserData(token: string) {
    const response = await this.authRepository.getUserData(token);
    return response.data;
  }

  async Login(data: { email: string; password: string }) {
    return this.authRepository.Login(data);
  }

  async createCredentailForgetPassowrd(
    payload: ForgetPasswordPayload,
  ): Promise<ApiResponse<ForgetPasswordResponse>> {
    return this.authRepository.createCredentailForgetPassowrd(payload);
  }

  async resetPassword(
    payload: ResetPasswordPayload,
  ): Promise<ApiResponse<ForgetPasswordResponse>> {
    return this.authRepository.resetPassword(payload);
  }

  async getUser(): Promise<UserProfile | null> {
    return this.authRepository.getUser();
  }

  async logout(): Promise<void> {
    this.authRepository.Logout();
  }
}
