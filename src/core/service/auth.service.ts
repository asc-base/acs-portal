import { IAuthRepository } from "../ports/auth.repository";
export class AuthService {
  constructor(private authRepository: IAuthRepository) {}

  async LoginAdmin(data: { email: string; password: string }) {
    return this.authRepository.LoginAdmin(data);
  }
}
