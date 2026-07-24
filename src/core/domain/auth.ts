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

export interface ResetPasswordCredential {
  referenceCode : string;
  expiredAt : Date;
}

export interface ResetPasswordPayload {
  referenceCode: string;
  newPassword: string;
}
