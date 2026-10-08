"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useResetPassword } from "@/features/auth/client";
import { ResetPasswordSchema } from "@/features/auth/schema/auth";

export function useResetPasswordForm(referenceCode: string) {
  const router = useRouter();
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
    try {
      await mutateAsync({ refferenceCode: referenceCode, password: data.password });
      alert("เปลี่ยนรหัสผ่านสำเร็จ");
      form.reset();
      router.push("/auth/login");
    } catch {
      form.setError("password", {
        type: "manual",
        message: "เกิดข้อผิดพลาด กรุณาลองใหม่",
      });
    }
  });

  const { errors } = form.formState;
  return { ...form, errors, isPending, submit };
}
