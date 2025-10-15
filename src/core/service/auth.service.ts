import { IAuthRepository } from "../ports/auth.repository";
export class AuthService {
  constructor(private authRepository: IAuthRepository) {}

  async LoginAdmin(data: { email: string; password: string }) {
    return this.authRepository.LoginAdmin(data);
  }
  async getUserData(token: string) {
    const response = await this.authRepository.getUserData(token);
    return response.data;
  }

  async LoginV2(data: { email: string; password: string }) {
    return this.authRepository.LoginV2(data);
  }
}
