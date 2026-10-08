"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useLogin } from "@/features/auth/client";
import { isAdminUser } from "@/features/auth/lib/admin-access";
import { AdminLoginFormSchema } from "@/features/auth/schema/auth";
import { useAuthStore } from "@/features/auth/store/auth";
import { HttpError } from "@/shared/lib/http";

export function useAdminLoginForm() {
  const router = useRouter();
  const clearUser = useAuthStore((state) => state.clearUser);
  const { mutateAsync: login, isPending } = useLogin();
  const form = useForm<
    z.input<typeof AdminLoginFormSchema>,
    unknown,
    z.output<typeof AdminLoginFormSchema>
  >({
    resolver: zodResolver(AdminLoginFormSchema),
    defaultValues: { email: "", password: "" },
    mode: "onChange",
    reValidateMode: "onChange",
  });

  const submit = form.handleSubmit(async (data) => {
    try {
      const user = await login(data);
      if (!isAdminUser(user)) {
        clearUser();
        form.setError("password", {
          type: "manual",
          message: "บัญชีนี้ไม่มีสิทธิ์เข้าถึงระบบผู้ดูแล",
        });
        return;
      }

      router.replace("/admin/classbook");
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
