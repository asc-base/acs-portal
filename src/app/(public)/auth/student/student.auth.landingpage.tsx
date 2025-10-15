"use client";

import * as React from "react";
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
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { RHFTextField } from "@/components/form/RHFTextField";
import { authService } from "@/infra/container";

const Schema = z.object({
  email: z.string().trim(),
  password: z.string().min(1, "รหัสผ่านอย่างน้อย 6 ตัวอักษร"),
  remember: z.boolean(),
});
type FormValues = z.infer<typeof Schema>;

export default function StudentAuthLandingPage() {
  const [showPwd, setShowPwd] = React.useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    // reset,
    setError,
  } = useForm<FormValues>({
    resolver: zodResolver(Schema),
    defaultValues: { email: "", password: "", remember: true },
    mode: "onChange",
    reValidateMode: "onChange",
  });

  const onSubmit = async (data: FormValues) => {
    try {
      await new Promise((r) => setTimeout(r, 400)); // mock
      if (data.email === "00000000000") {
        setError("email", { type: "manual", message: "ไม่พบบัญชีผู้ใช้" });
        return;
      }

      const loginRequest = {
        email: data.email,
        password: data.password,
      };

      const reps = await authService.LoginV2(loginRequest);

      console.log("reps", reps);

      // await authService.LoginV2(loginRequest);

      console.log("Login with", data);

      // alert(`Mock Login สำเร็จ\nEmail: ${data.email}`);
      // reset({ email: "", password: "", remember: data.remember });
    } catch {
      setError("password", {
        type: "manual",
        message: "เกิดข้อผิดพลาด กรุณาลองใหม่",
      });
    }
  };

  const onInvalid = () => {
    const el = document.querySelector(
      "[aria-invalid='true']",
    ) as HTMLElement | null;
    el?.focus();
  };

  return (
    // <lg = 1 คอลัมน์ (ซ่อนรูป) | >=lg = 2 คอลัมน์
    <main className="grid min-h-screen w-screen grid-cols-1 overflow-x-hidden bg-white lg:grid-cols-2">
      {/* LEFT: แสดงเฉพาะเมื่อ >= lg */}
      <section className="relative hidden h-full w-full bg-[#F3F0FF] lg:block">
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
              className="text-left !leading-tight !font-extrabold text-[#2A179C]"
              sx={{
                // xs=มือถือ, sm=เล็ก, md=แท็บเล็ต, lg=เดสก์ท็อป
                fontSize: { xs: 28, sm: 32, md: 40, lg: 48 },
                lineHeight: 1.15,
              }}
            >
              Welcome Back!
            </Typography>

            <p
              className="mt-2 text-left text-[#2F27B3]"
              style={{
                fontSize: "14px", // มือถือ
              }}
            >
              สวัสดีนักศึกษาสาขาวิทยาการคอมพิวเตอร์ประยุกต์ฯ
            </p>

            <form
              onSubmit={handleSubmit(onSubmit, onInvalid)}
              className="mt-8 w-full space-y-5"
              noValidate
            >
              <RHFTextField<FormValues>
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

              <RHFTextField<FormValues>
                name="password"
                control={control}
                label="รหัสผ่าน"
                placeholder="********"
                type={showPwd ? "text" : "password"}
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
                <a href="#" className="text-sm text-gray-600 hover:underline">
                  ลืมรหัสผ่าน ?
                </a>
              </div>

              <Button
                type="submit"
                variant="contained"
                fullWidth
                className="!h-12 !bg-[#1E156B] !text-base !normal-case shadow-md hover:!bg-[#1b1361]"
              >
                เข้าสู่ระบบ
              </Button>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}
