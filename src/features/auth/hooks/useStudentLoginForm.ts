"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useLogin } from "@/features/auth/client";
import { StudentLoginFormSchema } from "@/features/auth/schema/auth";
import { HttpError } from "@/shared/lib/http";

export function useStudentLoginForm() {
  const router = useRouter();
  const { mutateAsync: login, isPending } = useLogin();
  const form = useForm<
    z.input<typeof StudentLoginFormSchema>,
    unknown,
    z.output<typeof StudentLoginFormSchema>
  >({
    resolver: zodResolver(StudentLoginFormSchema),
    defaultValues: { email: "", password: "", remember: true },
    mode: "onChange",
    reValidateMode: "onChange",
  });

  const submit = form.handleSubmit(async (data) => {
    if (data.email === "00000000000") {
      form.setError("email", { type: "manual", message: "ไม่พบบัญชีผู้ใช้" });
      return;
    }

    try {
      await login({ email: data.email, password: data.password });
      router.push("/home");
    } catch (error) {
      form.setError("password", {
        type: "manual",
        message:
          error instanceof HttpError && error.status === 401
            ? "ข้อมูลการเข้าสู่ระบบไม่ถูกต้อง"
            : "เกิดข้อผิดพลาด กรุณาลองใหม่",
      });
    }
  }, focusInvalidField);

  const { errors } = form.formState;
  return { ...form, errors, isPending, submit };
}

function focusInvalidField() {
  const el = document.querySelector("[aria-invalid='true']") as HTMLElement | null;
  el?.focus();
}
