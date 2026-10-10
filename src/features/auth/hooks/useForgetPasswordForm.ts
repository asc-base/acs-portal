"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useForgetPassword } from "@/features/auth/client";
import { ForgetPasswordSchema } from "@/features/auth/schema/auth";
import { HttpError } from "@/shared/lib/http";

const requestMessage =
  "หากอีเมลนี้มีบัญชีในระบบ เราจะส่งลิงก์ตั้งรหัสผ่านใหม่ไปให้ โปรดตรวจสอบอีเมล";

export function useForgetPasswordForm() {
  const [message, setMessage] = useState<string | null>(null);
  const [isError, setIsError] = useState(false);
  const { mutateAsync, isPending } = useForgetPassword();
  const form = useForm<
    z.input<typeof ForgetPasswordSchema>,
    unknown,
    z.output<typeof ForgetPasswordSchema>
  >({
    resolver: zodResolver(ForgetPasswordSchema),
    defaultValues: { email: "" },
    mode: "onChange",
  });

  const submit = form.handleSubmit(async (data) => {
    setMessage(null);
    setIsError(false);
    try {
      const response = await mutateAsync({ email: data.email });
      if (response.status !== 200) {
        throw new Error("Password reset request failed");
      }
      setMessage(requestMessage);
      form.reset();
    } catch (error) {
      if (error instanceof HttpError && error.status === 404) {
        setMessage(requestMessage);
        form.reset();
        return;
      }
      setIsError(true);
      setMessage("ส่งคำขอไม่สำเร็จ กรุณาลองใหม่อีกครั้ง");
    }
  });

  const { errors } = form.formState;
  return { ...form, errors, message, isError, isPending, submit };
}
