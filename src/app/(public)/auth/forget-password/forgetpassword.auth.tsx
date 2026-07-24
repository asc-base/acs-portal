"use client";
import { useMemo, useState } from "react";
import Image from "next/image";
import { Button, Typography, Snackbar, Alert } from "@mui/material";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { RHFTextField } from "@/components/form/RHFTextField";
import { AuthService } from "@/core/service/auth.service";
import { AuthRepository } from "@/infra/repositories/auth.repository";
import { useRouter } from "next/navigation";

export const ForgetPasswordSchema = z.object({
  email: z
    .string()
    .min(1, "กรุณากรอกอีเมลของท่าน")
    .email("รูปแบบอีเมลไม่ถูกต้อง"),
});

const Schema = ForgetPasswordSchema;
type FormValues = z.infer<typeof Schema>;

export default function ForgetPasswordAuthLandingPage({
  apiBase,
}: {
  apiBase: string;
}) {
  const [submitting, setSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);

  const router = useRouter();

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

  const authService = useMemo(() => {
    const authRepository = new AuthRepository(apiBase);
    return new AuthService(authRepository);
  }, [apiBase]);

  const handleCloseAlert = () => {
    setIsSuccess(false);
    setIsError(false);
  };

  const onSubmit = async (data: FormValues) => {
    setSubmitting(true);
    setIsSuccess(false);
    setIsError(false);

    try {
      const response = await authService.createCredentialForgetPassword(
        data.email,
      );

      if (response.status) {
        setIsSuccess(true);
        reset();
        setTimeout(() => {
          router.replace("/auth/student");
        }, 4000);
      } else {
        setIsError(true);
      }
    } catch (error) {
      console.error(error);
      setIsError(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-120px)] items-center justify-center px-4">
      {/* Success Snackbar */}
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={isSuccess}
        autoHideDuration={4000}
        onClose={handleCloseAlert}
      >
        <Alert
          severity="success"
          onClose={handleCloseAlert}
          sx={{ width: "100%" }}
        >
          ระบบได้ส่งลิงก์สำหรับรีเซ็ตรหัสผ่านไปยังอีเมลของคุณแล้ว
        </Alert>
      </Snackbar>

      {/* Error Snackbar */}
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={isError}
        autoHideDuration={4000}
        onClose={handleCloseAlert}
      >
        <Alert
          severity="error"
          onClose={handleCloseAlert}
          sx={{ width: "100%" }}
        >
          ไม่สามารถส่งคำขอรีเซ็ตรหัสผ่านได้ กรุณาลองใหม่อีกครั้ง
        </Alert>
      </Snackbar>

      <div className="w-full max-w-[680px] rounded-2xl p-8 shadow-md">
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
            fontSize: {
              xs: "18px",
              sm: "20px",
              md: "24px",
              lg: "28px",
            },
            lineHeight: 1.4,
          }}
        >
          กรอกอีเมลของคุณ
        </Typography>

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
              {submitting ? "กำลังส่ง..." : "รับรหัสผ่านชั่วคราว"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
