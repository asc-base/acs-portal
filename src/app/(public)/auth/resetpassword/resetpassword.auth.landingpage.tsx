"use client";

import * as React from "react";
import Image from "next/image";
import { Button, Typography, IconButton, InputAdornment } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { RHFTextField } from "@/components/form/RHFTextField";

/* ===== Schema & Types ===== */
const Schema = z
  .object({
    password: z.string().min(6, "รหัสผ่านอย่างน้อย 6 ตัวอักษร"),
    confirmPassword: z.string().min(6, "ยืนยันรหัสผ่านอย่างน้อย 6 ตัวอักษร"),
  })
  .refine((v) => v.password === v.confirmPassword, {
    message: "รหัสผ่านไม่ตรงกัน",
    path: ["confirmPassword"],
  });

type FormValues = z.infer<typeof Schema>;

export default function ResetPasswordAuthLandingPage() {
  const [showPwd, setShowPwd] = React.useState(false);
  const [showPwd2, setShowPwd2] = React.useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
  } = useForm<FormValues>({
    resolver: zodResolver(Schema),
    defaultValues: { password: "", confirmPassword: "" },
    mode: "onChange",
  });

  const onSubmit = async () => {
    try {
      await new Promise((r) => setTimeout(r, 400)); // MOCK
      alert("เปลี่ยนรหัสผ่านสำเร็จ (Mock)");
      reset();
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
              type={showPwd ? "text" : "password"}
              aria-invalid={!!errors.password}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label={showPwd ? "ซ่อนรหัสผ่าน" : "แสดงรหัสผ่าน"}
                      onClick={() => setShowPwd((s) => !s)}
                      edge="end"
                    >
                      {showPwd ? <VisibilityOff /> : <Visibility />}
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
              type={showPwd2 ? "text" : "password"}
              aria-invalid={!!errors.confirmPassword}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label={showPwd2 ? "ซ่อนรหัสผ่าน" : "แสดงรหัสผ่าน"}
                      onClick={() => setShowPwd2((s) => !s)}
                      edge="end"
                    >
                      {showPwd2 ? <VisibilityOff /> : <Visibility />}
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
