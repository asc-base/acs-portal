"use client";
import Button from "@mui/material/Button";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import { useRouter } from "next/navigation";

export default function LinkExpireLandingPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen w-full bg-[var(--background)]">
      <div className="mx-auto flex min-h-screen w-full items-center justify-center px-4 py-10">
        <div className="w-full max-w-[680px] p-8">
          <div className="mb-6 flex flex-col items-center">
            <div className="flex justify-center">
              <HighlightOffIcon color="error" fontSize="large" />
            </div>
            <h1
              className="mt-0 mb-3 text-center font-semibold text-[var(--color-primary01)]"
              style={{ fontSize: "clamp(18px, 3vw, 24px)" }}
            >
              ลิงก์หมดอายุแล้ว
            </h1>

            <p className="mb-8 text-center text-[15px] leading-relaxed text-[var(--color-neutral05)]">
              ลิงก์สำหรับรีเซ็ตรหัสผ่านของท่านหมดอายุหรือถูกใช้งานไปแล้ว
              <br />
              กรุณากลับไปหน้าเข้าสู่ระบบเพื่อขอลิงก์ใหม่อีกครั้ง
            </p>

            <Button
              className="inline-flex"
              variant="contained"
              color={"primary"}
              onClick={() => {
                router.push("/auth/student");
              }}
            >
              กลับไปหน้าเข้าสู่ระบบ
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
