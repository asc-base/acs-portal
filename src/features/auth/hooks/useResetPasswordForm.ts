"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useResetPassword } from "@/features/auth/client";
import { ResetPasswordSchema } from "@/features/auth/schema/auth";

export function useResetPasswordForm(token: string) {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { mutateAsync, isPending } = useResetPassword();
  const form = useForm<
    z.input<typeof ResetPasswordSchema>,
    unknown,
    z.output<typeof ResetPasswordSchema>
  >({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: { password: "", confirmPassword: "" },
    mode: "onChange",
  });

  const submit = form.handleSubmit(async (data) => {
    setErrorMessage(null);
    try {
      await mutateAsync({ token, newPassword: data.password });
      alert("เปลี่ยนรหัสผ่านสำเร็จ");
      form.reset();
      router.replace("/auth/student");
    } catch {
      setErrorMessage("เปลี่ยนรหัสผ่านไม่สำเร็จ กรุณาลองใหม่หรือขอลิงก์ใหม่");
    }
  });

  const { errors } = form.formState;
  return { ...form, errors, errorMessage, isPending, submit };
}
