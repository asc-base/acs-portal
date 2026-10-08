"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useForgetPassword } from "@/features/auth/client";
import { ForgetPasswordSchema } from "@/features/auth/schema/auth";

export function useForgetPasswordForm() {
  const [message, setMessage] = useState<string | null>(null);
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
    try {
      const response = await mutateAsync({ email: data.email });
      if (!response.status) {
        setMessage(
          "ระบบได้ส่งรหัสผ่านชั่วคราวไปยังอีเมลของคุณแล้ว โปรดตรวจสอบอีเมล",
        );
        form.reset();
      }
    } catch (error) {
      console.log(error);
    }
  });

  const { errors } = form.formState;
  return { ...form, errors, message, isPending, submit };
}
