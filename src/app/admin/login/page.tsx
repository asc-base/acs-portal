"use client";
import { useState } from "react";
import { Typography, TextField, Button, Link } from "@mui/material";
import Image from "next/image";
import LOGINADMINLOGO from "../../../../public/loginadminlogo.png";
import { InputAdornment, IconButton } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { loginAdmin } from "./action";

export default function LoginAdminPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleLogin = async () => {
    if (!username || !password) return;

    setIsLoading(true);
    try {
      const success = await loginAdmin({ email: username, password });
      if (success) {
        // Redirect to admin dashboard or refresh page
        window.location.href = "/admin";
      } else {
        alert("เข้าสู่ระบบไม่สำเร็จ กรุณาตรวจสอบอีเมลและรหัสผ่าน");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="flex min-h-screen">
      <div
        style={{ backgroundColor: "#F8F6FF" }}
        className="flex w-1/2 items-center justify-center"
      >
        <div className="w-full">
          <Image
            src={LOGINADMINLOGO}
            alt="Login Illustration"
            width={640}
            height={832}
            className="h-auto w-full"
          />
        </div>
      </div>

      <div className="flex w-1/2 items-center justify-center p-8">
        <div className="w-full max-w-xl">
          <Typography
            variant="h3"
            fontWeight="bold"
            className="!text-h1 text-primary03 !mb-6"
          >
            Welcome Admin
          </Typography>

          <TextField
            fullWidth
            label="อีเมล"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="อีเมล"
            variant="outlined"
            margin="normal"
            slotProps={{
              inputLabel: {
                shrink: true,
              },
            }}
            sx={{
              "& label": {
                color: "var(--color-neutral04)",
              },
              "&:hover label, &:hover .MuiOutlinedInput-root:not(.Mui-focused) label":
                {
                  color: "var(--color-primary04)",
                },
              "& label.Mui-focused": {
                color: "var(--color-primary03)",
              },
              "& label.Mui-error": {
                color: "var(--color-accent04)",
              },
              "& .MuiOutlinedInput-root": {
                height: 44,
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "var(--color-primary03)",
                  borderWidth: 3,
                },
                "&:hover:not(.Mui-focused) .MuiOutlinedInput-notchedOutline": {
                  borderColor: "var(--color-primary04)",
                  borderWidth: 1,
                },
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "var(--color-neutral03)",
                  borderWidth: 1,
                },
                "&.Mui-error .MuiOutlinedInput-notchedOutline": {
                  borderColor: "var(--color-accent04)",
                  borderWidth: 1,
                },
              },
              "& input::placeholder": {
                color: "var(--color-neutral04)",
              },
            }}
          />
          <TextField
            fullWidth
            label="รหัสผ่าน"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="รหัสผ่าน"
            variant="outlined"
            margin="normal"
            slotProps={{
              inputLabel: {
                shrink: true,
              },
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={togglePasswordVisibility} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
            sx={{
              "& label": {
                color: "var(--color-neutral04)",
              },
              "&:hover label, &:hover .MuiOutlinedInput-root:not(.Mui-focused) label":
                {
                  color: "var(--color-primary04)",
                },
              "& label.Mui-focused": {
                color: "var(--color-primary03)",
              },
              "& label.Mui-error": {
                color: "var(--color-accent04)",
              },
              "& .MuiOutlinedInput-root": {
                height: 44,
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "var(--color-primary03)",
                  borderWidth: 3,
                },
                "&:hover:not(.Mui-focused) .MuiOutlinedInput-notchedOutline": {
                  borderColor: "var(--color-primary04)",
                  borderWidth: 1,
                },
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "var(--color-neutral03)",
                  borderWidth: 1,
                },
                "&.Mui-error .MuiOutlinedInput-notchedOutline": {
                  borderColor: "var(--color-accent04)",
                  borderWidth: 1,
                },
              },
              "& input::placeholder": {
                color: "var(--color-neutral04)",
              },
            }}
          />

          <div className="-mt-2 mb-4 text-right">
            <Link
              href="/"
              underline="hover"
              className="!text-h6 !text-neutral05"
            >
              ลืมรหัสผ่าน ?
            </Link>
          </div>

          <Button
            fullWidth
            variant="contained"
            size="large"
            className="rounded-sm"
            onClick={handleLogin}
            disabled={isLoading || !username || !password}
            sx={{
              backgroundColor: "var(--color-primary02)",
              color: "var(--color-neutral01)",
              "&:hover": {
                backgroundColor: "var(--color-primary03)",
              },
              "&:disabled": {
                backgroundColor: "var(--color-neutral03)",
                color: "var(--color-neutral04)",
              },
            }}
          >
            {isLoading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
          </Button>
        </div>
      </div>
    </div>
  );
}
