"use client";
import Image from "next/image";
import { Button, Typography } from "@mui/material";
import { RHFTextField } from "@/shared/components/form/RHFTextField";
import { useForgetPasswordForm } from "@/features/auth/hooks/useForgetPasswordForm";

export default function ForgetPasswordAuthLandingPage() {
  const {
    control,
    errors,
    isPending,
    message,
    isError,
    submit,
  } = useForgetPasswordForm();

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

          {message && !isError ? (
            <section
              role="status"
              className="mt-8 rounded-xl bg-green-50 p-6 text-center text-green-800"
            >
              <Typography variant="h5" className="!font-semibold">
                ส่งลิงก์ตั้งรหัสผ่านไปยังอีเมลแล้ว
              </Typography>
              <Typography component="p" className="mt-3">
                {message}
              </Typography>
            </section>
          ) : (
            <>
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

              <form onSubmit={submit} className="mt-8 space-y-5">
                <RHFTextField
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
                    disabled={isPending}
                    className="!h-12 w-full !bg-[var(--color-primary02)] !text-base !normal-case shadow-md hover:!bg-[#1b1361] md:w-1/2"
                  >
                    ส่งลิงก์ตั้งรหัสผ่านใหม่
                  </Button>
                </div>

                {message && isError ? (
                  <p
                    role="alert"
                    className="mt-3 rounded-xl bg-red-50 p-3 text-sm text-red-800"
                  >
                    {message}
                  </p>
                ) : null}
              </form>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
