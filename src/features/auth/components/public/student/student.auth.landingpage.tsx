"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Button,
  Typography,
  FormControlLabel,
  Checkbox,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { Controller } from "react-hook-form";
import { RHFTextField } from "@/shared/components/form/RHFTextField";
import Link from "next/link";
import { useStudentLoginForm } from "@/features/auth/hooks/useStudentLoginForm";

export default function StudentAuthLandingPage() {
  const [showPassword, setShowPassword] = useState(false);
  const {
    control,
    errors,
    isPending,
    submit,
  } = useStudentLoginForm();

  return (
    // <lg = 1 คอลัมน์ (ซ่อนรูป) | >=lg = 2 คอลัมน์
    <main className="grid min-h-screen w-screen grid-cols-1 overflow-x-hidden bg-[var(--background)] lg:grid-cols-2">
      {/* LEFT: แสดงเฉพาะเมื่อ >= lg */}
      <section className="relative hidden h-full w-full bg-[var(--background)] lg:block">
        <Image
          src="/ImageLoginAdmin.svg"
          alt="Student illustration"
          fill
          priority
          className="object-cover object-left-bottom"
        />
      </section>

      {/* RIGHT: ฟอร์ม*/}
      <section className="flex h-full w-full items-center justify-center px-6">
        <div className="mx-auto w-full max-w-[1200px] px-0 md:px-6 lg:px-8">
          <div className="mx-auto w-full max-w-[520px]">
            <Typography
              variant="h3"
              className="text-left !leading-tight !font-extrabold text-[var(--color-primary02)]"
              sx={{
                // xs=มือถือ, sm=เล็ก, md=แท็บเล็ต, lg=เดสก์ท็อป
                fontSize: { xs: 28, sm: 32, md: 40, lg: 48 },
                lineHeight: 1.15,
              }}
            >
              Welcome Back!
            </Typography>

            <p
              className="mt-2 text-left text-[var(--color-primary03)]"
              style={{
                fontSize: "14px", // มือถือ
              }}
            >
              สวัสดีนักศึกษาสาขาวิทยาการคอมพิวเตอร์ประยุกต์ฯ
            </p>

            <form
              onSubmit={submit}
              className="mt-8 w-full space-y-5"
              noValidate
            >
              <RHFTextField
                name="email"
                control={control}
                label="รหัสนักศึกษา"
                placeholder="เช่น 67000000001"
                requiredMark
                inputProps={{
                  inputMode: "numeric",
                }}
                aria-invalid={!!errors.email}
              />

              <RHFTextField
                name="password"
                control={control}
                label="รหัสผ่าน"
                placeholder="********"
                type={showPassword ? "text" : "password"}
                aria-invalid={!!errors.password}
                sx={{
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#4F46E5",
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#4338CA",
                  },
                  "& .Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#4F46E5",
                  },
                  borderRadius: "8px",
                }}
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

              <div className="flex items-center justify-between">
                <Controller
                  control={control}
                  name="remember"
                  render={({ field: { value, onChange, ref } }) => (
                    <FormControlLabel
                      inputRef={ref}
                      control={
                        <Checkbox
                          checked={!!value}
                          onChange={(e) => onChange(e.target.checked)}
                        />
                      }
                      label="จดจำฉันไว้"
                    />
                  )}
                />
                <Link href="/auth/forget-password">
                  <span className="text-sm text-gray-600 hover:underline">
                    ลืมรหัสผ่าน ?
                  </span>
                </Link>
              </div>

              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={isPending}
                className="!h-12 !bg-[var(--color-primary02)] !text-base !normal-case shadow-md hover:!bg-[#1b1361]"
              >
                {isPending ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
              </Button>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}
