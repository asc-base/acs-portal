import { z } from "zod";

export const LoginRequestSchema = z.object({
  email: z.string(),
  password: z.string(),
});

export const AdminLoginFormSchema = z.object({
  email: z.string().trim().email("กรุณากรอกอีเมลที่ถูกต้อง"),
  password: z.string().min(6, "รหัสผ่านอย่างน้อย 6 ตัวอักษร"),
});

export const StudentLoginFormSchema = z.object({
  email: z.string().trim(),
  password: z.string().min(1, "รหัสผ่านอย่างน้อย 6 ตัวอักษร"),
  remember: z.boolean(),
});

export const AuthTokensSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
});

export const ForgetPasswordSchema = z.object({
  email: z.string().min(1, "กรุณากรอกอีเมล").email("รูปแบบอีเมลไม่ถูกต้อง"),
});

export const ForgetPasswordRequestSchema = ForgetPasswordSchema;
export const ForgetPasswordResponseSchema = z
  .object({ message: z.string().optional() })
  .nullable();

export const ResetPasswordSchema = z
  .object({
    password: z.string().min(6, "รหัสผ่านอย่างน้อย 6 ตัวอักษร"),
    confirmPassword: z.string().min(6, "ยืนยันรหัสผ่านอย่างน้อย 6 ตัวอักษร"),
  })
  .refine((v) => v.password === v.confirmPassword, {
    message: "รหัสผ่านไม่ตรงกัน",
    path: ["confirmPassword"],
  });

export const ResetPasswordRequestSchema = z.object({
  refferenceCode: z.string(),
  password: z.string().min(6, "รหัสผ่านอย่างน้อย 6 ตัวอักษร"),
});
