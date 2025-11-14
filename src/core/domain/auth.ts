export interface Auth {
  id: string;
  email: string;
  name: string;
  role: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  msg: string;
}
export interface ForgetPasswordPayload {
  email: string;
}

export interface ForgetPasswordResponse {
  message?: string;
}

export interface ResetPasswordPayload {
  refferenceCode: string;
  password: string;
}
