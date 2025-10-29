"use client";
import { useState } from "react";
import Image from "next/image";
import { Button, Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { RHFTextField } from "@/components/form/RHFTextField";
import { authService } from "@/infra/container";
import { ForgetPasswordSchema } from "@/core/schema/auth";

/* ===== Schema & Types ===== */
const Schema = ForgetPasswordSchema;
type FormValues = z.infer<typeof Schema>;

export default function ForgetPasswordAuthLandingPage() {
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(Schema),
    defaultValues: { email: "" },
    mode: "onChange",
  });

  const onSubmit = async (data: FormValues) => {
    setMessage(null);
    setSubmitting(true);
    try {
      const response = await authService.createCredentailForgetPassowrd({
        email: data.email,
      });
      if (!response.status) {
        setMessage(
          "ระบบได้ส่งรหัสผ่านชั่วคราวไปยังอีเมลของคุณแล้ว โปรดตรวจสอบอีเมล",
        );
        reset();
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <main className="min-h-screen w-full bg-[var(--background)]">
      <div className="mx-auto flex min-h-screen w-full items-center justify-center px-4 py-10">
        <div className="w-full max-w-[680px] bg-[var(--background)] p-8">
          <div className="flex justify-center">
            <Image
              src="/logoacs-nonbg.png"
              alt="ACS Logo"
              width={160}
              height={80}
              priority
              quality={90}
              sizes="(max-width: 640px) 96px, (max-width: 768px) 112px, (max-width: 1024px) 128px, 160px"
              className="h-auto w-24 object-contain sm:w-28 md:w-32 lg:w-40"
            />
          </div>

          <Typography
            variant="h5"
            className="mt-6 text-center !font-semibold text-[var(--color-primary01)]"
            sx={{
              fontSize: { xs: "18px", sm: "20px", md: "24px", lg: "28px" },
              lineHeight: 1.4,
            }}
          >
            กรอกอีเมลของคุณ
          </Typography>

          {/* FORM */}
          <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
            <RHFTextField<FormValues>
              name="email"
              control={control}
              label="อีเมล"
              placeholder="xxxxxxxx@kmutt.ac.th"
              type="email"
              aria-invalid={!!errors.email}
            />

            <div className="flex justify-center">
              <Button
                type="submit"
                variant="contained"
                disabled={submitting}
                className="!h-12 w-full !bg-[var(--color-primary02)] !text-base !normal-case shadow-md hover:!bg-[#1b1361] md:w-1/2"
              >
                {submitting ? "กำลังส่ง..." : "ส่งรหัสผ่าน"}
              </Button>
            </div>

            {message ? (
              <p className="mt-3 rounded-xl bg-green-50 p-3 text-sm text-green-800">
                {message}
              </p>
            ) : null}
          </form>
        </div>
      </div>
    </main>
  );
}
