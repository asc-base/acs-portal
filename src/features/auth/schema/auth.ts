import { z } from "zod";

export const ForgetPasswordSchema = z.object({
  email: z.string().min(1, "กรุณากรอกอีเมล").email("รูปแบบอีเมลไม่ถูกต้อง"),
});

export const ResetPasswordSchema = z
  .object({
    password: z.string().min(6, "รหัสผ่านอย่างน้อย 6 ตัวอักษร"),
    confirmPassword: z.string().min(6, "ยืนยันรหัสผ่านอย่างน้อย 6 ตัวอักษร"),
  })
  .refine((v) => v.password === v.confirmPassword, {
    message: "รหัสผ่านไม่ตรงกัน",
    path: ["confirmPassword"],
  });
