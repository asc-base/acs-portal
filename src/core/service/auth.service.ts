import {
  IAuthRepository,
  ForgetPasswordPayload,
  ForgetPasswordResponse,
} from "../ports/auth.repository";
import { ApiResponse } from "@/interface/response";

export class AuthService {
  constructor(private authRepository: IAuthRepository) {}

  /** ===== ของเดิม: ห้ามแก้ ===== */
  async LoginAdmin(data: { email: string; password: string }) {
    return this.authRepository.LoginAdmin(data);
  }

  async createCredentailForgetPassowrd(
    payload: ForgetPasswordPayload
  ): Promise<ApiResponse<ForgetPasswordResponse>> {
    return this.authRepository.createCredentailForgetPassowrd(payload);
  }

  async requestPasswordReset(
    payload: ForgetPasswordPayload
  ): Promise<ApiResponse<ForgetPasswordResponse>> {
    
    if (typeof (this.authRepository as any).requestPasswordReset === "function") {
      return (this.authRepository as any).requestPasswordReset(payload);
    }
    return this.authRepository.createCredentailForgetPassowrd(payload);
  }

  async safeRequestPasswordReset(payload: ForgetPasswordPayload): Promise<
    | { ok: true; message: string | undefined }
    | { ok: false; error: string }
  > {
    try {
      const res = await this.requestPasswordReset(payload);
      const message =
        (res as any)?.data?.message ??
        (res as any)?.message ??
        "ถ้าอีเมลนี้อยู่ในระบบ เราได้ส่งลิงก์รีเซ็ตรหัสผ่านไปให้แล้ว";
      return { ok: true, message };
    } catch {
      return { ok: false, error: "ไม่สามารถดำเนินการได้ กรุณาลองใหม่อีกครั้ง" };
    }
  }
}
