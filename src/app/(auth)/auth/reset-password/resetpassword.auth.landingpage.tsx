"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import {
  Button,
  Typography,
  IconButton,
  InputAdornment,
  Snackbar,
  Alert,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { RHFTextField } from "@/components/form/RHFTextField";
import { ResetPasswordSchema } from "@/core/schema/auth";
import { AuthService } from "@/core/service/auth.service";
import { AuthRepository } from "@/infra/repositories/auth.repository";
import { useRouter } from "next/navigation";

interface ResetPasswordAuthLandingPageProps {
  referenceCode: string;
  apiBase: string;
}

type FormValues = z.infer<typeof ResetPasswordSchema>;

export default function ResetPasswordAuthLandingPage({
  referenceCode,
  apiBase,
}: ResetPasswordAuthLandingPageProps) {
  const authService = useMemo(() => {
    const authRepository = new AuthRepository(apiBase);
    return new AuthService(authRepository);
  }, [apiBase]);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const router = useRouter();

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
  } = useForm<FormValues>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: { password: "", confirmPassword: "" },
    mode: "onChange",
  });

  const onSubmit = async (formData: FormValues) => {
    try {
      await authService.resetPassword({
        referenceCode: referenceCode,
        newPassword: formData.password,
      });
      reset();
      setIsSuccess(true);
      setTimeout(() => {
        router.replace("/auth/student");
      }, 4000);
    } catch {
      setError("password", {
        type: "manual",
        message: "เกิดข้อผิดพลาด กรุณาลองใหม่",
      });
    }
  };

  return (
    <main className="min-h-screen w-full bg-[var(--background)]">
      <div className="mx-auto flex min-h-screen w-full items-center justify-center px-4 py-10">
        <div className="w-full max-w-[680px] bg-[var(--background)] p-8">
          <Snackbar
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
            open={isSuccess}
            autoHideDuration={4000}
            onClose={() => setIsSuccess(false)}
          >
            <Alert
              severity="success"
              onClose={() => setIsSuccess(false)}
              sx={{ width: "100%" }}
            >
              เปลี่ยนรหัสผ่านสำเร็จ
            </Alert>
          </Snackbar>
          <div className="flex justify-center">
            <Image
              src="/logoacs-nonbg.png"
              alt="ACS Logo"
              width={160}
              height={80}
              priority
              quality={90}
              sizes="(max-width: 640px) 96px, (max-width: 768px) 112px, (max-width: 1024px) 128px, 160px"
              className="/* xs~lg: 96→112→128→160px */ h-auto w-24 object-contain sm:w-28 md:w-32 lg:w-40"
            />
          </div>

          <Typography
            variant="h5"
            className="mt-6 text-center !font-semibold text-[var(--color-primary01)]"
            sx={{
              fontSize: {
                xs: "18px", // mobile
                sm: "20px", // tablet
                md: "24px", // desktop ปกติ
                lg: "28px", // desktop ใหญ่
              },
              lineHeight: 1.4,
            }}
          >
            กรอกรหัสผ่านใหม่ของคุณ
          </Typography>

          {/* FORM */}
          <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
            <RHFTextField<FormValues>
              name="password"
              control={control}
              label="รหัสผ่านใหม่"
              placeholder="xxxxxxxxxxxxxxxxxx"
              type={showPassword ? "text" : "password"}
              aria-invalid={!!errors.password}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label={
                        showPassword ? "ซ่อนรหัสผ่าน" : "แสดงรหัสผ่าน"
                      }
                      onClick={() => setShowPassword((s) => !s)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <RHFTextField<FormValues>
              name="confirmPassword"
              control={control}
              label="ยืนยันรหัสผ่านใหม่"
              placeholder="xxxxxxxxxxxxxxxxxx"
              type={showConfirmPassword ? "text" : "password"}
              aria-invalid={!!errors.confirmPassword}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label={
                        showConfirmPassword ? "ซ่อนรหัสผ่าน" : "แสดงรหัสผ่าน"
                      }
                      onClick={() => setShowConfirmPassword((s) => !s)}
                      edge="end"
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <div className="flex justify-center">
              <Button
                type="submit"
                variant="contained"
                className="!h-12 w-full !bg-[var(--color-primary02)] !text-base !normal-case shadow-md hover:!bg-[#1b1361] md:w-1/2"
              >
                เปลี่ยนรหัสผ่าน
              </Button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
