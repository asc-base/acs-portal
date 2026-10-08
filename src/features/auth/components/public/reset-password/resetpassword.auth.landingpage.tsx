"use client";

import { useState } from "react";
import Image from "next/image";
import { Button, Typography, IconButton, InputAdornment } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { RHFTextField } from "@/shared/components/form/RHFTextField";
import { useResetPasswordForm } from "@/features/auth/hooks/useResetPasswordForm";

interface ResetPasswordAuthLandingPageProps {
  referenceCode: string;
}

export default function ResetPasswordAuthLandingPage({
  referenceCode,
}: ResetPasswordAuthLandingPageProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const {
    control,
    errors,
    isPending,
    submit,
  } = useResetPasswordForm(referenceCode);

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
          <form onSubmit={submit} className="mt-8 space-y-5">
            <RHFTextField
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

            <RHFTextField
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
                disabled={isPending}
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
