import { LoginRequest } from "../domain/auth";
import { IAuthRepository } from "../ports/auth.repository";

export class AuthService {
  constructor(private authRepository: IAuthRepository) {}

  async loginAdmin(data: LoginRequest): Promise<boolean> {
    try {
      await this.authRepository.LoginAdmin(data);
      return true;
    } catch (error) {
      console.error("Login failed:", error);
      return false;
    }
  }
}
