import { IAuthRepository } from "../ports/auth.repository";
import { ApiResponse } from "@/interface/response";
import { IUser } from "../domain/user";
import {
  ResetPasswordCredential,
  ResetPasswordPayload,
} from "../domain/auth";

export class AuthService {
  constructor(private readonly authRepository: IAuthRepository) {}

  /** ===== ของเดิม: ห้ามแก้ ===== */
  async LoginAdmin(data: { email: string; password: string }) {
    return this.authRepository.LoginAdmin(data);
  }
  async getUserData(token: string) {
    const response = await this.authRepository.getUserData(token);
    return response.data;
  }

  async Login(data: { email: string; password: string }) {
    return this.authRepository.Login(data);
  }

  async createCredentialForgetPassword(email: string): Promise<ApiResponse<ResetPasswordCredential>> {
    return this.authRepository.createCredentialForgetPassword(email);
  }

  async getCredentials(referenceCode: string): Promise<ApiResponse<ResetPasswordCredential>> {
    return this.authRepository.getCredentials(referenceCode);
  }

  async resetPassword(
    payload: ResetPasswordPayload,
  ): Promise<ApiResponse<{ msg?: string }>> {
    return this.authRepository.resetPassword(payload);
  }

  async getUser(): Promise<void | IUser | null> {
    const user = await this.authRepository.getUser();
    return user;
  }

  async logout(): Promise<void> {
    this.authRepository.Logout();
  }
}
